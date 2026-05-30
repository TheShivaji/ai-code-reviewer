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
        console.log(`[Fetcher] Fetching GitLab MR Diffs from: ${apiUrl}`)
        console.log(`[Fetcher] Using GITLAB_TOKEN: ${process.env.GITLAB_TOKEN ? 'Yes (starts with ' + process.env.GITLAB_TOKEN.substring(0, 10) + '...)' : 'No'}`)
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
    console.error(`[Fetcher] Error details:`, error.response ? { status: error.response.status, data: error.response.data } : error.message)
    throw new Error(`Fetch failed: ${error.message}`)
  }
}

export const postGitLabComment = async (mrUrl, comment) => {
  try {
    const parts = mrUrl.match(/gitlab\.com\/(.+?)\/-\/merge_requests\/(\d+)/)
    if (!parts) throw new Error('Invalid GitLab MR URL')

    const [, projectPath, mrId] = parts
    const encodedPath = encodeURIComponent(projectPath)

    await axios.post(
      `https://gitlab.com/api/v4/projects/${encodedPath}/merge_requests/${mrId}/notes`,
      { body: comment },
      { headers: { 'PRIVATE-TOKEN': process.env.GITLAB_TOKEN } }
    )
    console.log('✅ GitLab comment posted!')
  } catch (error) {
    console.log('GitLab comment failed:', error.message)
  }
}