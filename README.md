## AI Productivity Assistant — README

### Setup & Run
- Prereqs: Node 22.12+ (or 20.19+), MongoDB (local or Atlas)
- Backend
  - Create backend/.env:
    - PORT=5000
    - MONGODB_URI=mongodb://localhost:27017/ai-assistant (or your Atlas URI)
    - JWT_SECRET=replace-with-strong-secret
    - JWT_EXPIRE=30d
  - Run:
    - cd backend
    - npm install
    - npm start
- Frontend
  - cd ai-assistant-frontend
  - npm install
  - npm run dev
  - Open printed localhost URL and hard-refresh (Ctrl+F5)

### Sections Implemented
- Navbar/Header: Logo, smooth-scroll links, CTA, dark mode toggle (persistent)
- Hero: Headline, subheadline, CTAs, illustration
- Features: 6 cards with icons
- How It Works: 4-step flow with visuals
- Pricing: Free, Pro (highlighted), Enterprise
- Testimonials: 3 testimonials (name, role, photo)
- FAQ: 4-question accordion
- Newsletter: Email + Subscribe button
- CTA Strip: Bold message + button
- Footer: About, Careers, Contact, Privacy, Terms anchors; socials open in new tabs

### Assumptions & Trade-offs
- Tailwind v3 used for stability with current PostCSS/Vite; no heavy UI kit
- Placeholder images/avatars used (easy to replace)
- Newsletter submit is a no-op placeholder (wire to email service as needed)
- Minimal backend content endpoint (/api/site/content) for bonus; primary focus on UX
- JWT in localStorage for simplicity (acceptable for SPA demo; rotate/secure in prod)
- Smooth scroll via anchor links; section offsets handled via scroll-mt

### Time Spent
- Planning and component structure: ~3–4 hours
- Implementing sections and styles: ~1–2 days
- Dark mode + animations + polish: ~3–4 hours
- Backend auth wiring + MongoDB + testing: ~2–3 hours
- Docs, fixes, and troubleshooting: ~1–2 hours

### What I’d Improve With More Time
- Persist theme server-side (user preference) and add profile settings
- Replace placeholders with branded assets; add SEO meta/OG tags
- Add integration for newsletter (Mailchimp/Brevo) and form validation schema
- Add unit/e2e tests (nav, accordion, auth flow) and CI
- Performance pass (image optimization, code-splitting) and full a11y audit (ARIA details)
- One-click deploy (Vercel/Netlify) and environment setup scripts

  -Create a small backend to serve FAQ and pricing data dynamically.
