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

${state.is_diff 
  ? "CRITICAL: The input is a Git diff (unified diff format). You MUST ONLY analyze security issues introduced by the new/added lines (lines starting with '+'). Do NOT report security issues or vulnerabilities present in unchanged context lines (lines starting with a space) or removed lines (lines starting with '-'). Ignore unchanged code even if it has issues." 
  : ""}

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
                content: `${state.is_diff ? 'Diff:' : 'Code:'}\n${state.code}\n\nLanguage:\n${state.language}\n\n${state.is_diff ? "CRITICAL WARNING: You must ONLY report security issues for lines that start with '+'. Unchanged lines starting with a space (like ' for (let i = 0; ...') must NOT be reported as issues in the JSON 'issues' array. Strictly ignore them." : ""}`
            }
        ])
        const cleaned = response.content.replace(/```json|```/g, '').trim()
        JSON.parse(cleaned) // Validate it is valid JSON
        return { security_feedback: cleaned }

    } catch (error) {
        console.log("Security Agent Error:", error.message)

        return { security_feedback: JSON.stringify({ issues: [], score: 10, summary: "Security analysis failed or returned invalid format." }) }
    }
}