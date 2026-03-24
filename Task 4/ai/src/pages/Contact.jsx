import { useState } from 'react'

const initialFormData = {
  name: '',
  email: '',
  message: '',
}

function Contact() {
  const [formData, setFormData] = useState(initialFormData)

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }))
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    console.log('Contact form submission:', formData)
    setFormData(initialFormData)
  }

  return (
    <section className="page page-contact">
      <div className="content-card reveal">
        <p className="eyebrow">Contact Us</p>
        <h1>Let&apos;s start your next project.</h1>
        <p>
          Fill out the form and we&apos;ll follow up with a tailored recommendation.
        </p>
      </div>

      <form className="contact-form reveal delay-1" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          id="name"
          name="name"
          type="text"
          value={formData.name}
          onChange={handleChange}
          placeholder="Your full name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="you@company.com"
          required
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          name="message"
          rows="5"
          value={formData.message}
          onChange={handleChange}
          placeholder="Tell us what you are building and your goals."
          required
        />

        <button type="submit">Send Message</button>
      </form>
    </section>
  )
}

export default Contact
