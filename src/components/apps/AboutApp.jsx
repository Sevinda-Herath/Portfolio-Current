import React from 'react';
import './about.css';
import profile from '../../assets/_4775c16e-f537-450b-8e7e-8e1f54a71a26.jpeg';

export default function AboutApp() {
  return (
    <div className="about-app">
      <header className="about-header">
        <h2 className="title">About Me</h2>
        <p className="subtitle">A quick look at who I am and what I do.</p>
      </header>

      <div className="about-grid">
        {/* Profile card */}
        <section className="card profile" aria-labelledby="about-name">
          <div className="profile-hero">
            <div className="portrait">
              <img src={profile} alt="Photo of Sevinda Herath" loading="lazy" />
            </div>
            <div className="identity">
              <h3 id="about-name" className="name">Sevinda Herath</h3>
              <div className="role">Undergraduate — Artificial Intelligence & Cybersecurity</div>
              <div className="meta">Colombo, Western Province, Sri Lanka</div>
            </div>
          </div>
          <p className="blurb">
            I enjoy learning how technology works and finding smart ways to solve problems.
            My interests live where AI and Cybersecurity intersect—building safer and smarter systems.
            I’m open to opportunities, collaborations, and meaningful challenges.
          </p>
        </section>

        {/* Details card */}
        <section className="card details" aria-labelledby="about-overview">
          <h3 id="about-overview" className="section-title">Overview</h3>
          <ul className="list">
            <li>Solid foundation in AI/ML and Cybersecurity.</li>
            <li>Hands-on with modern web tooling (Vite + React) and UI/UX polish.</li>
            <li>Curious problem-solver, quick learner, and team collaborator.</li>
          </ul>

          <h4 className="section-sub">Skills</h4>
          <div className="chips">
            <span className="chip">Python</span>
            <span className="chip">Machine Learning</span>
            <span className="chip">Cybersecurity</span>
            <span className="chip">React</span>
            <span className="chip">Vite</span>
            <span className="chip">JS/TS</span>
          </div>
        </section>
      </div>
    </div>
  );
}
