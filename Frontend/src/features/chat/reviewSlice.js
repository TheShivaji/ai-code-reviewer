import { createSlice } from '@reduxjs/toolkit'

const reviewSlice = createSlice({
  name: 'review',
  initialState: {
    currentReview: null,
    history: [],
    scoreHistory: [],
    isLoading: false,
    error: null,
    activeTab: 'final',
  },
  reducers: {
    setCurrentReview: (state, action) => {
      state.currentReview = action.payload
    },
    clearReview: (state) => {
      state.currentReview = null
      state.activeTab = 'final'
    },
    setHistory: (state, action) => {
      state.history = action.payload
    },
    setScoreHistory: (state, action) => {
      state.scoreHistory = action.payload
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload
    },
    setError: (state, action) => {
      state.error = action.payload
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload
    },
  },
})

export const {
  setCurrentReview,
  clearReview,
  setHistory,
  setScoreHistory,
  setLoading,
  setError,
  setActiveTab,
} = reviewSlice.actions

export default reviewSlice.reducer
