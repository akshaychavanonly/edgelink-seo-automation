# Edgelink SEO Automation Dashboard

Full-stack SEO auditing platform developed for the Edgelink Technology AI Developer & Automation Engineer technical assessment.

## Overview

The application automates website SEO auditing through a Node.js background worker, external SEO data integrations, an AI analysis engine, and downloadable PDF reports.

It includes separate administrative and client dashboards, automated monthly audit scheduling, role-based authentication, and mock WhatsApp and email notifications.

## Technology Stack

- Frontend: Next.js 14, React, Tailwind CSS
- Backend: Node.js and Next.js Route Handlers
- Database: Neon PostgreSQL with Prisma ORM
- Job Queue: BullMQ with Upstash Redis
- Website Crawling: Fetch and Cheerio
- AI Engine: Anthropic Claude API with mock mode
- PDF Reports: Puppeteer
- Authentication: NextAuth.js
- Validation: Zod
- Scheduling: External cron HTTP endpoint

## Architecture

```text
Admin Dashboard
      |
      v
Next.js API
      |
      v
Neon PostgreSQL + BullMQ Queue
                      |
                      v
                Node.js Worker
                      |
                      v
              Website SEO Crawler
                      |
                      v
          External SEO Mock Integrations
                      |
                      v
             Claude AI Analysis
                      |
                      v
             PostgreSQL Results
                      |
                      v
              Puppeteer PDF
                      |
                      v
          Mock WhatsApp + Email
```

## Features

- Admin and client dashboards
- Role-based authentication
- Manual SEO audit triggering
- Monthly automated audit scheduling
- Live audit progress tracking
- SEO analysis and prioritized recommendations
- Historical audit reports
- Downloadable PDF reports
- Mock external SEO integrations
- Mock notification delivery

## Prerequisites

- Node.js and npm
- Neon PostgreSQL database
- Upstash Redis database with TCP/TLS access
- Optional Anthropic API key for real AI analysis

## Local Installation

Clone the repository:

```bash
git clone YOUR_REPOSITORY_URL
cd edgelink
npm install
```

Copy `.env.example` to `.env` and supply your own database connection, Redis connection, and authentication secrets.

Generate Prisma Client:

```bash
npx prisma generate --config prisma7.config.ts
```

Apply database migrations:

```bash
npx prisma migrate deploy --config prisma7.config.ts
```

Seed demonstration users after configuring the environment variables:

```bash
node scripts/seed-users.js
```

Start the application:

```bash
npm run dev
```

Start the worker in a separate terminal:

```bash
node src/workers/audit.worker.js
```

Open:

- Admin: http://localhost:3000/admin
- Client: http://localhost:3000/client
- Login: http://localhost:3000/login

## Mock Configuration

The project uses environment switches:

```env
USE_MOCKS=true
USE_MOCK_AI=true
```

`USE_MOCKS=true` enables the supplied PageSpeed Insights, Google Search Console, and DataForSEO mock datasets.

`USE_MOCK_AI=true` returns a predefined AI audit response without making a paid Claude API call.

To test the real Claude integration, configure `ANTHROPIC_API_KEY` and set `USE_MOCK_AI=false`.

Mock data and simulated recommendations must not be interpreted as verified results for a live website.

## Audit Workflow

1. Admin submits an SEO audit.
2. An audit record is created in PostgreSQL.
3. BullMQ queues the job in Redis.
4. The worker crawls the website.
5. SEO integration data is collected.
6. The AI engine returns structured recommendations.
7. The results are persisted in PostgreSQL.
8. Puppeteer generates the PDF report.
9. Mock WhatsApp and email delivery is recorded.
10. Audit progress reaches 100%.

## Testing

Available local test scripts include:

```bash
node scripts/test-crawler.js
node scripts/test-seo-data.js
node scripts/test-ai.js
node scripts/test-full-audit.js
node scripts/test-cron.js
```

To check the production build:

```bash
npm run build
```

To inspect database records:

```bash
npx prisma studio --config prisma7.config.ts
```

## Scheduling

The `/api/cron` endpoint requires a secret bearer token through `CRON_SECRET`.

The application creates monthly audit records with duplicate prevention.

An external scheduler can invoke this endpoint after deployment. A persistent Node.js worker must remain available to process queued jobs.

## Deployment Notes

The Next.js application can be deployed separately from the BullMQ worker.

The worker requires a compatible long-running Node.js environment.

The current local temporary PDF storage should be replaced with persistent storage for production use.

Review security, deployment compatibility, and the use of mock integrations before enabling public access.

## Assessment Demonstration

The demonstration should show:

1. Admin login
2. Audit submission and BullMQ queueing
3. Worker processing and progress updates
4. AI-generated or explicitly labelled mock JSON
5. Audit records in PostgreSQL
6. Generated PDF download
7. Client dashboard and audit history

## Disclaimer

This project was developed for technical assessment and demonstration purposes. External agency integrations and notification delivery are mocked. Real AI analysis is optional and requires separately configured Anthropic API credentials.
