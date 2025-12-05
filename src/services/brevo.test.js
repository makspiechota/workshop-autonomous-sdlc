import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { BrevoClient } from './brevo.js'

describe('BrevoClient', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    delete global.fetch
  })

  afterEach(() => {
    vi.restoreAllMocks()
  })

  describe('Happy Path', () => {
    it('creates contact successfully with valid data', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      const contactData = {
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact(contactData)

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.id).toBe(123)
      expect(result.data.email).toBe('test@example.com')
    })

    it('returns success response with contact ID', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 456 })
      })

      // Act
      const result = await brevo.createContact({ email: 'user@example.com' })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data).toHaveProperty('id', 456)
    })

    it('sends correct API request format to Brevo', async () => {
      // Arrange
      const brevo = new BrevoClient('my-api-key')
      const contactData = {
        email: 'contact@example.com',
        firstName: 'Jane',
        lastName: 'Smith',
        attributes: { company: 'Acme Inc' }
      }

      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 789 })
      })

      // Act
      await brevo.createContact(contactData)

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/contacts',
        expect.objectContaining({
          method: 'POST',
          headers: expect.objectContaining({
            'api-key': 'my-api-key',
            'content-type': 'application/json'
          }),
          body: expect.stringContaining('contact@example.com')
        })
      )
    })

    it('uses POST method for creating contacts', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 111 })
      })

      // Act
      await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({ method: 'POST' })
      )
    })
  })

  describe('Field Validation', () => {
    it('requires email field (returns error if missing)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn()

      // Act
      const result = await brevo.createContact({})

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Email is required')
      expect(fetch).not.toHaveBeenCalled()
    })

    it('allows optional firstName field to be omitted', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(true)
    })

    it('allows optional lastName field to be omitted', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({
        email: 'test@example.com',
        firstName: 'John'
      })

      // Assert
      expect(result.success).toBe(true)
    })

    it('allows optional attributes field to be omitted', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(true)
    })

    it('validates email field is non-empty string', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn()

      // Act
      const result1 = await brevo.createContact({ email: '' })
      const result2 = await brevo.createContact({ email: '   ' })

      // Assert
      expect(result1.success).toBe(false)
      expect(result1.error).toContain('Email is required')
      expect(result2.success).toBe(false)
      expect(result2.error).toContain('Invalid email format')
      expect(fetch).not.toHaveBeenCalled()
    })

    it('rejects invalid email formats (returns error, does not call API)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn()

      const invalidEmails = [
        'notanemail',
        '@example.com',
        'user@',
        'user @example.com',
        'user@example'
      ]

      // Act & Assert
      for (const email of invalidEmails) {
        const result = await brevo.createContact({ email })
        expect(result.success).toBe(false)
        expect(result.error).toContain('Invalid email format')
      }

      expect(fetch).not.toHaveBeenCalled()
    })

    it('accepts valid email formats per RFC 5322', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      const validEmails = [
        'simple@example.com',
        'user+tag@example.co.uk',
        'user.name@example.com',
        'user_name@example.com'
      ]

      // Act & Assert
      for (const email of validEmails) {
        const result = await brevo.createContact({ email })
        expect(result.success).toBe(true)
      }
    })

    it('trims whitespace from email field', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({ email: '  user@example.com  ' })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.email).toBe('user@example.com')
    })
  })

  describe('Edge Cases', () => {
    it('handles missing optional fields gracefully', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(true)
      const calledBody = JSON.parse(fetch.mock.calls[0][1].body)
      expect(calledBody.firstName).toBeUndefined()
      expect(calledBody.lastName).toBeUndefined()
    })

    it('returns existing contact ID when duplicate email (409 Conflict)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ id: 999 })
      })

      // Act
      const result = await brevo.createContact({ email: 'duplicate@example.com' })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.id).toBe(999)
      expect(result.data.email).toBe('duplicate@example.com')
    })

    it('indicates duplicate status in response object', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 409,
        json: async () => ({ id: 999 })
      })

      // Act
      const result = await brevo.createContact({ email: 'duplicate@example.com' })

      // Assert
      expect(result.success).toBe(true)
      expect(result.data.duplicate).toBe(true)
    })

    it('handles special characters in name fields', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({
        email: 'test@example.com',
        firstName: "O'Brien",
        lastName: 'Müller-Schmidt'
      })

      // Assert
      expect(result.success).toBe(true)
    })

    it('handles very long strings (within API limits)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      const longName = 'A'.repeat(100)

      // Act
      const result = await brevo.createContact({
        email: 'test@example.com',
        firstName: longName
      })

      // Assert
      expect(result.success).toBe(true)
    })
  })

  describe('Error Handling', () => {
    it('handles network errors gracefully', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockRejectedValue(new TypeError('Failed to fetch'))

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Network error')
    })

    it('handles invalid API key (401 error)', async () => {
      // Arrange
      const brevo = new BrevoClient('invalid-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid API key')
    })

    it('handles 403 Forbidden (insufficient API key permissions)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 403,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Insufficient API key permissions')
    })

    it('handles 400 Bad Request with validation errors', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 400,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Bad request - validation error')
    })

    it('handles rate limiting (429 error)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 429,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Rate limit exceeded')
    })

    it('handles 500 Internal Server Error', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Brevo server error')
    })

    it('handles 503 Service Unavailable', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 503,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Brevo service unavailable')
    })

    it('handles timeout errors', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      const abortError = new Error('The operation was aborted')
      abortError.name = 'AbortError'
      global.fetch = vi.fn().mockRejectedValue(abortError)

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Request timeout')
    })

    it('handles malformed JSON responses from API', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => {
          throw new SyntaxError('Unexpected token')
        }
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Invalid API response format')
    })

    it('logs errors without exposing API key', async () => {
      // Arrange
      const brevo = new BrevoClient('secret-api-key-12345')
      const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({})
      })

      // Act
      await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(consoleErrorSpy).toHaveBeenCalled()
      const loggedMessages = consoleErrorSpy.mock.calls.map(call => call.join(' '))
      loggedMessages.forEach(message => {
        expect(message).not.toContain('secret-api-key-12345')
      })

      consoleErrorSpy.mockRestore()
    })

    it('never throws exceptions (returns error objects)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      const unexpectedError = new Error('Unexpected error')
      global.fetch = vi.fn().mockRejectedValue(unexpectedError)

      // Act
      const testCall = async () => await brevo.createContact({ email: 'test@example.com' })

      // Assert
      await expect(testCall()).resolves.toBeDefined()
      const result = await testCall()
      expect(result.success).toBe(false)
      expect(result.error).toBeDefined()
    })
  })

  describe('Configuration', () => {
    it('reads API key from environment variable', async () => {
      // Arrange
      const originalEnv = import.meta.env.VITE_BREVO_API_KEY
      import.meta.env.VITE_BREVO_API_KEY = 'env-api-key'
      const brevo = new BrevoClient()
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: expect.objectContaining({
            'api-key': 'env-api-key'
          })
        })
      )

      import.meta.env.VITE_BREVO_API_KEY = originalEnv
    })

    it('returns error when VITE_BREVO_API_KEY is missing', async () => {
      // Arrange
      const brevo = new BrevoClient(null)
      global.fetch = vi.fn()

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('Brevo API key is not configured')
      expect(fetch).not.toHaveBeenCalled()
    })

    it('returns error when API key is empty string', async () => {
      // Arrange
      const brevo = new BrevoClient('')
      global.fetch = vi.fn()

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Brevo API key cannot be empty')
      expect(fetch).not.toHaveBeenCalled()
    })

    it('provides clear error message for missing configuration', async () => {
      // Arrange
      const brevo = new BrevoClient(null)
      global.fetch = vi.fn()

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toContain('VITE_BREVO_API_KEY')
      expect(result.error).toContain('environment variable')
    })

    it('uses correct Brevo API v3 endpoint', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        'https://api.brevo.com/v3/contacts',
        expect.any(Object)
      )
    })

    it('sets correct headers (API key, content-type)', async () => {
      // Arrange
      const brevo = new BrevoClient('my-secret-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          headers: {
            'api-key': 'my-secret-key',
            'content-type': 'application/json'
          }
        })
      )
    })

    it('configures request timeout (e.g., 10 seconds)', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(fetch).toHaveBeenCalledWith(
        expect.any(String),
        expect.objectContaining({
          signal: expect.any(AbortSignal)
        })
      )
    })

    it('fails gracefully when request times out', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      const abortError = new Error('The operation was aborted')
      abortError.name = 'AbortError'
      global.fetch = vi.fn().mockRejectedValue(abortError)

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.success).toBe(false)
      expect(result.error).toBe('Request timeout')
    })
  })

  describe('Response Structure', () => {
    it('returns standardized response object with success: true', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result).toHaveProperty('success', true)
      expect(result).toHaveProperty('data')
      expect(result).not.toHaveProperty('error')
    })

    it('includes contact ID in response.data.id', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 999 })
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.data).toHaveProperty('id', 999)
    })

    it('includes email in response.data.email', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: true,
        json: async () => ({ id: 123 })
      })

      // Act
      const result = await brevo.createContact({ email: 'user@example.com' })

      // Assert
      expect(result.data).toHaveProperty('email', 'user@example.com')
    })

    it('returns standardized error response with success: false', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 500,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result).toHaveProperty('success', false)
      expect(result).toHaveProperty('error')
      expect(result).not.toHaveProperty('data')
    })

    it('includes error message in response.error', async () => {
      // Arrange
      const brevo = new BrevoClient('test-api-key')
      global.fetch = vi.fn().mockResolvedValue({
        ok: false,
        status: 401,
        json: async () => ({})
      })

      // Act
      const result = await brevo.createContact({ email: 'test@example.com' })

      // Assert
      expect(result.error).toBe('Invalid API key')
      expect(typeof result.error).toBe('string')
    })
  })
})
