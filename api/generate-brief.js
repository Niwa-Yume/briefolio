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

  // Validation de la clé API
  if (!apiKey) {
    res.status(500).json({ error: "Clé API OpenAI manquante" });
    return;
  }

  // Utiliser les messages spécifiques au lieu de ceux du body
  const messages = [
    {
      role: "system",
      content: "Tu es un expert en découverte de Product-Market Fit pour des projets web simples mais pérennes (stratégie \"chameau\" : frugal, rentable tôt, zéro burn-rate) soit créatif pour les idées et innov.",
    },
    {
      role: "user",
      content: "## Mission\n" +
        "\n" +
        "Propose **5 idées de projets web codables** (SaaS, jeu, outil, plateforme…) qui :\n" +
        "\n" +
        "1. ciblent **≥ 1** des thèmes : AI · Tech · Webtoon/Manga · Esport · Blockchain · Fun étudiants tech 2025 · Apprentissage du japonais · mini-jeux Three.js., sécurité, F1, Script, Webdesign, Web, Blockchain\n"
    }
  ];

  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
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