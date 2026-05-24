import { mistral } from "./model.js"

export const security_agent = async (state) => {
    try {
        const response = await mistral.invoke([
            {
                role: "system",
                content: `
You are a senior security engineer.

Analyze the code for:
1. SQL Injection
2. XSS
3. Hardcoded secrets
4. CORS issues
5. Rate limiting

Return ONLY valid JSON.

Format:
{
  "issues": [
    {
      "title": "",
      "severity": "",
      "description": "",
      "fix": ""
    }
  ],
  "score": 0,
  "summary": ""
}

Rules:
- No markdown
- No explanations outside JSON
- No code fences
`
            },
            {
                role: "user",
                content: `Code:\n${state.code}\n\nLanguage:\n${state.language}`
            }
        ])

        return { security_feedback: response.content }

    } catch (error) {
        console.log("Security Agent Error:", error.message)

        return { security_feedback: "Security analysis failed." }
    }
}