import { ChatMistralAI } from '@langchain/mistralai'
import { ChatGroq } from '@langchain/groq'
import { ChatGoogleGenerativeAI } from '@langchain/google-genai'
import dotenv from 'dotenv'
dotenv.config()


export const llama = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.2,
})

export const groq = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.2,
})

const geminiPrimary = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.2,
    maxRetries: 0,
})

export const gemini = geminiPrimary.withFallbacks({
    fallbacks: [groq],
})

export const mistral = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.2,
})