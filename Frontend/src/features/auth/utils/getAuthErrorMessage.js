export const getAuthErrorMessage = (error) => {
  if (error.response && error.response.data && error.response.data.message) {
    return error.response.data.message
  }
  return error.message || 'An unexpected authentication error occurred'
}
