// Ce code tourne sur le serveur, personne ne peut le voir.
export default async function handler(req, res) {
  // 1. Sécurité : On vérifie que c'est bien une méthode POST
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { prompt } = req.body;

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({ error: 'Clé API manquante côté serveur' });
  }

  try {
    // 2. Appel à Google Gemini depuis le serveur
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${process.env.GEMINI_API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();

    // 3. On renvoie juste le texte à votre site
    if (data.candidates && data.candidates.length > 0) {
      return res.status(200).json({ 
        text: data.candidates[0].content.parts[0].text 
      });
    } else {
      throw new Error("Pas de réponse de l'IA");
    }

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Erreur lors de la génération' });
  }
}
```

#### Étape C : Modifier le Frontend (Le code HTML que je vous ai donné)

Dans le fichier HTML que je vous ai fourni précédemment, vous devez changer **uniquement** la fonction `callGemini` pour qu'elle appelle votre nouveau fichier `api/gemini` au lieu d'appeler Google directement.

Voici la nouvelle fonction à remplacer dans le script :

```javascript
// Remplacez l'ancienne fonction callGemini par celle-ci :
async function callGemini(prompt) {
    try {
        // Au lieu d'appeler Google, on appelle VOTRE route API interne
        // Assurez-vous que le chemin '/api/gemini' correspond à l'emplacement de votre fichier serveur
        const response = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: prompt })
        });
        
        if (!response.ok) throw new Error('Erreur serveur');
        
        const data = await response.json();
        return data.text; // On récupère le texte renvoyé par votre serveur

    } catch (error) {
        console.error("Erreur de communication :", error);
        return "Désolé, l'assistant est momentanément indisponible.";
    }
}
