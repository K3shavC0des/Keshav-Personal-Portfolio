# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Primary: **technical recruiters and hiring managers** screening for SWE/tech internships, arriving from a resume, LinkedIn, or GitHub link, giving the page well under a minute on a first pass.

Secondary, confirmed by the user: **HCI / applied-AI research groups** evaluating STRAIGHT, and **general visitors** — the site doubles as Keshav's personal home on the web.

The job in all three cases is the same: work out quickly who he is and whether he's worth contacting.

## Product Purpose

A personal portfolio for Keshav Kumar. Success is being remembered and being easy to contact — the user explicitly asked to "keep it general for recruiters" rather than funnel toward a single conversion.

## Positioning

Keshav is a **Canadian Recurve National Team archer who builds AI to analyze archery form**. The competitive record and the research are the same subject seen from two sides, and the research is grounded in data from his own sport. No neighboring student portfolio can truthfully copy this pairing.

## Operating Context

Scanned fast, often on a phone, alongside many other candidate sites. Visitors arrive with no prior context about him and no reason to stay.

## Capabilities and Constraints

Confirmed factual record (source: `Technical_Resume.pdf`, 2026-08-09):

**Education** — Queen's University, Kingston ON. Bachelor of Computing (Honours), expected May 2030. Recipient of the Arts and Science Scholarship ($25,000 × 4 years).

**Archery (Archery Canada, 2021–present)** — Canadian Recurve National Team member. Selected 1 of 3 nationally for the 2025 World Archery Youth Championships. Team Bronze, 2024 PanAm Youth Championships. Ranked #1 in Canada (Indoor U18 Recurve, 2024) and #3 in Canada (Outdoor U18 Recurve, 2024 and 2025). Massachusetts Indoor State Champion (2025) and Outdoor JOAD Champion (2024). Bronze, 2025 Lancaster Archery Classic, livestreamed to 66K+ viewers. Maintains a 25+ hour/week training regimen alongside a full course load.

**Coaching (Franklin, MA, July 2025–present)** — Private archery coach, USA Archery certified instructor. Roughly doubled one athlete's outdoor scoring performance; coached a beginner to top-ranked archer in the tri-state region and a bronze medal at nationals, using video analysis and structured training plans. Assistant JOAD Development Coach at XSPOT Archery; trained 5+ archers, taught 10+ introductory lessons.

**STRAIGHT — AI Archery Coaching System (Oct–Dec 2025)** — Python, MMPose, VLM, LLMs. Applied HCI/AI research on improving access to archery coaching. Personalized feedback framework built on 6 pose-based consistency metrics and historical baselines. Co-developed a novel form-segmentation pipeline using pose heuristics and binary-search VLM queries, reaching 98% phase-detection accuracy even at low resolution or with dummy training aids. Feature selection across 100+ pose features from 500+ practice points to identify the top 15 predictive variables. Random-forest shot-phase detection model (scikit-learn) at 87% accuracy within 10 frames. **Submitted as a poster to ACM UIST and CHI — submitted, not accepted. Never describe it as published, accepted, or peer-reviewed.**

**QStudy — study-group matching platform** — Python, Flask, SQLAlchemy, React, JavaScript. Session-based auth, RESTful API, schema for accounts/groups/membership. Deployed across Vercel (frontend) and Render (backend); since moved to Supabase Postgres. Live filtering and search in the UI.

**SwipeHire — resume screening web app** — Flask, SQLite, PyPDF2. Swiping review interface for recruiters, session auth, automated resume-text extraction.

**Technical skills** — Python, SQL, HTML, CSS, JavaScript, Java, C, C#. Flask, React, SQLAlchemy, Unity, MMPose, scikit-learn, matplotlib, PyPDF2. Git/GitHub, SQLite. Certifications: CS50, Microsoft Azure AI Fundamentals (AZ-900), USA Archery instructor certification.

**Unresolved** — the resume states "USA Level 2 Instructor" in the coaching role heading but "USA Archery Level 1 Instructor" under Certifications. The site says "USA Archery certified instructor" until Keshav confirms the level.

## Brand Commitments

Name: Keshav Kumar. Links: `github.com/K3shavC0des`, `linkedin.com/in/k2008`, `keshav.avyukta@gmail.com`.

Assumed (not yet confirmed by the user, flagged on delivery): the phone number on the resume is **omitted** from the public site as a privacy default.

## Evidence on Hand

- **Real pose keypoint data** from Keshav's own shooting: `STRAIGHT2.0/STRAIGHT/smoothed_inference_data/*.json` — 12 clips, MMPose COCO-17, 733 frames in the reference clip.
- **A working motion-sculpture renderer** built from that data: `prototypes/archer-3d.html`, `prototypes/export_poses.py`, published at `claude.ai/code/artifact/5c2cbf1a-ba62-4b61-8854-0ad23a46565d`.
- **QStudy** — live deployed app with source.
- **SwipeHire** — source available.
- Research findings on portfolio design: `research/findings.md`.

**Absences future work must not fabricate:** no testimonials, no employment history, no internship experience, no accepted publication, no press coverage, no client logos, no metrics beyond those listed above.

## Product Principles

1. **The pairing is the pitch.** Elite archer plus the AI that analyzes archery. Neither half alone is distinctive; together they are unrepeatable.
2. **Evidence over adjectives.** He has real numbers, real rankings, and real data. Never reach for "passionate" or "driven" when a fact is available.
3. **Legible in seconds, rewarding for minutes.** A recruiter must get it on a fast scan; a curious visitor should find more underneath.
4. **Claim precisely.** Submitted is not accepted. Co-developed is not solo. The record is strong enough that overstating it only costs credibility.
5. **Ground the work in his own data.** The distinguishing asset is that the research subject and the researcher are the same person.

## Accessibility & Inclusion

No user-specific requirement established. The surface is motion-heavy by design, so `prefers-reduced-motion` must yield a fully legible static version — treated as a correctness requirement, not an enhancement.
