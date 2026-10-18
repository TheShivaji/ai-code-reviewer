import { gemini } from "./model.js"
import { traceable } from "langsmith/traceable"

export const action_agent = async (state) => {
    try {
        const response = await gemini.invoke([
            {
                role: "system",
                content: `
You are a GitHub / GitLab PR review bot.

Generate a concise, professional PR review comment:
1. Quick 2-line summary of changes.
2. A clean markdown table of findings (Bugs, Security, Performance, Best Practices) with severity counts.
3. 2-3 bullet points highlighting the most important recommendations.
4. Keep the tone helpful and concise. Do NOT regenerate large code blocks. Keep output under 250 words.
`
            },
            {
                role: "user",
                content: `
${state.is_diff ? 'Diff:' : 'Code:'}
${state.code}

Findings:
- Security: ${state.security_feedback}
- Bugs: ${state.bug_feedback}
- Performance: ${state.performance_feedback}
- Best Practices: ${state.best_practices_feedback}
`
            }
        ])

        // Append collapsible fixed code cleanly without wasting AI tokens to re-write it
        const finalPrComment = `${response.content.trim()}

<details>
<summary>View Suggested Code Fixes</summary>

${state.fixed_code}

</details>`

        return { pr_comment: finalPrComment }

    } catch (error) {
        console.log("Action Agent Error:", error.message)
        return { pr_comment: "Failed to generate PR comment." }
    }
}


