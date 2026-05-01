import { useCallback, useEffect, useRef, useState } from 'react'
import { ContactDialog } from '../components/ContactDialog'
import { VenilabsLogoMark } from '../components/VenilabsLogoMark'
import { ContactForm } from '../components/ContactForm'
import { SiteFooter } from '../components/SiteFooter'
import { ThemeToggle } from '../components/ThemeToggle'
import portfolioData from '../data/projects.json'
import testimonials from '../data/testimonials.json'
import { WHATSAPP_CHAT_URL } from '../lib/siteLinks'
import { usePageMeta } from '../hooks/usePageMeta'

function buildRecentWorkList(data) {
  return (data.clientWorks ?? []).map((c) => ({
    title: c.title.trim(),
    result: `${c.category} · ${c.description}`,
    url: c.link,
    image: c.image ?? null,
  }))
}

const recentWork = buildRecentWorkList(portfolioData)

const HERO_WIREFRAME_URL =
  'https://res.cloudinary.com/ddhhlkyut/image/upload/v1777570348/-high-fidelity-monochrome-website-wireframe-illust_pxspaa.svg'

const processSteps = [
  {
    label: 'Step 1',
    title: 'Strategy Call',
    illustrationSrc:
      'https://res.cloudinary.com/ddhhlkyut/image/upload/v1777563000/1sr_sreo_jdk5xu.svg',
  },
  {
    label: 'Step 2',
    title: 'Design and Build',
    illustrationSrc:
      'https://res.cloudinary.com/ddhhlkyut/image/upload/v1777563286/2nd_section_gjcjmb.svg',
  },
  {
    label: 'Step 3',
    title: 'Launch and Start Getting Leads',
    illustrationSrc:
      'https://res.cloudinary.com/ddhhlkyut/image/upload/v1777563827/-minimalist-vector-line-art-illustration--premium-_jldijf.svg',
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
  const featuredProjects = recentWork.slice(0, 3)
  const remainingProjects = recentWork.slice(3)
  const visibleProjects = showAllProjects ? recentWork : featuredProjects
  const currentProcessStep = processSteps[activeProcessStep]
  const filledAvailabilitySlots = getWeeklyFilledSlots()
  /** Rightmost lit dot among slots 1–4 (5th stays empty UI). Only this one pulses. */
  const latestFilledDotIndex =
    filledAvailabilitySlots > 0 ? Math.min(filledAvailabilitySlots, 4) - 1 : -1

  usePageMeta({
    title: 'Venilabs — Affordable Website Designer Goa | Fast, SEO-Ready Sites',
    description:
      'Venilabs is Goa’s affordable website designer: premium mobile-first sites in 7–10 days, built for calls, WhatsApp leads, and bookings. Great value vs typical agency pricing.',
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
        <div className="topbar-actions">
          <ThemeToggle />
        </div>
        <a href="/" className="topbar-brand" aria-label="Venilabs home">
          <span className="topbar-brand-mark">
            <VenilabsLogoMark className="logo-mark" />
          </span>
          <span className="topbar-brand-word">Venilabs</span>
        </a>
      </header>

      <main>
        <section
          className="hero section"
          style={{
            '--hero-wireframe-url': `url("${HERO_WIREFRAME_URL}")`,
          }}
        >
          <div className="hero-bg-art" aria-hidden="true" />
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
        </section>

        <section className="section problem-section">
          <div className="problem-layout">
            <div>
              <h2>Your website is costing you clients — especially on Google in Goa.</h2>
              <p>
                Most local businesses need an affordable website designer who understands mobile traffic and local search. If your site looks dated, people pick a competitor who looks more trustworthy.
              </p>
              <p className="strong">Better design = more trust = more leads.</p>
            </div>
            <div className="problem-illustration" aria-hidden="true">
              <img
                className="problem-section-svg"
                src="https://res.cloudinary.com/ddhhlkyut/image/upload/v1777569048/-minimalist-vector-line-art-illustration--premium-_3_ef4agv.svg"
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="section feature-section">
          <div className="feature-layout">
            <div className="feature-illustration" aria-hidden="true">
              <img
                className="feature-section-svg"
                src="https://res.cloudinary.com/ddhhlkyut/image/upload/v1777569323/-minimalist-vector-line-art-illustration--premium-_5_ffkumy.svg"
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </div>
            <div>
              <h2>What You Actually Get</h2>
              <ul className="bullet-list">
                <li>Custom premium website (no generic templates)</li>
                <li>Mobile optimized — most Goa searches happen on phones</li>
                <li>Lead-focused structure (clear calls to action)</li>
                <li>Fast loading, clean SEO foundation, and schema-friendly markup</li>
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
            {visibleProjects.map((project, index) => (
              <a
                className="card work-card-link"
                key={`${project.title}-${index}`}
                href={project.url}
                {...(project.url && project.url !== '#'
                  ? { target: '_blank', rel: 'noreferrer' }
                  : {})}
              >
                <article>
                  <div
                    className={`thumb${project.image ? ' thumb-has-image' : ''}`}
                    aria-hidden="true"
                    style={
                      project.image
                        ? {
                            background: `var(--bg-muted-2) url(${project.image}) center center / cover no-repeat`,
                          }
                        : undefined
                    }
                  />
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
            <div className="process-illustration" aria-hidden="true">
              <img
                key={activeProcessStep}
                className="process-section-svg"
                src={currentProcessStep.illustrationSrc}
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
              />
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

        <section className="section availability-section">
          <div className="availability-layout">
            <div className="availability-copy">
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
            </div>
            <div className="availability-art" aria-hidden="true">
              <img
                className="availability-section-svg"
                src="https://res.cloudinary.com/ddhhlkyut/image/upload/v1777567087/-minimalist-vector-line-art-illustration--premium-_2_g6dvay.svg"
                alt=""
                width={1024}
                height={1024}
                loading="lazy"
                decoding="async"
              />
            </div>
          </div>
        </section>

        <section className="section cta-section" id="contact">
          <div className="cta-layout">
            <div className="cta-copy">
              <h2>Ready to Look Premium?</h2>
              <p className="cta-lead">Let us build a website that actually brings clients.</p>
              <div className="cta-row">
                <button type="button" className="btn btn-solid" onClick={openContact}>
                  Get My Website
                </button>
                <a className="btn btn-outline" href={WHATSAPP_CHAT_URL} target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>

      <ContactDialog open={contactOpen} onClose={closeContact} />

      <SiteFooter />
    </div>
  )
}
