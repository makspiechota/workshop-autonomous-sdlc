/**
 * Brevo CRM API Client
 * Story 000004, Chunk 1
 *
 * Handles contact creation via Brevo API v3
 */

export class BrevoClient {
  constructor(apiKey = import.meta.env?.VITE_BREVO_API_KEY) {
    this.apiKey = apiKey
    this.baseUrl = 'https://api.brevo.com/v3'
  }

  /**
   * Create a contact in Brevo CRM
   * @param {Object} contactData - Contact information
   * @param {string} contactData.email - Contact email (required)
   * @param {string} [contactData.firstName] - First name (optional)
   * @param {string} [contactData.lastName] - Last name (optional)
   * @param {Object} [contactData.attributes] - Additional attributes (optional)
   * @returns {Promise<{success: boolean, data?: any, error?: string}>}
   */
  async createContact({ email, firstName, lastName, attributes = {} }) {
    // Check API key configuration first
    // Check for empty string before checking for undefined/null
    if (typeof this.apiKey === 'string' && this.apiKey.trim() === '') {
      return {
        success: false,
        error: 'Brevo API key cannot be empty'
      }
    }

    if (!this.apiKey) {
      return {
        success: false,
        error: 'Brevo API key is not configured. Set VITE_BREVO_API_KEY environment variable.'
      }
    }

    // Validate required fields
    if (!email || typeof email !== 'string') {
      return {
        success: false,
        error: 'Email is required and must be a non-empty string'
      }
    }

    const trimmedEmail = email.trim()

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(trimmedEmail)) {
      return {
        success: false,
        error: 'Invalid email format'
      }
    }

    // Prepare request body
    const body = {
      email: trimmedEmail,
      ...(firstName && { firstName }),
      ...(lastName && { lastName }),
      attributes
    }

    try {
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

      const response = await fetch(`${this.baseUrl}/contacts`, {
        method: 'POST',
        headers: {
          'api-key': this.apiKey,
          'content-type': 'application/json'
        },
        body: JSON.stringify(body),
        signal: controller.signal
      })

      clearTimeout(timeoutId)

      const responseData = await response.json()

      // Handle success
      if (response.ok) {
        return {
          success: true,
          data: {
            id: responseData.id,
            email: body.email
          }
        }
      }

      // Handle duplicate contact (409)
      if (response.status === 409) {
        return {
          success: true,
          data: {
            id: responseData.id || null,
            email: body.email,
            duplicate: true
          }
        }
      }

      // Handle specific error codes
      const errorMessages = {
        400: 'Bad request - validation error',
        401: 'Invalid API key',
        403: 'Insufficient API key permissions',
        429: 'Rate limit exceeded',
        500: 'Brevo server error',
        503: 'Brevo service unavailable'
      }

      const errorMessage = errorMessages[response.status] || `API error: ${response.status}`
      console.error(`Brevo API error: ${errorMessage}`)

      return {
        success: false,
        error: errorMessage
      }

    } catch (error) {
      // Handle timeout
      if (error.name === 'AbortError') {
        console.error('Brevo API request timeout')
        return {
          success: false,
          error: 'Request timeout'
        }
      }

      // Handle network errors
      if (error instanceof TypeError && error.message.includes('fetch')) {
        console.error('Brevo API network error')
        return {
          success: false,
          error: 'Network error'
        }
      }

      // Handle malformed JSON
      if (error instanceof SyntaxError) {
        console.error('Brevo API returned invalid JSON')
        return {
          success: false,
          error: 'Invalid API response format'
        }
      }

      // Generic error handler
      console.error('Brevo API unexpected error:', error.message)
      return {
        success: false,
        error: 'Unexpected error occurred'
      }
    }
  }
}

export default BrevoClient
