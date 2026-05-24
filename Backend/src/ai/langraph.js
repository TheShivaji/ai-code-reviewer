import { StateGraph, START, END, Annotation } from "@langchain/langgraph"
import { z } from "zod"
import { groq, llama, gemini, mistral } from "./model.js"
import { fetchFromURL } from "./fetcher.agent.js"
import { security_agent } from "./security.agent.js"
import { decision_layer } from "./decision.agent.js"
import { fix_generator } from "./fixgenerator.agent.js"
import { action_agent } from "./action.agent.js"



const stateSchema = Annotation.Root({
    code: Annotation(),
    language: Annotation(),
    source_type: Annotation(),

    security_feedback: Annotation(),
    bug_feedback: Annotation(),
    performance_feedback: Annotation(),
    best_practices_feedback: Annotation(),

    severity: Annotation(),
    fixed_code: Annotation(),
    pr_comment: Annotation(),
    final_review: Annotation(),
})


const bug_detector = async (state) => {
    try {
        const response = await llama.invoke([
            {
                role: "system",
                content: `
You are a senior software engineer and security auditor.

Analyze the given code carefully.

Your tasks:
1. Detect logic bugs
2. Detect security vulnerabilities
3. Detect edge cases
4. Detect bad error handling
5. Detect null/undefined risks

Rules:
- Be extremely specific
- Mention exact problematic code
- Explain WHY it is an issue
- Suggest corrected code
- Assign severity:
  Critical / High / Medium / Low

Return output in markdown format.
        `,
            },
            {
                role: "user",
                content: `
Code:
${state.code}

Language:
${state.language}
        `,
            },
        ]);

        return {
            bug_feedback: response.content,
        };
    } catch (error) {
        console.log("Bug Detector Error:", error.message);

        return {
            bug_feedback: "Bug analysis failed.",
        };
    }
};


const performance_analyser = async (state) => {
    try {
        const response = await groq.invoke([
            {
                role: "system",
                content: `
You are a senior performance engineer.

Analyze the code for:

1. Time complexity issues
2. Memory inefficiencies
3. Unnecessary loops
4. Expensive database operations
5. Blocking operations
6. Poor async handling

Rules:
- Mention bottlenecks clearly
- Suggest optimized alternatives
- Mention Big-O complexity when relevant

Return output in markdown format.
        `,
            },
            {
                role: "user",
                content: `
Code:
${state.code}

Language:
${state.language}
        `,
            },
        ]);

        return {
            performance_feedback: response.content,
        };
    } catch (error) {
        console.log("Performance Analyser Error:", error.message);

        return {
            performance_feedback: "Performance analysis failed.",
        };
    }
};


const best_practices_feedback = async (state) => {
    try {
        const response = await groq.invoke([
            {
                role: "system",
                content: `
You are a senior software architect.

Review the code for:

1. Clean code principles
2. Naming conventions
3. Folder structure
4. Reusability
5. Maintainability
6. Scalability
7. SOLID principles
8. Error handling
9. Logging practices

Rules:
- Be practical
- Focus on production-grade improvements
- Suggest industry-standard approaches

Return output in markdown format.
        `,
            },
            {
                role: "user",
                content: `
Code:
${state.code}

Language:
${state.language}
        `,
            },
        ]);

        return {
            best_practices_feedback: response.content,
        };
    } catch (error) {
        console.log("Best Practices Error:", error.message);

        return {
            best_practices_feedback: "Best practices analysis failed.",
        };
    }
};

const final_reviewer = async (state) => {
    try {
        const response = await gemini.invoke([
            {
                role: "system",
                content: `
You are a Staff-level code reviewer.

Your job:
1. Consolidate all findings
2. Remove duplicate issues
3. Prioritize critical problems
4. Give an overall engineering assessment
5. Decide production readiness
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
};
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

export const reviewCode = async (code, language, sourceType = 'paste') => {
    console.log("Invoking graph with input:", { code, language, sourceType });
    const result = await graph.invoke({
        code,
        language,
        source_type: sourceType
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
}