import { useForm, ValidationError } from '@formspree/react'
import './ContactForm.css'

function ContactForm() {
  const [state, handleSubmit] = useForm("xdkoorvg") // Placeholder form ID - needs to be replaced with actual Formspree ID

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

      <form onSubmit={handleSubmit}>
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
