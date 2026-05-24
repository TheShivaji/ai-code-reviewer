import { reviewCode } from "./src/ai/langraph.js"

async function runTest() {
    try {
        console.log("Starting test...")
        const result = await reviewCode("const x = 1; console.log(x);", "javascript", "paste")
        console.log("Result:", result)
    } catch (err) {
        console.error("Test failed with error:", err)
    }
}

runTest()
