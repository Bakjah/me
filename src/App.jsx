import React, { useState, useEffect, useRef, createContext, useContext } from 'react'

// ─── THEME CONTEXT ───────────────────────────────────────────────────────────
export const ThemeContext = createContext()

function ThemeProvider({ children }) {
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
      {children}
    </ThemeContext.Provider>
  )
}

// ─── USE SCROLL ANIMATION HOOK ─────────────────────────────────────────────
function useScrollAnimation(options = {}) {
  const ref = useRef(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const element = ref.current
    if (!element) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting)
      },
      {
        threshold: options.threshold || 0.15,
        rootMargin: options.rootMargin || '0px',
      }
    )

    observer.observe(element)
    return () => observer.disconnect()
  }, [options.threshold, options.rootMargin])

  return [ref, isVisible]
}

// ─── SCROLL ANIMATED SECTION WRAPPER ───────────────────────────────────────
function AnimatedSection({ children, className = '', delay = 0 }) {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  return (
    <div
      ref={ref}
      className={`scroll-animated ${isVisible ? 'scroll-visible' : 'scroll-hidden'} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  )
}

// ─── COUNTER ANIMATION HOOK ─────────────────────────────────────────────────
function useCounter(end, duration = 2000, start = false) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!start) return
    let startTime = null
    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration, start])

  return count
}

// ─── ANIMATED COUNTER ───────────────────────────────────────────────────────
function AnimatedCounter({ end, suffix = '', duration = 2000 }) {
  const [heroRef, isHeroVisible] = useScrollAnimation({ threshold: 0.5 })
  const count = useCounter(end, duration, isHeroVisible)

  return (
    <span ref={heroRef}>
      {count}
      {suffix}
    </span>
  )
}

// ─── NAVBAR ─────────────────────────────────────────────────────────────────
function Navbar() {
  const { darkMode, setDarkMode } = useContext(ThemeContext)
  const [scrolled, setScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    setMobileMenuOpen(false)
  }

  const navLinks = [
    { id: 'about', label: 'Tentang' },
    { id: 'skills', label: 'Skills' },
    { id: 'portfolio', label: 'Portfolio' },
    { id: 'services', label: 'Layanan' },
    { id: 'contact', label: 'Kontak' },
  ]

  return (
    <nav className={`navbar ${scrolled ? 'navbar-scrolled' : ''}`}>
      <div className="nav-container">
        <a href="#" className="nav-logo" onClick={(e) => { e.preventDefault(); window.scrollTo({ top: 0, behavior: 'smooth' }) }}>
          <span className="logo-bracket">{"<"}</span>
          <span className="logo-text">mochbagja_fad</span>
          <span className="logo-bracket">{"/>"}</span>
        </a>

        <ul className={`nav-links ${mobileMenuOpen ? 'nav-links-open' : ''}`}>
          {navLinks.map((link) => (
            <li key={link.id}>
              <a href={`#${link.id}`} onClick={(e) => { e.preventDefault(); scrollTo(link.id) }}>
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <div className="nav-actions">
          <button
            className="theme-toggle"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <i className="material-icons-round">light_mode</i>
            ) : (
              <i className="material-icons-round">dark_mode</i>
            )}
          </button>
          <button className="nav-cta" onClick={() => scrollTo('contact')}>
            Hire Me
          </button>
          <button
            className="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? (
              <i className="material-icons-round">close</i>
            ) : (
              <i className="material-icons-round">menu</i>
            )}
          </button>
        </div>
      </div>
    </nav>
  )
}

// ─── FLOATING PARTICLES BACKGROUND ─────────────────────────────────────────
function FloatingParticles() {
  const particles = React.useMemo(() => {
    return Array.from({ length: 15 }).map((_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 10,
      duration: 20 + Math.random() * 15,
      size: 2 + Math.random() * 4,
    }))
  }, [])

  return (
    <div className="particles-container">
      {particles.map((p) => (
        <div
          key={p.id}
          className="particle"
          style={{
            left: `${p.left}%`,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
            width: `${p.size}px`,
            height: `${p.size}px`,
          }}
        />
      ))}
    </div>
  )
}

// ─── HERO ───────────────────────────────────────────────────────────────────
function Hero() {
  const [ref, isVisible] = useScrollAnimation({ threshold: 0.1 })

  const [displayText, setDisplayText] = useState('')
  const [phase, setPhase] = useState('typing')
  const roleIndexRef = useRef(0)

  const roles = [
    'Full Stack Developer',
    'UI/UX Designer',
    'Mobile App Developer',
    'Tech Lead',
  ]

  useEffect(() => {
    const currentRole = roles[roleIndexRef.current]

    if (phase === 'typing') {
      if (displayText.length < currentRole.length) {
        const timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length + 1))
        }, 100)
        return () => clearTimeout(timeout)
      } else {
        const timeout = setTimeout(() => {
          setPhase('pausing')
        }, 2000)
        return () => clearTimeout(timeout)
      }
    } else if (phase === 'pausing') {
      setPhase('deleting')
    } else if (phase === 'deleting') {
      if (displayText.length > 0) {
        const timeout = setTimeout(() => {
          setDisplayText(currentRole.substring(0, displayText.length - 1))
        }, 50)
        return () => clearTimeout(timeout)
      } else {
        roleIndexRef.current = (roleIndexRef.current + 1) % roles.length
        setPhase('typing')
      }
    }
  }, [displayText, phase])

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <section className="hero" id="home" ref={ref}>
      <FloatingParticles />
      <div className={`hero-content ${isVisible ? 'hero-visible' : ''}`}>
        <div className="hero-badge">
          <span className="badge-dot"></span>
          <span>Available for Freelance & Full-time</span>
        </div>

        <h1 className="hero-title">
          Hi, I'm{' '}
          <span className="gradient-text"> Bakjah</span>
        </h1>

        <div className="typewriter-container">
          <span className="typewriter-prefix">I am a </span>
          <span className="typewriter-text">{displayText}</span>
          <span className="typewriter-cursor">|</span>
        </div>

        <p className="hero-description">
          Crafting exceptional digital experiences through clean code and thoughtful design.
          Specialized in building scalable web applications that drive business growth.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary" onClick={() => scrollTo('portfolio')}>
            <i className="material-icons-round">work</i>
            <span>View Portfolio</span>
          </button>
          <button className="btn-secondary" onClick={() => scrollTo('contact')}>
            <i className="material-icons-round">forum</i>
            <span>Let's Talk</span>
          </button>
        </div>

        <div className="hero-social-links">
          <a href="#" className="social-link" aria-label="GitHub">
            <i className="fab fa-github"></i>
          </a>
          <a href="#" className="social-link" aria-label="LinkedIn">
            <i className="fab fa-linkedin-in"></i>
          </a>
          <a href="#" className="social-link" aria-label="Twitter">
            <i className="fab fa-x-twitter"></i>
          </a>
          <a href="#" className="social-link" aria-label="Dribbble">
            <i className="fab fa-dribbble"></i>
          </a>
        </div>
      </div>

      <div className="hero-stats-container">
        <div className="hero-stat-item">
          <span className="stat-number">
            <AnimatedCounter end={3} suffix="+" duration={1500} />
          </span>
          <span className="stat-label">Years Experience</span>
        </div>
        <div className="stat-divider"></div>
        <div className="hero-stat-item">
          <span className="stat-number">
            <AnimatedCounter end={50} suffix="+" duration={2000} />
          </span>
          <span className="stat-label">Projects Done</span>
        </div>
        <div className="stat-divider"></div>
        <div className="hero-stat-item">
          <span className="stat-number">
            <AnimatedCounter end={100} suffix="%" duration={1500} />
          </span>
          <span className="stat-label">Satisfaction</span>
        </div>
      </div>

          </section>
  )
}

// ─── ABOUT ──────────────────────────────────────────────────────────────────
function About() {
  const highlights = [
    {
      icon: 'gps_fixed',
      bg: 'var(--purple-light)',
      color: 'var(--purple)',
      title: 'Problem Solver',
      subtitle: 'Analytical & Creative',
    },
    {
      icon: 'group',
      bg: 'var(--teal-light)',
      color: 'var(--teal)',
      title: 'Team Player',
      subtitle: 'Collaborative Approach',
    },
    {
      icon: 'schedule',
      bg: 'var(--coral-light)',
      color: 'var(--coral)',
      title: 'Time Manager',
      subtitle: 'Deadline Focused',
    },
    {
      icon: 'favorite',
      bg: 'var(--purple-light)',
      color: 'var(--purple)',
      title: 'Passionate',
      subtitle: 'Love What I Do',
    },
  ]

  return (
    <section id="about" className="about-section">
      <AnimatedSection className="section-header">
        <span className="section-tag">
          <i className="material-icons-round">person</i>
          About Me
        </span>
        <h2 className="section-title">
          Transforming Ideas Into{' '}
          <span className="gradient-text">Digital Reality</span>
        </h2>
      </AnimatedSection>

      <div className="about-content">
        <AnimatedSection className="about-left" delay={100}>
          <div className="about-image-wrapper">
            <div className="about-image">
              <i className="material-icons-round" style={{ fontSize: '80px', color: 'var(--primary)' }}>gps_fixed</i>
            </div>
            <div className="experience-badge">
              <span className="exp-number">3+</span>
              <span className="exp-text">Years<br />Experience</span>
            </div>
          </div>
        </AnimatedSection>

        <div className="about-right">
          <AnimatedSection delay={200}>
            <p className="about-intro">
              I'm a <strong>Full Stack Developer</strong> based in Sumedang, West Java,
              Indonesia. With a deep passion for creating elegant solutions to complex
              problems, I specialize in building modern web and mobile applications.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={300}>
            <p className="about-text">
              My journey in tech has been driven by continuous learning and a desire
              to deliver exceptional results. I combine technical expertise with creative
              thinking to build products that not only function flawlessly but also
              provide outstanding user experiences.
            </p>
          </AnimatedSection>

          <AnimatedSection delay={400}>
            <div className="about-highlights">
              {highlights.map((item, index) => (
                <div className="highlight-card" key={index}>
                  <div className="highlight-icon" style={{ background: item.bg }}>
                    <i className="material-icons-round" style={{ fontSize: '22px', color: item.color }}>{item.icon}</i>
                  </div>
                  <div className="highlight-info">
                    <span className="highlight-title">{item.title}</span>
                    <span className="highlight-subtitle">{item.subtitle}</span>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>

          <AnimatedSection delay={500}>
            <div className="about-actions">
              <a href="#" className="btn-primary">
                <i className="material-icons-round">download</i>
                Download CV
              </a>
              <a href="#contact" className="btn-outline" onClick={(e) => {
                e.preventDefault();
                document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
              }}>
                <i className="material-icons-round">mail</i>
                Contact Me
              </a>
            </div>
          </AnimatedSection>
        </div>
      </div>
    </section>
  )
}

// ─── SKILLS ─────────────────────────────────────────────────────────────────
function Skills() {
  const skillCategories = [
    {
      title: 'Frontend Development',
      skills: [
        { name: 'HTML5 / CSS3 / JavaScript', level: 95, color: '#E34F26' },
        { name: 'React.js / Next.js', level: 90, color: '#61DAFB' },
        { name: 'Responsive Web Design', level: 92, color: '#06B6D4' },
        { name: 'UI Implementation', level: 88, color: '#F7DF1E' },
      ],
    },
    {
      title: 'Backend Development',
      skills: [
        { name: 'Node.js / Express.js', level: 88, color: '#339933' },
        { name: 'PHP / Laravel', level: 85, color: '#FF2D20' },
        { name: 'REST API Development', level: 90, color: '#E535AB' },
        { name: 'Authentication (JWT / Session)', level: 86, color: '#3776AB' },
      ],
    },
    {
      title: 'Database & Deployment',
      skills: [
        { name: 'MySQL / PostgreSQL', level: 85, color: '#4479A1' },
        { name: 'MongoDB', level: 82, color: '#47A248' },
        { name: 'Git / GitHub', level: 92, color: '#F05032' },
        { name: 'Vercel / Netlify / VPS Linux', level: 80, color: '#FF9900' },
      ],
    },
  ]

  const tools = [
    { name: 'VS Code', iconClass: 'fas', iconName: 'code' },
    { name: 'Git', iconClass: 'fab', iconName: 'github' },
    { name: 'Laravel', iconClass: 'fab', iconName: 'laravel' },
    { name: 'Postman', iconClass: 'fas', iconName: 'paper-plane' },
    { name: 'MySQL', iconClass: 'fas', iconName: 'database' },
    { name: 'Figma', iconClass: 'fab', iconName: 'figma' },
    { name: 'Vercel', iconClass: 'fas', iconName: 'rocket' },
    { name: 'Node.js', iconClass: 'fab', iconName: 'node-js' },
  ]

  return (
    <section id="skills" className="skills-section">
      <AnimatedSection className="section-header">
        <span className="section-tag">
          <i className="material-icons-round">code</i>
          Expertise
        </span>
        <h2 className="section-title">
          My <span className="gradient-text">Skills</span> & Tech Stack
        </h2>
        <p className="section-subtitle">
          Technologies I work with to bring ideas to life
        </p>
      </AnimatedSection>

      <div className="skills-grid-container">
        {skillCategories.map((category, catIndex) => (
          <AnimatedSection key={catIndex} className="skill-category" delay={catIndex * 150}>
            <h3 className="category-title">
              <i className="material-icons-round">folder</i>
              {category.title}
            </h3>
            <div className="skill-bars">
              {category.skills.map((skill, skillIndex) => (
                <div className="skill-bar-item" key={skillIndex}>
                  <div className="skill-bar-header">
                    <span className="skill-name">{skill.name}</span>
                    <span className="skill-percentage">{skill.level}%</span>
                  </div>
                  <div className="skill-bar-track">
                    <div
                      className="skill-bar-fill"
                      style={{
                        '--fill-width': `${skill.level}%`,
                        '--fill-color': skill.color,
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </AnimatedSection>
        ))}
      </div>

      <AnimatedSection className="tools-section" delay={500}>
        <h3 className="tools-title">
          <i className="material-icons-round">build</i>
          Tools & Platforms
        </h3>
        <div className="tools-grid">
          {tools.map((tool, index) => (
            <div className="tool-card" key={index}>
              <i className={`${tool.iconClass} fa-${tool.iconName}`}></i>
              <span>{tool.name}</span>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </section>
  )
}

// ─── SERVICES ────────────────────────────────────────────────────────────────
function Services() {
  const services = [
    {
      icon: 'computer',
      color: 'var(--purple)',
      bg: 'var(--purple-light)',
      title: 'Web Development',
      description: 'Building responsive, performant, and scalable web applications using modern technologies and best practices.',
      features: ['React / Next.js', 'Node.js Backend', 'API Integration', 'Performance Optimization'],
    },
    {
      icon: 'smartphone',
      color: 'var(--teal)',
      bg: 'var(--teal-light)',
      title: 'Mobile Development',
      description: 'Creating cross-platform mobile applications with native-like performance and excellent user experience.',
      features: ['React Native', 'Flutter Ready', 'App Store Ready', 'Play Store Ready'],
    },
    {
      icon: 'palette',
      color: 'var(--coral)',
      bg: 'var(--coral-light)',
      title: 'UI/UX Design',
      description: 'Designing intuitive interfaces and seamless user experiences that captivate and engage your audience.',
      features: ['Figma Design', 'Prototyping', 'User Research', 'Design Systems'],
    },
    {
      icon: 'cloud',
      color: 'var(--blue)',
      bg: 'var(--blue-light)',
      title: 'Cloud & DevOps',
      description: 'Deploying and managing applications in the cloud with automated workflows and monitoring.',
      features: ['AWS / GCP', 'Docker & K8s', 'CI/CD Pipeline', 'Monitoring'],
    },
  ]

  return (
    <section id="services" className="services-section">
      <AnimatedSection className="section-header">
        <span className="section-tag">
          <i className="material-icons-round">work</i>
          Services
        </span>
        <h2 className="section-title">
          What I <span className="gradient-text">Offer</span>
        </h2>
        <p className="section-subtitle">
          Comprehensive solutions tailored to your business needs
        </p>
      </AnimatedSection>

      <div className="services-grid">
        {services.map((service, index) => (
          <AnimatedSection key={index} className="service-card" delay={index * 100}>
            <div className="service-icon-wrapper" style={{ background: service.bg }}>
              <i className="material-icons-round" style={{ fontSize: '28px', color: service.color }}>{service.icon}</i>
            </div>
            <h3 className="service-title">{service.title}</h3>
            <p className="service-description">{service.description}</p>
            <ul className="service-features">
              {service.features.map((feature, i) => (
                <li key={i}>
                  <i className="material-icons-round" style={{ fontSize: '16px', color: 'var(--teal)' }}>check_circle</i>
                  {feature}
                </li>
              ))}
            </ul>
            <a href="#contact" className="service-link" onClick={(e) => {
              e.preventDefault();
              document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
            }}>
              Get Started <i className="material-icons-round" style={{ fontSize: '16px' }}>arrow_forward</i>
            </a>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

// ─── PORTFOLIO ───────────────────────────────────────────────────────────────
function Portfolio() {
  const projects = [
    {
      category: 'E-Commerce',
      title: 'Modern E-Commerce Platform',
      description: 'Full-featured online marketplace with payment integration, inventory management, and real-time analytics dashboard.',
      tags: ['React', 'Node.js', 'PostgreSQL', 'Stripe'],
      color: 'var(--purple)',
      bg: 'var(--purple-light)',
      iconClass: 'material-icons-round',
      iconName: 'shopping_cart',
      link: '#',
    },
    {
      category: 'SaaS Dashboard',
      title: 'Analytics Dashboard',
      description: 'Business intelligence platform with interactive charts, custom reports, and team collaboration features.',
      tags: ['Next.js', 'D3.js', 'AWS', 'GraphQL'],
      color: 'var(--teal)',
      bg: 'var(--teal-light)',
      iconClass: 'material-icons-round',
      iconName: 'analytics',
      link: '#',
    },
    {
      category: 'Mobile App',
      title: 'Health & Fitness App',
      description: 'Cross-platform mobile application for workout tracking, meal planning, and progress monitoring.',
      tags: ['React Native', 'Firebase', 'Node.js'],
      color: 'var(--coral)',
      bg: 'var(--coral-light)',
      iconClass: 'material-icons-round',
      iconName: 'fitness_center',
      link: '#',
    },
    {
      category: 'Web Application',
      title: 'Project Management Tool',
      description: 'Collaborative project management platform with Kanban boards, team chat, and time tracking.',
      tags: ['Vue.js', 'Python', 'MongoDB', 'WebSocket'],
      color: 'var(--blue)',
      bg: 'var(--blue-light)',
      iconClass: 'material-icons-round',
      iconName: 'task_alt',
      link: '#',
    },
    {
      category: 'Landing Page',
      title: 'Startup Landing Page',
      description: 'High-converting landing page with modern design, animations, and SEO optimization.',
      tags: ['Next.js', 'Tailwind', 'Framer Motion'],
      color: 'var(--purple)',
      bg: 'var(--purple-light)',
      iconClass: 'material-icons-round',
      iconName: 'rocket_launch',
      link: '#',
    },
    {
      category: 'API Service',
      title: 'Payment Gateway Integration',
      description: 'Secure payment processing API with multiple provider support and fraud detection.',
      tags: ['Node.js', 'Redis', 'Docker', 'Stripe'],
      color: 'var(--coral)',
      bg: 'var(--coral-light)',
      iconClass: 'material-icons-round',
      iconName: 'security',
      link: '#',
    },
  ]

  return (
    <section id="portfolio" className="portfolio-section">
      <AnimatedSection className="section-header">
        <span className="section-tag">
          <i className="material-icons-round">grid_view</i>
          Portfolio
        </span>
        <h2 className="section-title">
          Featured <span className="gradient-text">Projects</span>
        </h2>
        <p className="section-subtitle">
          A selection of my recent work and personal projects
        </p>
      </AnimatedSection>

      <div className="portfolio-grid">
        {projects.map((project, index) => (
          <AnimatedSection key={index} className="portfolio-card" delay={index * 100}>
            <div className="portfolio-image" style={{ background: project.bg }}>
              <i className={project.iconClass} style={{ fontSize: '64px', color: project.color }}>{project.iconName}</i>
              <div className="portfolio-overlay">
                <a href={project.link} className="portfolio-link">
                  <i className="material-icons-round" style={{ fontSize: '16px' }}>open_in_new</i>
                </a>
              </div>
            </div>
            <div className="portfolio-content">
              <span className="portfolio-category" style={{ color: project.color }}>
                {project.category}
              </span>
              <h3 className="portfolio-title">{project.title}</h3>
              <p className="portfolio-description">{project.description}</p>
              <div className="portfolio-tags">
                {project.tags.map((tag, i) => (
                  <span key={i} className="portfolio-tag">{tag}</span>
                ))}
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

// ─── TESTIMONIALS ───────────────────────────────────────────────────────────
function Testimonials() {
  const testimonials = [
    {
      name: 'Ahmad Wijaya',
      role: 'CEO, TechStart Indonesia',
      avatarClass: 'fas',
      avatarName: 'user-tie',
      text: 'Exceptional developer! Delivered our project ahead of schedule with outstanding quality. Highly recommended for any web development needs.',
      rating: 5,
    },
    {
      name: 'Sarah Putri',
      role: 'Product Manager, Digital Solutions',
      avatarClass: 'fas',
      avatarName: 'user-tie',
      text: 'Professional, communicative, and technically skilled. The best freelancer we have worked with. Will definitely hire again!',
      rating: 5,
    },
    {
      name: 'Budi Santoso',
      role: 'CTO, Innovate Labs',
      avatarClass: 'fas',
      avatarName: 'user-ninja',
      text: 'Impressive attention to detail and code quality. Our application runs smoothly and scales perfectly. Great partnership!',
      rating: 5,
    },
  ]

  return (
    <section className="testimonials-section">
      <AnimatedSection className="section-header">
        <span className="section-tag">
          <i className="material-icons-round">format_quote</i>
          Testimonials
        </span>
        <h2 className="section-title">
          What People <span className="gradient-text">Say About Me</span>
        </h2>
      </AnimatedSection>

      <div className="testimonials-grid">
        {testimonials.map((testimonial, index) => (
          <AnimatedSection key={index} className="testimonial-card" delay={index * 150}>
            <div className="testimonial-rating">
              {Array.from({ length: testimonial.rating }).map((_, i) => (
                <i key={i} className="material-icons-round" style={{ fontSize: '16px', color: '#FFB800' }}>star</i>
              ))}
            </div>
            <p className="testimonial-text">"{testimonial.text}"</p>
            <div className="testimonial-author">
              <div className="author-avatar">
                <i className={`${testimonial.avatarClass} fa-${testimonial.avatarName}`}></i>
              </div>
              <div className="author-info">
                <span className="author-name">{testimonial.name}</span>
                <span className="author-role">{testimonial.role}</span>
              </div>
            </div>
          </AnimatedSection>
        ))}
      </div>
    </section>
  )
}

// ─── CONTACT ─────────────────────────────────────────────────────────────────
function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    budget: '',
    message: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    setIsSubmitting(false)
    setSubmitted(true)
    setTimeout(() => {
      setFormData({ name: '', email: '', subject: '', budget: '', message: '' })
      setSubmitted(false)
    }, 3000)
  }

  const contactInfo = [
    {
      iconClass: 'fas',
      iconName: 'envelope',
      label: 'Email',
      value: 'hello@portfolio.dev',
      link: 'mochbagjafadhillah@gmail.com',
      color: 'var(--purple)',
      bg: 'var(--purple-light)',
    },
    {
      iconClass: 'fab',
      iconName: 'whatsapp',
      label: 'WhatsApp',
      value: '+62 812 3456 7890',
      link: 'https://wa.me/62581234567890',
      color: 'var(--teal)',
      bg: 'var(--teal-light)',
    },
    {
      iconClass: 'fab',
      iconName: 'github',
      label: 'GitHub',
      value: 'github.com/bakjah',
      link: 'https://github.com',
      color: 'var(--text)',
      bg: 'var(--surface)',
    },
    {
      iconClass: 'fab',
      iconName: 'linkedin-in',
      label: 'LinkedIn',
      value: 'linkedin.com/in/mochbagjafadillah',
      link: 'https://linkedin.com',
      color: 'var(--blue)',
      bg: 'var(--blue-light)',
    },
    {
      iconClass: 'fas',
      iconName: 'location-dot',
      label: 'Location',
      value: 'Bandung, West Java, Indonesia',
      link: null,
      color: 'var(--coral)',
      bg: 'var(--coral-light)',
    },
  ]

  return (
    <section id="contact" className="contact-section">
      <AnimatedSection className="section-header">
        <span className="section-tag">
          <i className="material-icons-round">send</i>
          Contact
        </span>
        <h2 className="section-title">
          Let's Work <span className="gradient-text">Together</span>
        </h2>
        <p className="section-subtitle">
          Have a project in mind? Let's discuss how I can help bring your ideas to life.
        </p>
      </AnimatedSection>

      <div className="contact-container">
        <AnimatedSection className="contact-info-section" delay={100}>
          <h3>Get in Touch</h3>
          <p className="contact-intro">
            I'm always excited to take on new challenges and create amazing digital experiences.
            Whether you need a full-scale application or want to improve your existing product,
            I'm here to help.
          </p>
          <div className="contact-list">
            {contactInfo.map((info, index) => (
              <div key={index} className="contact-item">
                <div className="contact-icon" style={{ background: info.bg }}>
                  <i className={`${info.iconClass} fa-${info.iconName}`} style={{ fontSize: '22px', color: info.color }}></i>
                </div>
                <div className="contact-details">
                  <span className="contact-label">{info.label}</span>
                  {info.link ? (
                    <a href={info.link} className="contact-value" target="_blank" rel="noopener noreferrer">
                      {info.value}
                    </a>
                  ) : (
                    <span className="contact-value">{info.value}</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </AnimatedSection>

        <AnimatedSection className="contact-form-section" delay={200}>
          <form className="contact-form" onSubmit={handleSubmit}>
            {submitted ? (
              <div className="form-success">
                <i className="material-icons-round" style={{ fontSize: '64px', color: 'var(--teal)' }}>check_circle</i>
                <h3>Message Sent!</h3>
                <p>Thank you for reaching out. I'll get back to you within 24 hours.</p>
              </div>
            ) : (
              <>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="name">Your Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder="John Doe"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="email">Email Address</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label htmlFor="subject">Subject</label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Project Inquiry"
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="budget">Budget Range</label>
                    <select
                      id="budget"
                      name="budget"
                      value={formData.budget}
                      onChange={handleChange}
                    >
                      <option value="">Select budget</option>
                      <option value="500-1000">$500 - $1,000</option>
                      <option value="1000-5000">$1,000 - $5,000</option>
                      <option value="5000-10000">$5,000 - $10,000</option>
                      <option value="10000+">$10,000+</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label htmlFor="message">Project Details</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell me about your project, goals, and timeline..."
                    required
                  ></textarea>
                </div>
                <button type="submit" className="btn-primary submit-btn" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <span className="spinner"></span>
                      Sending...
                    </>
                  ) : (
                    <>
                      <i className="material-icons-round">send</i>
                      Send Message
                    </>
                  )}
                </button>
              </>
            )}
          </form>
        </AnimatedSection>
      </div>
    </section>
  )
}

// ─── FOOTER ──────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-brand">
          <span className="logo-bracket">{"<"}</span>
          <span className="logo-text">mochbagja_fad</span>
          <span className="logo-bracket">{"/>"}</span>
          <p>Crafting digital experiences with passion and precision.</p>
        </div>

        <div className="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><a href="#about"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> About</a></li>
            <li><a href="#skills"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> Skills</a></li>
            <li><a href="#portfolio"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> Portfolio</a></li>
            <li><a href="#services"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> Services</a></li>
            <li><a href="#contact"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> Contact</a></li>
          </ul>
        </div>

        <div className="footer-links">
          <h4>Services</h4>
          <ul>
            <li><a href="#services"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> Web Development</a></li>
            <li><a href="#services"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> Mobile Apps</a></li>
            <li><a href="#services"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> UI/UX Design</a></li>
            <li><a href="#services"><i className="material-icons-round" style={{ fontSize: '12px' }}>chevron_right</i> Consulting</a></li>
          </ul>
        </div>

        <div className="footer-social">
          <h4>Follow Me</h4>
          <div className="social-icons">
            <a href="#" aria-label="GitHub"><i className="fab fa-github"></i></a>
            <a href="#" aria-label="LinkedIn"><i className="fab fa-linkedin-in"></i></a>
            <a href="#" aria-label="Twitter"><i className="fab fa-x-twitter"></i></a>
            <a href="#" aria-label="Dribbble"><i className="fab fa-dribbble"></i></a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 DevPortfolio. All rights reserved.</p>
        <p>
          Made with <span><i className="material-icons-round" style={{ fontSize: '14px', color: 'var(--coral)' }}>favorite</i></span> in Indonesia
        </p>
      </div>
    </footer>
  )
}

// ─── APP ─────────────────────────────────────────────────────────────────────
function AppContent() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Skills />
      <Services />
      <Portfolio />
      <Testimonials />
      <Contact />
      <Footer />
    </>
  )
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  )
}

export default App
