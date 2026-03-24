function Home() {
  return (
    <section className="page page-home">
      <div className="hero-card reveal">
        <p className="eyebrow">Welcome to Northstar Advisory</p>
        <h1>Clarity for complex business decisions.</h1>
        <p className="lead">
          We help teams transform strategy into measurable outcomes through
          human-centered planning, operational design, and digital execution.
        </p>
      </div>
      <div className="insight-grid">
        <article className="insight-card reveal delay-1">
          <h2>Strategic Planning</h2>
          <p>
            Align your leadership team around a practical roadmap with clear
            milestones and accountability.
          </p>
        </article>
        <article className="insight-card reveal delay-2">
          <h2>Digital Transformation</h2>
          <p>
            Modernize systems and processes while improving team experience and
            customer value.
          </p>
        </article>
        <article className="insight-card reveal delay-3">
          <h2>Performance Optimization</h2>
          <p>
            Improve efficiency and quality with data-backed performance reviews
            and workflow redesign.
          </p>
        </article>
      </div>
    </section>
  )
}

export default Home
