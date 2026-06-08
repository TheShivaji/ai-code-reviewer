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

${state.is_diff 
  ? "CRITICAL: The original code is a Git diff (unified diff format) containing context lines and added/removed lines. Your goal is to output the final corrected version of the block of code represented in the diff (incorporating the changes from the diff, but fixing the issues identified in the new/added lines). Do NOT include '+' or '-' prefixes or git diff headers in your output. Just return the clean, corrected code." 
  : ""}

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
${state.is_diff ? 'Original Diff:' : 'Original Code:'}
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