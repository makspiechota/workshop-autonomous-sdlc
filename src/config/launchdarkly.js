/**
 * LaunchDarkly Configuration Module
 *
 * Story 000003 - Feature Flags System (LaunchDarkly)
 * Batch 1: LaunchDarkly SDK Setup and Configuration
 *
 * Provides configuration for LaunchDarkly SDK initialization.
 */

/**
 * Generates or retrieves a persistent anonymous user context for LaunchDarkly
 * Keys are stored in localStorage to maintain consistent flag evaluations across sessions
 * @returns {Object} Anonymous user context with persistent key
 */
export function generateAnonymousUser() {
  const storageKey = 'ld_anonymous_user_key'

  // Try to retrieve existing key from localStorage
  let userKey = null
  try {
    userKey = localStorage.getItem(storageKey)
  } catch (err) {
    // localStorage not available (private browsing, etc.)
    console.warn('localStorage unavailable, using session-only anonymous ID')
  }

  // Generate new key if none exists
  if (!userKey) {
    userKey = `anonymous-${crypto.randomUUID()}`
    try {
      localStorage.setItem(storageKey, userKey)
    } catch (err) {
      // Ignore storage errors
    }
  }

  return {
    kind: 'user',
    key: userKey,
    anonymous: true,
  }
}

/**
 * Clears the persisted anonymous user (useful for logout/reset)
 */
export function clearAnonymousUser() {
  try {
    localStorage.removeItem('ld_anonymous_user_key')
  } catch (err) {
    // Ignore errors
  }
}

/**
 * Validates LaunchDarkly client-side ID format
 * @param {string} id - Client-side ID to validate
 * @returns {boolean} Whether the ID is valid
 */
function isValidClientID(id) {
  if (!id || id === '' || id === 'undefined' || id === 'null') {
    return false
  }

  // Allow test IDs in test environment
  if (id.startsWith('test-client-id-')) {
    return true
  }

  // LaunchDarkly client-side IDs are typically 24+ character hex strings
  if (id.length < 20) {
    console.warn(
      `LaunchDarkly client ID appears invalid (too short): ${id.substring(0, 10)}...`
    )
  }

  // Catch common placeholders
  const invalidPlaceholders = ['your-client-id', 'your-launchdarkly-client-id', 'example']
  if (invalidPlaceholders.some(placeholder => id.toLowerCase().includes(placeholder))) {
    console.error(
      `LaunchDarkly client ID contains placeholder text: "${id}"\n` +
      `Please replace with actual client ID from https://app.launchdarkly.com/settings/projects`
    )
    return false
  }

  return true
}

/**
 * Gets LaunchDarkly configuration
 * @param {Object} options - Configuration options
 * @param {Object} options.context - Custom user context
 * @param {Object} options.options - Custom SDK options
 * @returns {Object} LaunchDarkly configuration
 */
export function getLDConfig({ context, options } = {}) {
  const clientSideID = import.meta.env.VITE_LAUNCHDARKLY_CLIENT_ID

  // Validate client ID
  const validClientSideID = isValidClientID(clientSideID) ? clientSideID : undefined

  if (!validClientSideID && clientSideID) {
    console.error(
      `Invalid LaunchDarkly client ID configuration: "${clientSideID}"\n` +
      `Expected format: 24+ character alphanumeric string\n` +
      `Get your client ID from: https://app.launchdarkly.com/settings/projects`
    )
  }

  return {
    clientSideID: validClientSideID,
    context: context || generateAnonymousUser(),
    options: {
      bootstrap: 'localStorage',
      ...options,
    },
    isConfigured: !!validClientSideID,
  }
}
