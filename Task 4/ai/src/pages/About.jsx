function About() {
  return (
    <section className="page page-about">
      <div className="content-card reveal">
        <p className="eyebrow">About The Application</p>
        <h1>Built for a clean client-side experience.</h1>
        <p>
          This React application demonstrates modern single-page navigation using
          React Router, enabling smooth transitions between pages without full
          browser reloads.
        </p>
        <p>
          The contact workflow showcases controlled form patterns in React with
          <strong> useState </strong>
          for every input field, making state updates predictable and easy to
          validate.
        </p>
      </div>
    </section>
  )
}

export default About
