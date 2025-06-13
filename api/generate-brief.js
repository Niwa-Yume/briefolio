export default async function handler(req, res) {
  console.log('🚀 API appelée:', req.method, req.url);

  // Headers CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  // Gérer OPTIONS
  if (req.method === 'OPTIONS') {
    console.log('✅ OPTIONS request handled');
    res.status(200).end();
    return;
  }

  // Gérer GET
  if (req.method === "GET") {
    console.log('✅ GET request handled');
    res.status(200).json({
      message: "Endpoint opérationnel",
      timestamp: new Date().toISOString(),
      hasApiKey: !!process.env.OPENAI_API_KEY,
      nodeVersion: process.version
    });
    return;
  }

  // Vérifier POST
  if (req.method !== "POST") {
    console.log('❌ Méthode non autorisée:', req.method);
    res.status(405).json({ error: "Méthode non autorisée" });
    return;
  }

  console.log('📝 POST request body:', JSON.stringify(req.body, null, 2));

  // Vérifier la clé API
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY manquante');
    res.status(500).json({
      error: "Configuration serveur incomplète",
      details: "Clé API OpenAI manquante"
    });
    return;
  }
  console.log('✅ Clé API présente, longueur:', apiKey.length);

  // Valider les messages
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    console.error('❌ Messages invalides:', messages);
    res.status(400).json({ error: "Messages requis et doivent être un tableau" });
    return;
  }
  console.log('✅ Messages valides, nombre:', messages.length);

  try {
    console.log('🔄 Envoi requête à OpenAI...');

    // Utiliser fetch au lieu d'axios pour éviter les problèmes d'import
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: "gpt-4o",
        messages,
        max_tokens: 500,
        temperature: 0.8,
      }),
    });

    console.log('📡 Réponse OpenAI status:', response.status);

    if (!response.ok) {
      const errorData = await response.text();
      console.error('❌ Erreur OpenAI:', response.status, errorData);
      res.status(500).json({
        error: "Erreur OpenAI",
        status: response.status,
        details: errorData
      });
      return;
    }

    const data = await response.json();
    console.log('✅ Réponse OpenAI reçue');
    res.status(200).json(data);

  } catch (error) {
    console.error('❌ Erreur dans try/catch:', error);
    res.status(500).json({
      error: "Erreur serveur",
      details: error.message
    });
  }
}