import axios from 'axios'

export const fetchFromURL = async (url) => {
  try {
    // GitHub Raw URL
    if (url.includes('raw.githubusercontent.com')) {
      const response = await axios.get(url)
      return { code: response.data, isDiff: false }
    }

    // GitHub PR diff
    if (url.includes('github.com') && url.includes('/pull/')) {
      const apiUrl = url
        .replace('github.com', 'api.github.com/repos')
        .replace('/pull/', '/pulls/')
      const response = await axios.get(apiUrl, {
        headers: { Accept: 'application/vnd.github.diff' }
      })
      return { code: response.data, isDiff: true }
    }

    // GitHub normal file URL
    if (url.includes('github.com')) {
      const rawUrl = url
        .replace('github.com', 'raw.githubusercontent.com')
        .replace('/blob/', '/')
      const response = await axios.get(rawUrl)
      return { code: response.data, isDiff: false }
    }

    // GitLab MR diff
    if (url.includes('gitlab.com') && url.includes('/merge_requests/')) {
      const parts = url.match(/gitlab\.com\/(.+?)\/-\/merge_requests\/(\d+)/)
      if (parts) {
        const [, projectPath, mrId] = parts
        const encodedPath = encodeURIComponent(projectPath)
        const apiUrl = `https://gitlab.com/api/v4/projects/${encodedPath}/merge_requests/${mrId}/diffs`
        const response = await axios.get(apiUrl, {
          headers: process.env.GITLAB_TOKEN
            ? { 'PRIVATE-TOKEN': process.env.GITLAB_TOKEN }
            : {}
        })
        const diffText = response.data
          .map(d => `--- ${d.old_path}\n+++ ${d.new_path}\n${d.diff}`)
          .join('\n\n')
        return { code: diffText, isDiff: true }
      }
    }

    throw new Error('Invalid URL format')

  } catch (error) {
    throw new Error(`Fetch failed: ${error.message}`)
  }
}