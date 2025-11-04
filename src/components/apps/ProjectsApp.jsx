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
  // User-provided projects (reworded) with generated thumbnails via BoringAvatar
  const allProjects = useMemo(() => [
    {
      title: 'LSTM-Sentiment-Project---API-Server',
      blurb:
        'End-to-end stock forecasting with LSTM enhanced by sentiment. Ingests price + news/social sentiment, trains models, evaluates, and visualizes predictions.',
      tags: ['AI/ML', 'NLP', 'Time Series'],
      code: 'https://github.com/Sevinda-Herath/LSTM-Sentiment-Project---API-Server',
    },
    {
      title: 'LSTM-Sentiment-Project---ML-Models',
      blurb:
        'LSTM stock price prediction enhanced with sentiment from financial news and social media. Includes preprocessing, training, evaluation metrics, and visualizations across 10 major tech stocks.',
      tags: ['AI/ML', 'NLP', 'Time Series'],
      code: 'https://github.com/Sevinda-Herath/LSTM-Sentiment-Project---ML-Models',
    },
    {
      title: 'LSTM-Sentiment-Project---Website',
      blurb:
        'Web front-end to explore sentiment analysis results and model outputs. A clean UI to interact with the underlying system.',
      tags: ['Web', 'UI'],
      code: 'https://github.com/Sevinda-Herath/LSTM-Sentiment-Project---Website',
    },
    {
      title: 'Portfolio-Old-V1',
      blurb:
        'My first portfolio iteration built with basic HTML, CSS, and JavaScript. A simple static site to showcase early projects.',
      tags: ['Web'],
      code: 'https://github.com/Sevinda-Herath/Portfolio-Old-V1',
      demo: 'https://sevinda-herath.is-a.dev/Portfolio-Old-V1/',
    },
    {
      title: 'Portfolio-Old-V2',
      blurb:
        'Second portfolio version—better structure and styling, still plain HTML/CSS/JS, focused on cleaner presentation.',
      tags: ['Web'],
      code: 'https://github.com/Sevinda-Herath/Portfolio-Old-V2',
      demo: 'https://sevinda-herath.is-a.dev/Portfolio-Old-V2/',
    },
    {
      title: 'Portfolio-Current',
      blurb:
        'This site: a Vite + React desktop-style UX with boot/login animations, windowed apps, and responsive design.',
      tags: ['Web', 'UI'],
      code: 'https://github.com/Sevinda-Herath/portfolio-new',
      demo: 'https://sevinda-herath.is-a.dev',
    },
    {
      title: 'Concrete_Strength_Prediction_AI_Modal',
      blurb:
        'Simple regression model to predict concrete strength from its mixture components. Practical ML for materials engineering.',
      tags: ['AI/ML', 'Engineering'],
      code: 'https://github.com/Sevinda-Herath/Concrete_Strength_Prediction_AI_Model',
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
              {/* Thumbnail removed per request: no images/avatars in project cards */}
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
