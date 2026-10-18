import dotenv from "dotenv"
dotenv.config()
import { StateGraph, START, END, Annotation } from "@langchain/langgraph"
import { z } from "zod"
import { gemini } from "./model.js"
import { fetchFromURL } from "./fetcher.agent.js"
import { security_agent } from "./security.agent.js"
import { decision_layer } from "./decision.agent.js"
import { fix_generator } from "./fixgenerator.agent.js"
import { action_agent } from "./action.agent.js"
import { traceable } from "langsmith/traceable"



const stateSchema = Annotation.Root({
    code: Annotation(),
    language: Annotation(),
    source_type: Annotation(),
    is_diff: Annotation(),
    security_feedback: Annotation(),
    bug_feedback: Annotation(),
    performance_feedback: Annotation(),
    best_practices_feedback: Annotation(),

    severity: Annotation(),
    fixed_code: Annotation(),
    pr_comment: Annotation(),
    final_review: Annotation(),
})


const agentIssueSchema = z.object({
    title: z.string().describe("Short title describing the issue"),
    severity: z.enum(["Critical", "High", "Medium", "Low", "Warning"]).describe("Severity level"),
    description: z.string().describe("Specific details of the issue"),
    fix: z.string().describe("Corrected code block or description of fix"),
})

const agentFeedbackSchema = z.object({
    issues: z.array(agentIssueSchema).describe("List of detected issues"),
    summary: z.string().describe("Overall summary of findings"),
})

const structuredAgentModel = gemini.withStructuredOutput(agentFeedbackSchema)

const bug_detector = traceable(
    async (state) => {
        try {
            const response = await structuredAgentModel.invoke([
                {
                    role: "system",
                    content: `You are a senior software engineer and code auditor.
Analyze the given code carefully for:
1. Logic bugs
2. Edge cases
3. Bad error handling
4. Null/undefined risks
${state.is_diff ? "CRITICAL: The input is a Git diff. You MUST ONLY analyze issues introduced by the new/added lines (lines starting with '+')." : ""}`
                },
                {
                    role: "user",
                    content: `${state.is_diff ? 'Diff:' : 'Code:'}\n${state.code}\n\nLanguage:\n${state.language}`
                },
            ]);

            return {
                bug_feedback: JSON.stringify(response),
            };
        } catch (error) {
            console.log("Bug Detector Error:", error.message);

            return {
                bug_feedback: JSON.stringify({ issues: [], summary: "Bug analysis failed." }),
            };
        }
    },
    { name: "bug_detector", run_type: "chain" }
);


const performance_analyser = traceable(
    async (state) => {
        try {
            const response = await structuredAgentModel.invoke([
                {
                    role: "system",
                    content: `You are a senior performance engineer.
Analyze the code for:
1. Time complexity issues
2. Memory inefficiencies
3. Unnecessary loops
4. Expensive operations
5. Blocking operations
6. Poor async handling
${state.is_diff ? "CRITICAL: The input is a Git diff. You MUST ONLY analyze performance issues introduced by the new/added lines (lines starting with '+')." : ""}`
                },
                {
                    role: "user",
                    content: `${state.is_diff ? 'Diff:' : 'Code:'}\n${state.code}\n\nLanguage:\n${state.language}`
                },
            ]);

            return {
                performance_feedback: JSON.stringify(response),
            };
        } catch (error) {
            console.log("Performance Analyser Error:", error.message);

            return {
                performance_feedback: JSON.stringify({ issues: [], summary: "Performance analysis failed." }),
            };
        }
    },
    { name: "performance_analyser", run_type: "chain" }
);


const best_practices_feedback = traceable(
    async (state) => {
        try {
            const response = await structuredAgentModel.invoke([
                {
                    role: "system",
                    content: `You are a senior software architect.
Review the code for:
1. Clean code principles
2. Naming conventions
3. Reusability and Maintainability
4. SOLID principles
5. Error handling and logging
${state.is_diff ? "CRITICAL: The input is a Git diff. You MUST ONLY analyze best practice issues introduced by the new/added lines (lines starting with '+')." : ""}`
                },
                {
                    role: "user",
                    content: `${state.is_diff ? 'Diff:' : 'Code:'}\n${state.code}\n\nLanguage:\n${state.language}`
                }
            ]);

            return {
                best_practices_feedback: JSON.stringify(response),
            };
        } catch (error) {
            console.log("Best Practices Error:", error.message);

            return {
                best_practices_feedback: JSON.stringify({ issues: [], summary: "Best practices analysis failed." }),
            };
        }
    },
    { name: "best_practices_agent", run_type: "chain" }
);


const final_reviewer = traceable(
    async (state) => {
        try {
            const response = await gemini.invoke([
                {
                    role: "system",
                    content: `
You are a Staff-level code reviewer.

Your job:
1. Consolidate all findings from the provided Bug, Performance, and Best Practices reports.
2. Remove duplicate issues and prioritize critical problems.
3. Give an overall engineering assessment and decide production readiness.
4. Keep the review concise, punchy, and to the point (under 250 words).

CRITICAL: You MUST ONLY report issues that are explicitly mentioned in the Bug, Performance, or Best Practices reports below. Do NOT assume, hallucinate, or add any other issues that are not present in the provided reports.
            `,

                },
                {
                    role: "user",
                    content: `
Bug Analysis:
${state.bug_feedback}

Performance Analysis:
${state.performance_feedback}

Best Practices Analysis:
${state.best_practices_feedback}

Return output in markdown.

Required Format:

# Final Code Review

## Overall Score
Score: X/10

## Critical Issues
- Issue 1
- Issue 2
- Issue 3

## Strengths
- Strength 1
- Strength 2

## Recommended Improvements
- Improvement 1
- Improvement 2

## Production Readiness
Explain whether this code is production ready or not.

## Final Verdict
2-3 concise lines.

[Unique ID: ${Date.now()}]
            `,
                },
            ]);
            return {
                final_review: response.content,
            };
        } catch (error) {
            console.log("Final Reviewer Error:", error.message);
            return {
                final_review: "Final review failed.",
            };
        }
    },
    { name: "final_reviewer", run_type: "chain" }
);
// Lang graph
const graph = new StateGraph(stateSchema)
    .addNode("security_agent", security_agent)
    .addNode("bug_detector", bug_detector)
    .addNode("performance_analyser", performance_analyser)
    .addNode("best_practices_agent", best_practices_feedback)
    .addNode("decision_layer", decision_layer)
    .addNode("fix_generator", fix_generator)
    .addNode("action_agent", action_agent)
    .addNode("final_reviewer", final_reviewer)
    // START → parallel agents
    .addEdge(START, "security_agent")
    .addEdge(START, "bug_detector")
    .addEdge(START, "performance_analyser")
    .addEdge(START, "best_practices_agent")

    // All 4 → decision layer
    .addEdge("security_agent", "decision_layer")
    .addEdge("bug_detector", "decision_layer")
    .addEdge("performance_analyser", "decision_layer")
    .addEdge("best_practices_agent", "decision_layer")

    // decision → fix generator
    .addEdge("decision_layer", "fix_generator")

    // fix generator → action agent
    .addEdge("fix_generator", "action_agent")

    // action agent → final reviewer
    .addEdge("action_agent", "final_reviewer")

    // final → END
    .addEdge("final_reviewer", END)
    .compile()

const _reviewCodePipeline = traceable(
    async (code, language, sourceType = 'paste', isDiff = false) => {
        console.log("Invoking graph with input:", { code, language, sourceType, isDiff });
        const result = await graph.invoke({
            code,
            language,
            source_type: sourceType,
            is_diff: isDiff
        })
        console.log("Graph invoke returned:", result);

        return {
            security_feedback: result.security_feedback,
            bug_feedback: result.bug_feedback,
            performance_feedback: result.performance_feedback,
            best_practices_feedback: result.best_practices_feedback,
            severity: result.severity,
            fixed_code: result.fixed_code,
            pr_comment: result.pr_comment,
            final_review: result.final_review,
        }
    },
    {
        name: "AI Code Reviewer Pipeline",
        run_type: "chain",
        tags: ["langgraph", "code-review"],
    }
)

export const reviewCode = _reviewCodePipeline