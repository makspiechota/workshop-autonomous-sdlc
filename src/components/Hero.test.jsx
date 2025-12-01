import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Hero from './Hero'

describe('Hero', () => {
  it('renders the main heading', () => {
    render(<Hero />)
    expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
  })

  it('displays Software Factory value proposition', () => {
    render(<Hero />)
    expect(screen.getByText(/software factory/i)).toBeInTheDocument()
  })

  it('displays the tagline about engineers and AI agents', () => {
    render(<Hero />)
    const content = screen.getByText(/engineers.*design.*supervise/i)
    expect(content).toBeInTheDocument()
  })

  it('has a call-to-action message', () => {
    render(<Hero />)
    expect(screen.getByText(/get in touch|contact|learn more/i)).toBeInTheDocument()
  })
})
