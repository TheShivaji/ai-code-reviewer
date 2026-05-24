import axios from 'axios'

export const fetchFromURL = async (url) => {
  try {
    // Raw GitHub file
    if (url.includes('raw.githubusercontent.com')) {
      const response = await axios.get(url)
      return response.data
    }

    // GitHub Pull Request diff
    if (url.includes('github.com') && url.includes('/pull/')) {
      const apiUrl = url
        .replace('https://github.com/', 'https://api.github.com/repos/')
        .replace('/pull/', '/pulls/')

      const response = await axios.get(apiUrl, {
        headers: {
          Accept: 'application/vnd.github.v3.diff'
        }
      })

      return response.data
    }

    // Normal GitHub file URL
    if (url.includes('github.com')) {
      const rawUrl = url
        .replace('https://github.com/', 'https://raw.githubusercontent.com/')
        .replace('/blob/', '/')

      const response = await axios.get(rawUrl)

      return response.data
    }

    throw new Error('Invalid URL format')
  } catch (error) {
    throw new Error(`Fetch failed: ${error.message}`)
  }
}