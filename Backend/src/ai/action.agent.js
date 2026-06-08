import { gemini } from "./model.js"

export const action_agent = async (state) => {
    try {
        const response = await gemini.invoke([
            {
                role: "system",
                content: `
You are a GitHub PR bot and release engineer.

Your job:
Generate a professional, structured PR review comment based on:
1. The original code
2. The fixed code (with improvements)
3. The feedback from security, bug, performance, and best practices agents.

Format requirements:
- Use clear, friendly markdown.
- Start with a quick summary of the changes proposed.
- Provide a summary table of findings (Bugs, Security, Performance, Best Practices) indicating severity counts.
- Add a collapsible section showing suggested fixes. You MUST put blank lines before and after the code blocks inside the details tags, otherwise GitLab/GitHub will not parse the markdown (it will render on a single line). Example format:
  <details>
  <summary>View Suggested Code Fixes</summary>

  \`\`\`diff
  ...
  \`\`\`

  \`\`\`javascript
  ...
  \`\`\`

  </details>
- Keep the tone helpful, constructive, and developer-friendly.
`
            },
            {
                role: "user",
                content: `
${state.is_diff ? 'Original Diff:' : 'Original Code:'}
${state.code}

Fixed Code:
${state.fixed_code}

Security Feedback: ${state.security_feedback}
Bug Feedback: ${state.bug_feedback}
Performance Feedback: ${state.performance_feedback}
Best Practices Feedback: ${state.best_practices_feedback}
`
            }
        ])

        return { pr_comment: response.content }

    } catch (error) {
        console.log("Action Agent Error:", error.message)
        return { pr_comment: "Failed to generate PR comment." }
    }
}
