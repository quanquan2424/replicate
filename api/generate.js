// api/generate.js

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }
  const prompt = req.body?.input?.prompt;
  if (!prompt) {
    return res.status(400).json({ error: "Missing prompt in request body" });
  }

  const replicateApiToken = process.env.REPLICATE_API_TOKEN;
  const replicateModelVersion = process.env.REPLICATE_MODEL_VERSION;

  try {
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Authorization": `Token ${replicateApiToken}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        version: replicateModelVersion,
        input: { prompt }
      })
    });

    const prediction = await response.json();

    // Trả về link ảnh đầu ra
    res.status(200).json({
      id: prediction.id,
      status: prediction.status,
      output: prediction.output
    });

  } catch (err) {
    res.status(500).json({ error: "Something went wrong", detail: err.message });
  }
}
