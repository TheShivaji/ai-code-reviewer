import { Router } from "express";
import { createReview , getReviews , getScoreHistory , getSharedReview } from "../controllers/review.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const reviewRouter = Router()

reviewRouter.post('/create' , authUser , createReview)
reviewRouter.get('/reviews' , authUser , getReviews)
reviewRouter.get('/score-history' , authUser , getScoreHistory)
reviewRouter.get('/shared/:shareToken' , getSharedReview)

export default reviewRouter 