import axios from "axios";

export default async function handler(req, res) {
  // Ajouter les headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gérer les requêtes OPTIONS (preflight)
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === "GET") {
    res.status(200).json({ message: "Endpoint opérationnel. Utilisez POST pour générer des briefs." });
    return;
  }

  if (req.method !== "POST") {
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  const apiKey = process.env.OPENAI_API_KEY;
  const { messages } = req.body;

  // Validation des données
  if (!messages || !Array.isArray(messages)) {
    res.status(400).json({ error: "Messages requis et doivent être un tableau" });
    return;
  }

  if (!apiKey) {
    res.status(500).json({ error: "Clé API OpenAI manquante" });
    return;
  }

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o",
        messages,
        max_tokens: 500,
        temperature: 0.8,
      },
      {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
      }
    );
    res.status(200).json(response.data);
  } catch (error) {
    console.error("Erreur OpenAI:", error.response?.data || error.message);
    res.status(500).json({
      error: "Erreur OpenAI",
      details: error.response?.data?.error?.message || error.message
    });
  }
}