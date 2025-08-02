// File: /api/generate-poem.js

export default async function handler(request, response) {
  // Hanya izinkan metode POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Method Not Allowed' });
  }

  // Ambil API Key dari Environment Variables di Vercel
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    return response.status(500).json({ error: 'API key not configured.' });
  }

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
  
  const payload = {
    contents: [{
        parts: [{ text: "Tuliskan sebuah puisi ulang tahun yang romantis, singkat, dan menyentuh hati untuk pacarku." }]
    }]
  };

  try {
    const geminiResponse = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    if (!geminiResponse.ok) {
      // Log error dari Gemini untuk debugging
      const errorBody = await geminiResponse.text();
      console.error("Gemini API Error:", errorBody);
      throw new Error(`Gemini API request failed with status ${geminiResponse.status}`);
    }

    const result = await geminiResponse.json();
    
    // Kirim kembali respons dari Gemini ke frontend
    response.status(200).json(result);

  } catch (error) {
    console.error("Internal Server Error:", error);
    response.status(500).json({ error: 'Failed to generate poem.' });
  }
}
