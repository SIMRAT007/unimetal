// Cloudinary unsigned upload helper.
// Requires an UNSIGNED upload preset created in the Cloudinary dashboard:
// Settings (gear icon) > Upload > Upload presets > Add upload preset > Signing Mode: Unsigned.

const CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'qoa8uzc8'
const UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'unimetal'

export const cloudinaryConfigured = Boolean(CLOUD_NAME && UPLOAD_PRESET)

if (!cloudinaryConfigured) {
  console.error('[Cloudinary] Missing VITE_CLOUDINARY_CLOUD_NAME / VITE_CLOUDINARY_UPLOAD_PRESET env vars.')
}

// Bakes automatic format + quality optimization into the delivery URL so every
// place in the app that already does <img src={url} /> gets optimized images
// for free, with no other code changes required.
const optimizeUrl = (secureUrl) => {
  if (!secureUrl || typeof secureUrl !== 'string') return secureUrl
  return secureUrl.replace('/upload/', '/upload/f_auto,q_auto,w_1600,c_limit/')
}

/**
 * Uploads a single File to Cloudinary and returns an object containing the
 * optimized delivery URL and an optional delete token.
 *
 * NOTE: For the delete token to be returned, you must enable
 * "Return delete token" in your Cloudinary unsigned upload preset. The token
 * is valid for 10 minutes and can be used to delete the asset client-side.
 */
export const uploadToCloudinary = async (file, folder = '') => {
  if (!cloudinaryConfigured) {
    throw new Error('Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME and VITE_CLOUDINARY_UPLOAD_PRESET.')
  }

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)
  if (folder) formData.append('folder', folder)

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
    method: 'POST',
    body: formData,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data?.error?.message || 'Cloudinary upload failed. Please try again.')
  }

  return {
    url: optimizeUrl(data.secure_url),
    deleteToken: data.delete_token || null,
  }
}

/**
 * Deletes a Cloudinary asset using a client-side delete token.
 * The token is only available for 10 minutes after the upload.
 */
export const deleteFromCloudinary = async (deleteToken) => {
  if (!deleteToken || !CLOUD_NAME) return

  const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/delete_by_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ token: deleteToken }),
  })

  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    throw new Error(data?.error?.message || 'Cloudinary delete failed.')
  }
}
