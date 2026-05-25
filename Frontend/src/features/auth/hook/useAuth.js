import { useDispatch, useSelector } from 'react-redux'
import { setUser, setError, setLoading } from '../auth.slice'
import { login, register, logout } from '../services/api'
import { getAuthErrorMessage } from '../utils/getAuthErrorMessage'

export const useAuth = () => {
  const dispatch = useDispatch()
  const { user, isLoading, error } = useSelector((state) => state.auth)

  const loginUser = async (email, password) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const data = await login(email, password)
      if (data.success) {
        dispatch(setUser(data.user))
        return data.user
      }
    } catch (err) {
      const errMsg = getAuthErrorMessage(err)
      dispatch(setError(errMsg))
      throw err
    } finally {
      dispatch(setLoading(false))
    }
  }

  const registerUser = async (name, email, password) => {
    dispatch(setLoading(true))
    dispatch(setError(null))
    try {
      const data = await register(name, email, password)
      if (data.success) {
        dispatch(setUser(data.user))
        return data.user
      }
    } catch (err) {
      const errMsg = getAuthErrorMessage(err)
      dispatch(setError(errMsg))
      throw err
    } finally {
      dispatch(setLoading(false))
    }
  }

  const logoutUser = async () => {
    dispatch(setLoading(true))
    try {
      await logout()
      dispatch(setUser(null))
    } catch (err) {
      const errMsg = getAuthErrorMessage(err)
      dispatch(setError(errMsg))
    } finally {
      dispatch(setLoading(false))
    }
  }

  return {
    user,
    loading: isLoading,
    error,
    loginUser,
    registerUser,
    logoutUser,
  }
}
export default useAuth
