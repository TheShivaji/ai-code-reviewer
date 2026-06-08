import { api } from '../../auth/service/auth.api.js'

export const createReview = async (payload) => {
  const { data } = await api.post('/review/create', payload)
  return data
}

export const getReviews = async () => {
  const { data } = await api.get('/review/reviews')
  return data
}

export const getScoreHistory = async () => {
  const { data } = await api.get('/review/score-history')
  return data
}

export const getSharedReview = async (shareToken) => {
  const { data } = await api.get(`/review/shared/${shareToken}`)
  return data
}
