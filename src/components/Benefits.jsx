import './Benefits.css'

function Benefits() {
  const benefits = [
    {
      title: '10x Faster Development',
      description: 'AI agents handle implementation, testing, and deployment while you focus on architecture. Ship features in hours, not weeks.'
    },
    {
      title: 'Systematic Quality',
      description: 'Built-in practices ensure consistent quality: TDD, small batches, CI/CD, and feature flags. Every commit follows the same reliable process.'
    },
    {
      title: 'Strategic Focus',
      description: 'Engineers design and supervise instead of writing boilerplate. Spend time on architecture, user needs, and business value.'
    },
    {
      title: 'Autonomous Deployment',
      description: 'From user story to production automatically. AI agents create PRs, run tests, merge code, and deploy - all following your best practices.'
    }
  ]

  return (
    <section className="benefits">
      <h2>Why Software Factory?</h2>
      <div className="benefits-grid">
        {benefits.map((benefit, index) => (
          <article key={index} className="benefit-card">
            <h3>{benefit.title}</h3>
            <p>{benefit.description}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default Benefits
