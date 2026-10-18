import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import dotenv from 'dotenv'
dotenv.config()

export const gemini = new ChatGoogleGenerativeAI({
    model: "gemini-3.8-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.2,
    maxRetries: 1, // Fail fast, avoid 100s exponential retry loops
})



// All agents routed to Gemini
export const llama = gemini
export const groq = gemini
export const mistral = gemini