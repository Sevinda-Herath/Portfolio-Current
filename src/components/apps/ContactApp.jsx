import React, { useMemo, useState } from 'react';
import './contact.css';
import avatar from '../../assets/white_logo.png';

/**
 * ContactApp — modern contact hub UI
 * - Left: profile card with avatar, name, role, location and short blurb
 * - Right: contact methods as cards (Email, GitHub, LinkedIn) with actions
 *
 * Notes:
 * - Replace the placeholder email/LinkedIn with your real details.
 * - Copy-to-clipboard gracefully handles browser permission errors.
 */
export default function ContactApp() {
  // Centralize contact info for easy editing
  const contact = useMemo(() => ({
    name: 'Sevinda Herath',
    role: 'Undergraduate — AI & Cybersecurity',
    location: 'Colombo, Sri Lanka',
    email: 'info@sevinda-herath.is-a.dev', 
    github: 'https://github.com/Sevinda-Herath',
    linkedin: 'https://linkedin.com/in/sevindaherath',
  }), []);

  const [copied, setCopied] = useState(false);

  const mailtoHref = useMemo(() => {
    const subject = encodeURIComponent('Hello from your portfolio');
    const body = encodeURIComponent("Hi Sevinda,\n\nI saw your portfolio and wanted to reach out...\n\nCheers,\n");
    return `mailto:${contact.email}?subject=${subject}&body=${body}`;
  }, [contact.email]);

  const copyEmail = async () => {
    try {
      await navigator.clipboard?.writeText(contact.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      // Fallback: select + copy via prompt
      window.prompt?.('Copy email address:', contact.email);
    }
  };

  return (
    <div className="contact-app">
      <div className="contact-grid">
        {/* Profile card */}
        <section className="card profile" aria-labelledby="profile-title">
          <div className="profile-head">
            <img src={avatar} alt="Logo" className="avatar" />
            <div className="id-block">
              <h3 id="profile-title" className="title">{contact.name}</h3>
              <div className="subtitle">{contact.role}</div>
              <div className="muted">{contact.location}</div>
            </div>
          </div>
          <p className="blurb">
            I’m passionate about how Artificial Intelligence and Cybersecurity intersect to build
            safer, smarter systems. Open to opportunities, collaborations, and interesting problems.
          </p>
        </section>

        {/* Contact methods */}
        <section className="card methods" aria-labelledby="methods-title">
          <h3 id="methods-title" className="title">Get in touch</h3>

          <div className="method-list">
            {/* Email */}
            <div className="method">
              <div className="method-info">
                <span className="icon" aria-hidden>✉️</span>
                <div className="text">
                  <div className="label">Email</div>
                  <div className="value">{contact.email}</div>
                </div>
              </div>
              <div className="actions">
                <button className="btn ghost" onClick={copyEmail} aria-label="Copy email">
                  {copied ? 'Copied' : 'Copy'}
                </button>
                <a className="btn primary" href={mailtoHref} aria-label="Email me">
                  Send Email
                </a>
              </div>
            </div>

            {/* GitHub */}
            <div className="method">
              <div className="method-info">
                <span className="icon" aria-hidden>🐙</span>
                <div className="text">
                  <div className="label">GitHub</div>
                  <a className="value link" href={contact.github} target="_blank" rel="noreferrer">
                    {contact.github}
                  </a>
                </div>
              </div>
              <div className="actions">
                <a className="btn" href={contact.github} target="_blank" rel="noreferrer" aria-label="Open GitHub">
                  Open
                </a>
              </div>
            </div>

            {/* LinkedIn */}
            <div className="method">
              <div className="method-info">
                <span className="icon" aria-hidden>🔗</span>
                <div className="text">
                  <div className="label">LinkedIn</div>
                  <a className="value link" href={contact.linkedin} target="_blank" rel="noreferrer">
                    {contact.linkedin}
                  </a>
                </div>
              </div>
              <div className="actions">
                <a className="btn" href={contact.linkedin} target="_blank" rel="noreferrer" aria-label="Open LinkedIn">
                  Open
                </a>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
