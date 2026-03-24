import { useState } from 'react'
import { BrowserRouter, NavLink, Route, Routes } from 'react-router-dom'
import './App.css'

function Home() {
  return (
    <section className="card">
      <h2>Home</h2>
      <p>Welcome to my  website.</p>
      <p> I am learning React Router and forms.</p>
    </section>
  )
}

function About() {
  return (
    <section className="card">
      <h2>About</h2>
      <p>
        This app is a simple practice project made while learning React.
      </p>
      <p>
        It uses client-side routing so pages change without reloading the full
        website.
      </p>
    </section>
  )
}

function Contact() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  function handleSubmit(event) {
    event.preventDefault()

    const formData = {
      name,
      email,
      message,
    }

    console.log('Contact form submitted:', formData)

    setName('')
    setEmail('')
    setMessage('')
  }

  return (
    <section className="card">
      <h2>Contact</h2>
      <p>Send me a message using this controlled form.</p>

      <form onSubmit={handleSubmit} className="contact-form">
        <label htmlFor="name">Name</label>
        <input
          id="name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Your name"
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="you@example.com"
          required
        />

        <label htmlFor="message">Message</label>
        <textarea
          id="message"
          rows="4"
          value={message}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="Write your message"
          required
        />

        <button type="submit">Submit</button>
      </form>
    </section>
  )
}

function App() {
  return (
    <BrowserRouter>
      <div className="site">
        <header className="site-header">
          <h1>My Website</h1>
  
        </header>

        <nav className="navbar">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/about">About</NavLink>
          <NavLink to="/contact">Contact</NavLink>
        </nav>

        <main className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/contact" element={<Contact />} />
          </Routes>
        </main>

        <footer className="site-footer">
          <p> React Router Practice</p>
        </footer>
      </div>
    </BrowserRouter>
  )
}

export default App
