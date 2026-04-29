import { useCallback, useEffect, useRef, useState } from 'react'
import { ContactDialog } from '../components/ContactDialog'
import { SiteFooter } from '../components/SiteFooter'
import { ThemeToggle } from '../components/ThemeToggle'
import projects from '../data/projects.json'
import testimonials from '../data/testimonials.json'
import { usePageMeta } from '../hooks/usePageMeta'

const processSteps = [
  {
    label: 'Step 1',
    title: 'Strategy Call',
    visualClass: 'step-visual-1',
    bars: ['92%', '72%', '48%'],
  },
  {
    label: 'Step 2',
    title: 'Design and Build',
    visualClass: 'step-visual-2',
    bars: ['76%', '90%', '62%'],
  },
  {
    label: 'Step 3',
    title: 'Launch and Start Getting Leads',
    visualClass: 'step-visual-3',
    bars: ['88%', '64%', '94%'],
  },
]

function getWeeklyFilledSlots() {
  const WEEK_MS = 7 * 24 * 60 * 60 * 1000
  const weeksSinceEpoch = Math.floor(Date.now() / WEEK_MS)
  const weekInCycle = (weeksSinceEpoch % 5) + 1
  return weekInCycle === 5 ? 1 : weekInCycle
}

export function HomePage() {
  const [contactOpen, setContactOpen] = useState(false)
  const closeContact = useCallback(() => setContactOpen(false), [])
  const openContact = useCallback(() => setContactOpen(true), [])

  const [showAllProjects, setShowAllProjects] = useState(false)
  const [activeProcessStep, setActiveProcessStep] = useState(0)
  const processSectionRef = useRef(null)
  const featuredProjects = projects.slice(0, 3)
  const remainingProjects = projects.slice(3)
  const visibleProjects = showAllProjects ? projects : featuredProjects
  const currentProcessStep = processSteps[activeProcessStep]
  const filledAvailabilitySlots = getWeeklyFilledSlots()
  /** Rightmost lit dot among slots 1–4 (5th stays empty UI). Only this one pulses. */
  const latestFilledDotIndex =
    filledAvailabilitySlots > 0 ? Math.min(filledAvailabilitySlots, 4) - 1 : -1

  usePageMeta({
    title: 'Venilabs Local Goa | High-Converting Premium Websites',
    description:
      'Venilabs builds premium, mobile-first websites for Goa businesses in 7-10 days to generate more calls, WhatsApp leads, and bookings.',
    path: '/',
  })

  useEffect(() => {
    const updateActiveStep = () => {
      if (!processSectionRef.current) return

      const rect = processSectionRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const totalScrollable = rect.height - viewportHeight

      if (totalScrollable <= 0) {
        setActiveProcessStep(0)
        return
      }

      const traveled = Math.min(Math.max(-rect.top, 0), totalScrollable)
      const progress = traveled / totalScrollable
      const step = Math.min(processSteps.length - 1, Math.floor(progress * processSteps.length))

      setActiveProcessStep((prev) => (prev === step ? prev : step))
    }

    updateActiveStep()
    window.addEventListener('scroll', updateActiveStep, { passive: true })
    window.addEventListener('resize', updateActiveStep)

    return () => {
      window.removeEventListener('scroll', updateActiveStep)
      window.removeEventListener('resize', updateActiveStep)
    }
  }, [])

  return (
    <div className="page">
      <header className="topbar">
        <a href="/" className="logo" aria-label="Venilabs home">
          Venilabs
        </a>
        <div className="topbar-actions">
          <ThemeToggle />
        </div>
      </header>

      <main>
        <section className="hero section">
          <div className="hero-content">
            <h1>Websites That Turn Visitors Into Paying Clients</h1>
            <p className="lead">
              Built for businesses in Goa that want to look premium and attract better clients.
            </p>
            <div className="cta-row">
              <button type="button" className="btn btn-solid" onClick={openContact}>
                Get My Website
              </button>
            </div>
            <ul className="trust-list">
              <li>Delivered in 7-10 days</li>
              <li>Mobile-first design</li>
              <li>Built for conversions</li>
            </ul>
          </div>
          <div className="mockup">
            <p>Website Preview</p>
            <div className="mockup-card">
              <div className="line lg" />
              <div className="line" />
              <div className="line sm" />
            </div>
          </div>
        </section>

        <section className="section problem-section">
          <div className="problem-layout">
            <div>
              <h2>Your website is costing you clients.</h2>
              <p>
                Most businesses in Goa look outdated online. Your competitors are not better -
                they just look more premium.
              </p>
              <p className="strong">Better design = more trust = more leads.</p>
            </div>
            <div className="problem-illustration" aria-hidden="true">
              <div className="problem-window">
                <div className="problem-dot-row">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="problem-bar lg" />
                <div className="problem-bar" />
                <div className="problem-bar sm" />
              </div>
            </div>
          </div>
        </section>

        <section className="section feature-section">
          <div className="feature-layout">
            <div className="feature-illustration" aria-hidden="true">
              <div className="feature-window">
                <div className="feature-row lg" />
                <div className="feature-row" />
                <div className="feature-row sm" />
                <div className="feature-grid">
                  <span />
                  <span />
                  <span />
                  <span />
                </div>
              </div>
            </div>
            <div>
              <h2>What You Actually Get</h2>
              <ul className="bullet-list">
                <li>Custom premium website (no templates)</li>
                <li>Mobile optimized (90% traffic)</li>
                <li>Lead-focused structure</li>
                <li>Fast loading and SEO-ready setup</li>
              </ul>
              <p className="strong">
                This is not just a website. This is a client acquisition system.
              </p>
            </div>
          </div>
        </section>

        <section className="section recent-section">
          <h2>Recent Work</h2>
          <div className="grid recent-grid">
            {visibleProjects.map((project) => (
              <a
                className="card work-card-link"
                key={project.title}
                href={project.url}
                target="_blank"
                rel="noreferrer"
              >
                <article>
                  <div className="thumb" aria-hidden="true" />
                  <h3>{project.title}</h3>
                  <p>{project.result}</p>
                </article>
              </a>
            ))}
          </div>
          {remainingProjects.length > 0 ? (
            <button type="button" className="line-toggle" onClick={() => setShowAllProjects((prev) => !prev)}>
              {showAllProjects ? 'Show less' : 'Show more'}
            </button>
          ) : null}
        </section>

        <section className="section testimonials-section">
          <h2>What Clients Say</h2>
          <div className="grid">
            {testimonials.map((item) => (
              <blockquote className="card quote" key={`${item.name}-${item.business}`}>
                "{item.quote}" — {item.name}, {item.business}
              </blockquote>
            ))}
          </div>
        </section>

        <section className="section process-scroll-section" ref={processSectionRef}>
          <div className="process-sticky">
            <div className={`process-illustration ${currentProcessStep.visualClass}`} aria-hidden="true">
              <div className="process-window">
                <div className="process-dot-row">
                  <span />
                  <span />
                  <span />
                </div>
                {currentProcessStep.bars.map((width) => (
                  <div className="process-line" style={{ width }} key={width} />
                ))}
              </div>
            </div>
            <div className="process-right">
              <h2 className="process-main-heading">Simple 3-Step Process</h2>
              <div className="process-steps-stack">
                {processSteps.map((step, index) => (
                  <article
                    key={step.label}
                    className={`process-step-card ${
                      index === activeProcessStep
                        ? 'is-active'
                        : index < activeProcessStep
                          ? 'is-past'
                          : 'is-future'
                    }`}
                  >
                    <p className="process-step-label">{step.label}</p>
                    <h2 className="process-step-title">{step.title}</h2>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="section pricing-section">
          <div className="pricing-layout">
            <div className="pricing-copy">
              <p className="eyebrow">Transparent pricing</p>
              <h2>Premium Does Not Have to Be Expensive</h2>
              <p className="pricing-lead">
                Most professional websites cost Rs. 50,000 or more for a comparable build. Same quality positioning,
                clearer offer, faster delivery — without the agency markup.
              </p>
            </div>
            <div className="pricing-panel" aria-hidden="true">
              <div className="pricing-compare">
                <div className="pricing-row">
                  <span className="pricing-row-label">Typical agency</span>
                  <div className="pricing-bar-track">
                    <div className="pricing-bar-fill is-market" />
                  </div>
                  <span className="pricing-row-value">Rs. 50,000+</span>
                </div>
                <div className="pricing-row is-highlight">
                  <span className="pricing-row-label">Venilabs</span>
                  <div className="pricing-bar-track">
                    <div className="pricing-bar-fill is-venilabs" />
                  </div>
                  <span className="pricing-row-value">Rs. 15,000 – Rs. 20,000</span>
                </div>
              </div>
              <p className="pricing-footnote">Limited spots available each month.</p>
            </div>
          </div>
        </section>

        <section className="section">
          <h2>We Only Take 5 Clients Per Month</h2>
          <p>To maintain quality and results. Once slots are full, bookings close.</p>
          <div className="availability-dots" aria-label="Monthly slots availability indicator">
            {[0, 1, 2, 3, 4].map((index) => {
              const isFilled = index < filledAvailabilitySlots && index < 4
              const blinksLatest = isFilled && index === latestFilledDotIndex
              return (
                <span
                  key={index}
                  className={`availability-dot${isFilled ? ' is-filled' : ''}${
                    blinksLatest ? ' is-blinking' : ''
                  }`}
                />
              )
            })}
          </div>
        </section>

        <section className="section cta-section" id="contact">
          <div className="cta-layout cta-layout-contact-only">
            <div className="cta-copy">
              <h2>Ready to Look Premium?</h2>
              <p className="cta-lead">Let us build a website that actually brings clients.</p>
              <div className="cta-row">
                <button type="button" className="btn btn-solid" onClick={openContact}>
                  Get My Website
                </button>
                <a className="btn btn-outline" href="https://wa.me/919876543210" target="_blank" rel="noreferrer">
                  WhatsApp
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      <ContactDialog open={contactOpen} onClose={closeContact} />

      <SiteFooter />
    </div>
  )
}
