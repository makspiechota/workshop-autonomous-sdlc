import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  it('renders without crashing', () => {
    render(<App />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('renders all main sections', () => {
    render(<App />)

    // Hero section
    expect(screen.getByRole('heading', { name: /build your software factory/i })).toBeInTheDocument()

    // Benefits section
    expect(screen.getByRole('heading', { name: /why software factory/i })).toBeInTheDocument()

    // Contact form
    expect(screen.getByRole('heading', { name: /get in touch/i })).toBeInTheDocument()
  })

  it('has contact form with required fields', () => {
    render(<App />)
    expect(screen.getByLabelText(/name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/message|interest|tell us/i)).toBeInTheDocument()
  })
})
