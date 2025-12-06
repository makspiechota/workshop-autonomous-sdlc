import { useForm, ValidationError } from '@formspree/react'
import { useFlags } from 'launchdarkly-react-client-sdk'
import { BrevoClient } from '../services/brevo'
import './ContactForm.css'

function ContactForm() {
  const [state, handleSubmit] = useForm(import.meta.env.VITE_FORMSPREE_FORM_ID || "xdkoorvg")
  const { brevoIntegration } = useFlags() || {}

  const onSubmit = async (e) => {
    e.preventDefault()

    const formData = new FormData(e.target)

    // Feature flag: brevo-integration (kebab-case in LaunchDarkly, camelCase in code)
    // undefined/false = OFF (safe default, no Brevo call)
    // true = ON (Brevo integration active)
    if (brevoIntegration) {
      try {
        const brevo = new BrevoClient()

        const result = await brevo.createContact({
          email: formData.get('email'),
          firstName: formData.get('name'),
          attributes: { message: formData.get('message') }
        })

        if (!result.success) {
          console.error('Brevo integration failed:', result.error)
        }
      } catch (error) {
        console.error('Brevo integration error:', error.message)
      }
    }

    // Always proceed with normal form submission
    handleSubmit(e)
  }

  if (state.succeeded) {
    return (
      <section className="contact-form">
        <h2>Get In Touch</h2>
        <div className="success-message">
          <p>Thanks for reaching out! We'll get back to you soon.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="contact-form">
      <h2>Get In Touch</h2>
      <p className="form-intro">
        Ready to build your Software Factory? Let's talk about how autonomous SDLC
        can transform your team.
      </p>

      <form onSubmit={onSubmit}>
        <div className="form-group">
          <label htmlFor="name">
            Name *
          </label>
          <input
            id="name"
            type="text"
            name="name"
            required
          />
          <ValidationError
            prefix="Name"
            field="name"
            errors={state.errors}
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">
            Email *
          </label>
          <input
            id="email"
            type="email"
            name="email"
            required
          />
          <ValidationError
            prefix="Email"
            field="email"
            errors={state.errors}
          />
        </div>

        <div className="form-group">
          <label htmlFor="message">
            Tell us about your interest *
          </label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
          />
          <ValidationError
            prefix="Message"
            field="message"
            errors={state.errors}
          />
        </div>

        <button type="submit" disabled={state.submitting}>
          {state.submitting ? 'Sending...' : 'Send Message'}
        </button>

        {state.errors && state.errors.length > 0 && (
          <div className="error-message">
            Something went wrong. Please try again.
          </div>
        )}
      </form>
    </section>
  )
}

export default ContactForm
