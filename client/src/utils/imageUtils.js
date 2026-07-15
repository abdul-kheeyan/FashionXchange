// Utility function to construct API base URL
const getApiBase = () => {
  const viteSocketUrl = import.meta.env.VITE_SOCKET_URL
  const viteApiUrl = import.meta.env.VITE_API_URL
  const viteApiBaseUrl = import.meta.env.VITE_API_BASE_URL

  if (viteSocketUrl) {
    return viteSocketUrl
  }
  if (viteApiUrl) {
    return viteApiUrl.replace('/api', '')
  }
  if (viteApiBaseUrl) {
    return viteApiBaseUrl.replace('/api', '')
  }
  return 'http://localhost:5000'
}

// Utility function to construct full image URL
const getImageUrl = (imagePath) => {
  if (!imagePath) return '/uploads/default-avatar.png'
  if (imagePath.startsWith('http')) {
    return imagePath
  }
  return `${getApiBase()}${imagePath}`
}

// Utility function to revoke object URLs (prevent memory leak)
const revokeObjectUrl = (url) => {
  if (url && url.startsWith('blob:')) {
    URL.revokeObjectURL(url)
  }
}

export { getApiBase, getImageUrl, revokeObjectUrl }
