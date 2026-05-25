import { configureStore } from '@reduxjs/toolkit'
import authReducer from '../features/auth/auth.slice'
import reviewReducer from '../features/chat/reviewSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    review: reviewReducer,
  },
})
