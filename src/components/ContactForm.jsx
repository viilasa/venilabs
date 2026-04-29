import { useState } from 'react'
import { CONTACT_EMAIL } from '../lib/siteLinks'

/** Set VITE_CONTACT_FORM_ENDPOINT in `.env` to a Formspree or compatible POST URL */
const CONTACT_FORM_ENDPOINT =
  typeof import.meta.env.VITE_CONTACT_FORM_ENDPOINT === 'string'
    ? import.meta.env.VITE_CONTACT_FORM_ENDPOINT.trim()
    : ''

export function ContactForm({ variant = 'default' }) {
  const compact = variant === 'dialog'
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState('idle')
  const [errorMessage, setErrorMessage] = useState('')

  const resetFeedback = () => {
    setErrorMessage('')
    setStatus('idle')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    resetFeedback()

    const payload = { name: name.trim(), email: email.trim(), phone: phone.trim(), message: message.trim() }

    if (!payload.name || !payload.email || !payload.phone || !payload.message) {
      setStatus('error')
      setErrorMessage('Please fill in name, email, phone, and project details.')
      return
    }

    setStatus('sending')

    if (CONTACT_FORM_ENDPOINT) {
      try {
        const res = await fetch(CONTACT_FORM_ENDPOINT, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        })
        if (!res.ok) throw new Error('Request failed')
        setStatus('success')
        setName('')
        setEmail('')
        setPhone('')
        setMessage('')
      } catch {
        setStatus('error')
        setErrorMessage('Something went wrong. Try WhatsApp or call instead.')
      }
      return
    }

    const body = encodeURIComponent(
      `Name: ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\n\n${payload.message}`,
    )
    const subject = encodeURIComponent(`Website inquiry · ${payload.name}`)
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${subject}&body=${body}`
    setStatus('success')
  }

  return (
    <div className={`contact-form-panel${compact ? ' contact-form-panel--dialog' : ''}`}>
      {!compact ? (
        <div className="contact-form-intro">
          <p className="contact-form-eyebrow">Contact</p>
          <p className="contact-form-title">Tell us what you need</p>
        </div>
      ) : null}
      <form className="contact-form" onSubmit={handleSubmit} noValidate>
        <label className="contact-field">
          <span>Name</span>
          <input
            name="name"
            type="text"
            autoComplete="name"
            placeholder="Your name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </label>
        <label className="contact-field">
          <span>Email</span>
          <input
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            placeholder="you@business.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label className="contact-field">
          <span>Phone</span>
          <input
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            placeholder="WhatsApp or call number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </label>
        <label className="contact-field">
          <span>Project details</span>
          <textarea
            name="message"
            rows={4}
            placeholder="Briefly describe your business and what you want the site to achieve."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
        </label>

        <button type="submit" className="btn btn-solid contact-submit" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : 'Submit inquiry'}
        </button>

        {status === 'success' ? (
          <p className="contact-form-note contact-form-success" role="status">
            {CONTACT_FORM_ENDPOINT
              ? 'Thanks — we received your message and will reply soon.'
              : 'Your email client should open — send the draft and we will get back to you.'}
          </p>
        ) : null}
        {status === 'error' && errorMessage ? (
          <p className="contact-form-note contact-form-error" role="alert">
            {errorMessage}
          </p>
        ) : null}
      </form>
    </div>
  )
}
