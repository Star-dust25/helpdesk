const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export const getGroqChatCompletion = async (messages, model = "qwen/qwen3.8-27b") => {
  const apiKey = import.meta.env.VITE_GROQ_API_KEY;
  
  if (!apiKey || apiKey === 'tu_api_key_aqui') {
    throw new Error('La API Key no está configurada en el archivo .env');
  }

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.5,
      max_tokens: 500,
    })
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error?.message || 'Error desconocido en la API');
  }

  const data = await response.json();
  return data.choices[0].message.content;
};
