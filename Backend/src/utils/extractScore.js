export const extractScore = (finalReview) => {
    if (!finalReview) return 0

    // "Score: 7/10" ya "**Score:** 7/10" ya "Score: 7" pattern dhundho
    const match = finalReview.match(/score[*\s:]*(\d+)/i)

    if (match) {
        const score = parseInt(match[1])
        // 10 se zyada nahi hona chahiye
        return score > 10 ? 10 : score
    }

    return 0
}