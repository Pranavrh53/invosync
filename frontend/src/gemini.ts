import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Generative AI with the API key
const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);

// Get the generative model
const model = genAI.getGenerativeModel({ 
  model: "gemini-2.5-pro",
  generationConfig: {
    temperature: 0.7,
    topK: 1,
    topP: 1,
    maxOutputTokens: 2048,
  },
});

// System prompt to make the chatbot specific to InvoSync
const SYSTEM_PROMPT = `
You are a helpful assistant for InvoSync, an invoice and payment management system.
Key guidelines:
- Always respond in a professional and helpful tone.
- Focus on providing accurate information about invoices, clients, and payments.
- When explaining features, be concise and provide step-by-step instructions.
- If you're unsure about something, direct users to the help section or contact support.
- Do not provide information about unrelated topics.
`;

export async function generateResponse(
  prompt: string, 
  chatHistory: Array<{role: 'user' | 'model', parts: { text: string }[]}> = []
): Promise<string> {
  try {
    // Build the chat with system prompt and history
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
        {
          role: "model",
          parts: [{ text: "Hello! I'm your InvoSync assistant. How can I help you with your invoices or payments today?" }],
        },
        ...chatHistory
      ],
      generationConfig: {
        maxOutputTokens: 1000,
      },
    });

    // Send the message and get the response
    const result = await chat.sendMessage(prompt);
    const response = await result.response;
    return response.text();
  } catch (error) {
    console.error("Error generating response:", error);
    throw new Error("I'm having trouble connecting to the AI service. Please try again later.");
  }
}