import React, { useMemo, useState } from 'react';
import './projects.css';

/**
 * ProjectsApp — modern, filterable project showcase (responsive)
 * - Search box and tag filters
 * - Responsive card grid
 * - Optional project images with lazy-loading and a graceful fallback
 * - Action buttons: Live Demo / View Code
 */
export default function ProjectsApp() {
  const allProjects = useMemo(() => [
    {
      title: 'AI Anomaly Detector',
      blurb:
        'Real-time anomaly detection pipeline using isolation forests with a streaming ingestion layer.',
      tags: ['AI/ML', 'Data'],
      code: 'https://github.com/Sevinda-Herath', // TODO: set repo link
      demo: undefined, // Optional live link
      image: 'https://via.placeholder.com/800x450.png?text=AI+Anomaly+Detector', // Optional image
      imageAlt: 'Dashboard view of anomaly detector',
    },
    {
      title: 'Secure Auth Gateway',
      blurb:
        'Lightweight OAuth2/OpenID Connect proxy with JWT validation and rate limiting.',
      tags: ['Security', 'Web'],
      code: 'https://github.com/Sevinda-Herath', // TODO: set repo link
      demo: undefined,
      // image intentionally omitted to demonstrate fallback thumbnail
    },
    {
      title: 'Portfolio (This Site)',
      blurb:
        'Vite + React app simulating a Linux boot/login/desktop UX with windowed apps.',
      tags: ['Web', 'UI'],
      code: 'https://github.com/Sevinda-Herath/portfolio-new',
      demo: 'https://sevinda-herath.github.io/portfolio-new/',
      image: 'https://via.placeholder.com/800x450.png?text=Portfolio+UI',
      imageAlt: 'Portfolio desktop screenshot',
    },
    {
      title: 'Threat Intel Dashboard',
      blurb:
        'Aggregates feeds, de-duplicates indicators, and surfaces trends with simple scoring.',
      tags: ['Security', 'Data', 'Web'],
      code: 'https://github.com/Sevinda-Herath', // TODO: set repo link
      demo: undefined,
      image: 'https://via.placeholder.com/800x450.png?text=Threat+Intel+Dashboard',
      imageAlt: 'Threat intelligence dashboard overview',
    },
  ], []);

  const allTags = useMemo(() => {
    const s = new Set(['All']);
    allProjects.forEach(p => p.tags.forEach(t => s.add(t)));
    return Array.from(s);
  }, [allProjects]);

  const [query, setQuery] = useState('');
  const [activeTag, setActiveTag] = useState('All');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allProjects.filter(p => {
      const matchesTag = activeTag === 'All' || p.tags.includes(activeTag);
      const matchesQuery = !q ||
        p.title.toLowerCase().includes(q) ||
        p.blurb.toLowerCase().includes(q) ||
        p.tags.some(t => t.toLowerCase().includes(q));
      return matchesTag && matchesQuery;
    });
  }, [allProjects, query, activeTag]);

  return (
    <div className="projects-app" role="region" aria-label="Projects">
      <header className="proj-header">
        <h2 className="title">Projects</h2>
        <p className="subtitle">Search and filter to explore selected work.</p>
      </header>

      <div className="controls" role="search">
        <div className="search">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, tag, or description..."
            aria-label="Search projects"
          />
        </div>
        <div className="tags" role="tablist" aria-label="Filter by tag">
          {allTags.map((tag) => (
            <button
              key={tag}
              role="tab"
              aria-selected={activeTag === tag}
              className={`chip${activeTag === tag ? ' active' : ''}`}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>

      <div className="grid" aria-live="polite">
        {filtered.length === 0 ? (
          <div className="empty">No projects match your search.</div>
        ) : (
          filtered.map((p, i) => (
            <article key={i} className="card" aria-labelledby={`p-title-${i}`}>
              {p.image ? (
                <div className="card-thumb">
                  <img src={p.image} alt={p.imageAlt || `${p.title} cover`} loading="lazy" />
                </div>
              ) : (
                <div className="card-thumb fallback" aria-hidden>
                  <span className="thumb-icon" aria-hidden>🧩</span>
                </div>
              )}
              <div className="card-body">
                <h3 id={`p-title-${i}`} className="card-title">{p.title}</h3>
                <p className="card-blurb">{p.blurb}</p>
                <div className="tags-row">
                  {p.tags.map((t) => (
                    <span key={t} className="tag" aria-label={`Tag ${t}`}>{t}</span>
                  ))}
                </div>
              </div>
              <div className="card-actions">
                {p.demo && (
                  <a className="btn primary" href={p.demo} target="_blank" rel="noreferrer" aria-label={`Open live demo of ${p.title}`}>
                    Live Demo
                  </a>
                )}
                {p.code && (
                  <a className="btn" href={p.code} target="_blank" rel="noreferrer" aria-label={`View code of ${p.title}`}>
                    View Code
                  </a>
                )}
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}
