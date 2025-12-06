import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'
import { useFlags } from 'launchdarkly-react-client-sdk'
import { BrevoClient } from '../services/brevo'
import { useForm } from '@formspree/react'

// Mock LaunchDarkly
vi.mock('launchdarkly-react-client-sdk', () => ({
  useFlags: vi.fn()
}))

// Mock Brevo client
vi.mock('../services/brevo', () => ({
  BrevoClient: vi.fn()
}))

// Mock Formspree
vi.mock('@formspree/react', () => ({
  useForm: vi.fn(),
  ValidationError: ({ prefix, field, errors }) => {
    const error = errors?.find(e => e.field === field)
    return error ? <div>{prefix} error</div> : null
  }
}))

describe('ContactForm', () => {
  let mockHandleSubmit

  beforeEach(() => {
    // Set up default mocks
    mockHandleSubmit = vi.fn()
    useForm.mockReturnValue([
      { succeeded: false, submitting: false, errors: [] },
      mockHandleSubmit
    ])
    useFlags.mockReturnValue({})
  })

  afterEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Form Rendering', () => {
    beforeEach(() => {
      render(<ContactForm />)
    })

  it('renders the form heading', () => {
    expect(screen.getByRole('heading', { level: 2 })).toBeInTheDocument()
  })

  it('renders name input field', () => {
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
  })

  it('renders email input field', () => {
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
  })

  it('renders message/interest textarea', () => {
    expect(screen.getByLabelText(/message|interest|tell us/i)).toBeInTheDocument()
  })

  it('renders submit button', () => {
    expect(screen.getByRole('button', { name: /submit|send|contact/i })).toBeInTheDocument()
  })

  it('shows validation error for empty name', async () => {
    const user = userEvent.setup()
    const submitButton = screen.getByRole('button', { name: /submit|send|contact/i })

    await user.click(submitButton)

    const nameInput = screen.getByLabelText(/name/i)
    expect(nameInput).toBeInvalid()
  })

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup()
    const emailInput = screen.getByLabelText(/email/i)
    const submitButton = screen.getByRole('button', { name: /submit|send|contact/i })

    await user.type(emailInput, 'invalid-email')
    await user.click(submitButton)

    expect(emailInput).toBeInvalid()
  })

  it('accepts valid form data', async () => {
    const user = userEvent.setup()
    const nameInput = screen.getByLabelText(/name/i)
    const emailInput = screen.getByLabelText(/email/i)
    const messageInput = screen.getByLabelText(/message|interest|tell us/i)

    await user.type(nameInput, 'John Doe')
    await user.type(emailInput, 'john@example.com')
    await user.type(messageInput, 'I want to learn more about Software Factory')

    expect(nameInput).toHaveValue('John Doe')
    expect(emailInput).toHaveValue('john@example.com')
    expect(messageInput).toHaveValue('I want to learn more about Software Factory')
  })
  })

  describe('Brevo CRM Integration (Story 000004, Chunk 2)', () => {
    describe('Feature Flag States', () => {
      it('creates Brevo contact when flag is ON', async () => {
        // Arrange
        const mockCreateContact = vi.fn().mockResolvedValue({ success: true, data: { id: 123 } })
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        useFlags.mockReturnValue({ brevoIntegration: true })
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert
        await waitFor(() => {
          expect(mockCreateContact).toHaveBeenCalledWith({
            email: 'john@example.com',
            firstName: 'John Doe',
            attributes: { message: 'Test message' }
          })
        })
      })

      it('does NOT call Brevo when flag is OFF', async () => {
        // Arrange
        const mockCreateContact = vi.fn()
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        useFlags.mockReturnValue({ brevoIntegration: false })
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert
        await waitFor(() => {
          expect(mockCreateContact).not.toHaveBeenCalled()
        })
      })

      it('treats undefined flag as OFF (no Brevo call)', async () => {
        // Arrange
        const mockCreateContact = vi.fn()
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        useFlags.mockReturnValue({})
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert
        await waitFor(() => {
          expect(mockCreateContact).not.toHaveBeenCalled()
        })
      })

      it('shows no errors when flag is OFF', async () => {
        // Arrange
        useFlags.mockReturnValue({ brevoIntegration: false })
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert
        expect(screen.queryByText(/error/i)).not.toBeInTheDocument()
      })
    })

    describe('Happy Path', () => {
      it('submits form and creates Brevo contact when flag is ON', async () => {
        // Arrange
        const mockCreateContact = vi.fn().mockResolvedValue({ success: true, data: { id: 123 } })
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        useFlags.mockReturnValue({ brevoIntegration: true })
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'Jane Smith')
        await user.type(screen.getByLabelText(/email/i), 'jane@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Interested in Software Factory')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert
        await waitFor(() => {
          expect(mockCreateContact).toHaveBeenCalled()
        })
      })

      it('shows success message after successful Brevo submission', async () => {
        // Arrange
        const mockCreateContact = vi.fn().mockResolvedValue({ success: true, data: { id: 123 } })
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        useFlags.mockReturnValue({ brevoIntegration: true })
        const mockHandleSubmit = vi.fn()
        useForm.mockReturnValue([
          { succeeded: true, submitting: false, errors: [] },
          mockHandleSubmit
        ])

        render(<ContactForm />)

        // Assert
        expect(screen.getByText(/thanks for reaching out/i)).toBeInTheDocument()
      })

      it('clears form after successful submission', async () => {
        // Arrange
        useFlags.mockReturnValue({ brevoIntegration: true })
        useForm.mockReturnValue([
          { succeeded: true, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)

        // Assert - form should not be visible when succeeded
        expect(screen.queryByLabelText(/name/i)).not.toBeInTheDocument()
        expect(screen.queryByLabelText(/email/i)).not.toBeInTheDocument()
      })
    })

    describe('Error Handling', () => {
      it('shows error message when Brevo API fails', async () => {
        // Arrange
        const mockCreateContact = vi.fn().mockResolvedValue({
          success: false,
          error: 'Network error'
        })
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        useFlags.mockReturnValue({ brevoIntegration: true })
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert
        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalledWith(
            expect.stringContaining('Brevo'),
            expect.stringContaining('Network error')
          )
        })

        consoleErrorSpy.mockRestore()
      })

      it('form remains functional when Brevo fails', async () => {
        // Arrange
        const mockCreateContact = vi.fn().mockResolvedValue({
          success: false,
          error: 'API error'
        })
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        useFlags.mockReturnValue({ brevoIntegration: true })
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')

        // Assert - form should still be functional
        expect(screen.getByRole('button', { name: /send/i })).toBeEnabled()
        expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
      })

      it('logs errors without breaking user experience', async () => {
        // Arrange
        const mockCreateContact = vi.fn().mockRejectedValue(new Error('Unexpected error'))
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        useFlags.mockReturnValue({ brevoIntegration: true })
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act - should not throw
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert - error logged but UI not broken
        await waitFor(() => {
          expect(consoleErrorSpy).toHaveBeenCalled()
        })
        expect(screen.getByRole('button', { name: /send/i })).toBeInTheDocument()

        consoleErrorSpy.mockRestore()
      })
    })

    describe('Edge Cases', () => {
      it('handles form submission gracefully when flag is OFF', async () => {
        // Arrange
        const mockCreateContact = vi.fn()
        BrevoClient.mockImplementation(function() {
          this.createContact = mockCreateContact
        })

        useFlags.mockReturnValue({ brevoIntegration: false })
        const mockHandleSubmit = vi.fn()
        useForm.mockReturnValue([
          { succeeded: false, submitting: false, errors: [] },
          mockHandleSubmit
        ])

        render(<ContactForm />)
        const user = userEvent.setup()

        // Act
        await user.type(screen.getByLabelText(/name/i), 'John Doe')
        await user.type(screen.getByLabelText(/email/i), 'john@example.com')
        await user.type(screen.getByLabelText(/message|interest/i), 'Test message')
        await user.click(screen.getByRole('button', { name: /send/i }))

        // Assert - form submits normally without Brevo
        expect(mockHandleSubmit).toHaveBeenCalled()
        expect(mockCreateContact).not.toHaveBeenCalled()
      })

      it('shows appropriate message when flag is OFF', async () => {
        // Arrange
        useFlags.mockReturnValue({ brevoIntegration: false })
        useForm.mockReturnValue([
          { succeeded: true, submitting: false, errors: [] },
          vi.fn()
        ])

        render(<ContactForm />)

        // Assert - standard success message shown
        expect(screen.getByText(/thanks for reaching out/i)).toBeInTheDocument()
      })
    })
  })
})
