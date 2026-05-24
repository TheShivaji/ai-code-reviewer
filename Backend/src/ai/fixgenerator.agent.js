import { gemini } from "./model.js"

export const fix_generator = async (state) => {
    try {
        const response = await gemini.invoke([
            {
                role: "system",
                content: `
You are a senior software engineer.

Your job:
1. Read the original code
2. Read all agent feedbacks
3. Generate a corrected version of the code
4. Fix ALL critical and high severity issues

Rules:
- Return the complete fixed code
- Add comments where you made changes: // FIXED: reason
- Do NOT change working code
- Return ONLY the fixed code, no explanation outside code
        `
            },
            {
                role: "user",
                content: `
Original Code:
${state.code}

Language: ${state.language}

Security Issues: ${state.security_feedback}
Bug Issues: ${state.bug_feedback}
Performance Issues: ${state.performance_feedback}
        `
            }
        ])

        return { fixed_code: response.content }

    } catch (error) {
        console.log("Fix Generator Error:", error.message)
        return { fixed_code: "Fix generation failed." }
    }
}