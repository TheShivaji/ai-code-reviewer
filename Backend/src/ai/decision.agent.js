import { gemini } from "./model.js"

export const decision_layer = async (state) => {
    try {
        const response = await gemini.invoke([
            {
                role: "system",
                content: `
You are a senior engineering lead.

Based on all agent feedbacks, assign overall severity.

Rules:
- If any Critical issue exists → severity: "Critical"
- If only High/Medium issues → severity: "Warning"  
- If only Low issues → severity: "Low"
- Return ONLY this JSON, nothing else:
{
  "severity": "Critical" | "Warning" | "Low",
  "critical_count": number,
  "warning_count": number,
  "low_count": number
}
        `
            },
            {
                role: "user",
                content: `
Security: ${state.security_feedback}
Bugs: ${state.bug_feedback}
Performance: ${state.performance_feedback}
Best Practices: ${state.best_practices_feedback}
        `
            }
        ])

        const cleaned = response.content.replace(/```json|```/g, '').trim()
        const parsed = JSON.parse(cleaned)
        return { severity: parsed }

    } catch (error) {
        console.log("Decision Layer Error:", error.message)
        return { severity: { severity: "Warning", critical_count: 0, warning_count: 0, low_count: 0 } }
    }
}