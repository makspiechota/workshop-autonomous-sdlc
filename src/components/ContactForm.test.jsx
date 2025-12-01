import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ContactForm from './ContactForm'

describe('ContactForm', () => {
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
