import { z } from "zod"
import { gemini } from "./model.js"
import { traceable } from "langsmith/traceable"

const issueSchema = z.object({
  title: z.string().describe("Short issue title"),
  severity: z.enum(["Critical", "High", "Medium", "Low", "Warning"]),
  description: z.string().describe("Details of the security vulnerability"),
  fix: z.string().describe("Suggested fix or code"),
})

const securitySchema = z.object({
  issues: z.array(issueSchema).describe("List of security vulnerabilities found"),
  score: z.number().min(0).max(100).describe("Security score from 0 to 100"),
  summary: z.string().describe("Overall summary of security analysis"),
})

const structuredSecurityModel = gemini.withStructuredOutput(securitySchema)

export const security_agent = traceable(
  async (state) => {
    try {
      const response = await structuredSecurityModel.invoke([
        {
          role: "system",
          content: `You are a senior security engineer. Analyze the code for SQL Injection, XSS, Hardcoded secrets, CORS issues, and Rate limiting.
${state.is_diff ? "CRITICAL: The input is a Git diff. You MUST ONLY analyze issues introduced by the new/added lines (lines starting with '+')." : ""}`
        },
        {
          role: "user",
          content: `${state.is_diff ? 'Diff:' : 'Code:'}\n${state.code}\n\nLanguage:\n${state.language}`
        }
      ])

      return { security_feedback: JSON.stringify(response) }

    } catch (error) {
      console.log("Security Agent Error:", error.message)
      return { security_feedback: JSON.stringify({ issues: [], score: 10, summary: "Security analysis failed." }) }
    }
  },
  { name: "security_agent", run_type: "chain" }
)
