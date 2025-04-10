# Next.js Fullstack Template

A complete starter template for building modern web applications with Next.js.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React framework for frontend and backend)
- **Database**: [NeonDB](https://neon.tech/) (Serverless PostgreSQL) with [Prisma](https://www.prisma.io/) ORM
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) components
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with GitHub OAuth and email/password
- **AI Integration**: [OpenAI API](https://platform.openai.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v8 or newer)
- A NeonDB account for PostgreSQL database
- GitHub OAuth credentials (optional)
- OpenAI API key (optional)

### Setup

1. Clone this repository:
   ```bash
   git clone <repository-url>
   cd nextjs-fullstack-template
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Copy the environment variables file and fill in your values:
   ```bash
   cp .env.example .env
   ```

4. Set up your database:
   - Create a new PostgreSQL database in NeonDB
   - Copy the connection string to your `.env` file as `DATABASE_URL`

5. Generate the Prisma client:
   ```bash
   npx prisma generate
   ```

6. Apply database migrations:
   ```bash
   npx prisma db push
   ```

7. Start the development server:
   ```bash
   npm run dev
   ```

8. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features

- **Authentication**: Sign in with GitHub or email/password
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Styled with Tailwind CSS and Radix UI
- **API Routes**: Next.js API routes for backend functionality
- **OpenAI Integration**: Ready-to-use API route for OpenAI requests

## Environment Variables

Create a `.env` file in the root of the project with the following variables:

```
# Database connection string (NeonDB)
DATABASE_URL="postgresql://user:password@host:port/database"

# Next Auth
NEXTAUTH_SECRET="your-nextauth-secret" # Generate with: openssl rand -base64 32
NEXTAUTH_URL="http://localhost:3000"

# GitHub OAuth
GITHUB_ID="your-github-client-id"
GITHUB_SECRET="your-github-client-secret"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"
```

## Deployment

This template can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

## License

This project is licensed under the MIT License.
