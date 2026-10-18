import { z } from "zod"
import { gemini } from "./model.js"
import { traceable } from "langsmith/traceable"

const decisionSchema = z.object({
    severity: z.enum(["Critical", "Warning", "Low"]),
    critical_count: z.number(),
    warning_count: z.number(),
    low_count: z.number()
})

const stuturedModel = gemini.withStructuredOutput(decisionSchema)

export const decision_layer = traceable(
    async (state) => {
        try {
            const response = await stuturedModel.invoke([
                {
                    role: "system",
                    content: "You are a senior engineering lead. Assign overall severity based on findings."
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

            return {severity : response}

        } catch (error) {
            console.log("Decision Layer Error:", error.message)
            return { severity: { severity: "Warning", critical_count: 0, warning_count: 0, low_count: 0 } }
        }
    },
    { name: "decision_layer", run_type: "chain" }
)
