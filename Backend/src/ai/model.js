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

const geminiModel = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: process.env.GEMINI_API_KEY,
    temperature: 0.2,
    maxRetries: 0, // fail fast, don't retry - go to fallback immediately
})

const groqFallback = new ChatGroq({
    model: "llama-3.3-70b-versatile",
    apiKey: process.env.GROQ_API_KEY,
    temperature: 0.2,
})

// Custom robust wrapper: Gemini primary, Groq fallback on ANY failure
// withFallbacks() doesn't reliably catch quota/rate limit errors from Google SDK
export const gemini = {
    invoke: async (messages) => {
        try {
            const result = await geminiModel.invoke(messages)
            console.log('[Model] Gemini responded successfully')
            return result
        } catch (error) {
            console.log(`[Model] Gemini failed (${error.message?.substring(0, 80)}...), switching to Groq fallback`)
            return await groqFallback.invoke(messages)
        }
    }
}

export const mistral = new ChatMistralAI({
    model: "mistral-large-latest",
    apiKey: process.env.MISTRAL_API_KEY,
    temperature: 0.2,
})