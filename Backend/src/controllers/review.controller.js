import pool from '../db/database.js'
import { reviewCode } from '../ai/langraph.js'
import { detectLanguage } from '../utils/detectlanguage.js'
import { extractScore } from '../utils/extractScore.js'
import { v4 as uuidv4 } from 'uuid'

export const createReview = async (req, res) => {
    try {
        const { code } = req.body
        const { language } = req.body

        if (!code) {
            return res.status(400).json({
                success: false,
                message: "Code is required"
            })
        }

        if (!language || language === 'auto') {
            language = detectLanguage(code)
            console.log("Automatically detected language:", language)
        }

        const review = await reviewCode(code, language)
        const score = extractScore(review.final_review)
        const shareToken = uuidv4()
        const result = await pool.query('INSERT INTO reviews ( user_id , code , language , bug_feedback , performance_feedback , best_practice_feedback , final_summary , score , share_token) VALUES ($1 , $2 , $3 , $4 , $5 , $6 , $7 , $8 , $9 , $10) RETURNING id , user_id , code , language , bug_feedback , performance_feedback , best_practice_feedback , final_summary , score , share_token',
            [

                req.userId,
                code,
                language,
                review.bug_feedback,
                review.performance_feedback,
                review.best_practices_feedback,
                review.final_review,
                score,
                shareToken])

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review: result.rows[0]
        })
    } catch (error) {
        console.log("Error in createReview", error.message)
        return res.status(500).json({ message: error.message })
    }
}

export const getReviews = async (req, res) => {
    try {
        const result = await pool.query(
            'SELECT * FROM reviews WHERE user_id = $1 ORDER BY created_at DESC',
            [req.userId]
        )
        res.json({
            success: true,
            reviews: result.rows
        })
    } catch (error) {
        console.log("Error in getReviews", error.message)
        return res.status(500).json({ message: error.message })
    }
}

export const getScoreHistory = async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT score, language, created_at 
             FROM reviews 
             WHERE user_id = $1 
             ORDER BY created_at ASC
             LIMIT 20`,
            [req.userId]
        )
        res.json({
            success: true,
            history: result.rows
        })
    } catch (error) {
        console.log("Error in getScoreHistory", error.message)
        return res.status(500).json({ message: error.message })
    }
}

export const getSharedReview = async (req, res) => {
    try {
        const { shareToken } = req.params
        const result = await pool.query(
            `SELECT language, bug_feedback, performance_feedback, 
                    best_practice_feedback, final_summary, score, created_at
             FROM reviews 
             WHERE share_token = $1`,
            [shareToken]
        )
        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'Review not found' })
        }
        res.json({
            success: true,
            review: result.rows[0]
        })
    } catch (error) {
        console.log("Error in getSharedReview", error.message)
        return res.status(500).json({ message: error.message })
    }
}