# Next.js Fullstack Template

A complete starter template for building modern web applications with Next.js.

## Tech Stack

- **Framework**: [Next.js](https://nextjs.org/) (React framework for frontend and backend)
- **Database**: [NeonDB](https://neon.tech/) (Serverless PostgreSQL) with [Prisma](https://www.prisma.io/) ORM
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) + [Radix UI](https://www.radix-ui.com/) components
- **Authentication**: [NextAuth.js](https://next-auth.js.org/) with GitHub OAuth, Google OAuth, and email/password
- **AI Integration**: [OpenAI API](https://platform.openai.com/)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or newer)
- [npm](https://www.npmjs.com/) (v8 or newer)
- A NeonDB account for PostgreSQL database
- GitHub OAuth credentials (optional)
- Google OAuth credentials (optional)
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
   Then edit the `.env` file and replace the placeholder values with your actual credentials.

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

- **Authentication**: Sign in with GitHub, Google, or email/password
- **Database**: PostgreSQL with Prisma ORM
- **UI Components**: Styled with Tailwind CSS and Radix UI
- **API Routes**: Next.js API routes for backend functionality
- **OpenAI Integration**: Ready-to-use API route for OpenAI requests
- **TypeScript**: Static type checking for improved developer experience and code quality

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

# Google OAuth
GOOGLE_ID="your-google-client-id"
GOOGLE_SECRET="your-google-client-secret"

# OpenAI API
OPENAI_API_KEY="your-openai-api-key"
```

### Setting up OAuth Providers

#### GitHub OAuth
1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click on "New OAuth App"
3. Fill in the application details:
   - Application name: Your app name
   - Homepage URL: `http://localhost:3000` (or your production URL)
   - Authorization callback URL: `http://localhost:3000/api/auth/callback/github`
4. Click "Register application"
5. Copy the Client ID and generate a new Client Secret
6. Add these to your `.env` file as `GITHUB_ID` and `GITHUB_SECRET`

#### Google OAuth
1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to "APIs & Services" > "Credentials"
4. Click "Create Credentials" > "OAuth client ID"
5. Select "Web application" as the application type
6. Add authorized JavaScript origins: `http://localhost:3000` (or your production URL)
7. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`
8. Click "Create"
9. Copy the Client ID and Client Secret
10. Add these to your `.env` file as `GOOGLE_ID` and `GOOGLE_SECRET`

## Deployment

This template can be easily deployed to Vercel:

```bash
npm install -g vercel
vercel
```

## License

This project is licensed under the MIT License.

## Running Multiple Next.js Applications Simultaneously

If you're working on multiple Next.js projects and need to run them on different ports, follow these steps:

### Changing the Default Port

1. **Modify the development script in package.json**
   ```bash
   # Change this line in package.json
   "dev": "next dev -p 3001"  # Replace 3001 with your desired port
   ```

2. **Update environment variables**
   - In your `.env` file, update `NEXTAUTH_URL` to match your custom port:
   ```
   NEXTAUTH_URL="http://localhost:3001"  # Replace 3001 with your chosen port
   ```

3. **Configure OAuth providers (if used)**
   - Update OAuth application settings (e.g., GitHub, Google) with the custom port:
     - Homepage URL: `http://localhost:3001`
     - Authorization callback URL: `http://localhost:3001/api/auth/callback/[provider]`
   - Ensure URLs use HTTP, not HTTPS, for local development to avoid certificate errors

4. **Run database migrations (if using Prisma)**
   ```bash
   npx prisma db push
   ```

5. **Start the application**
   ```bash
   npm run dev  # Uses the port specified in package.json
   # OR
   npx next dev -p 3001  # Directly specify the port
   ```

6. **Troubleshooting**
   - If you encounter authentication errors, try clearing your browser cookies for localhost
   - If a port is already in use, you can kill the process using:
     ```bash
     # On macOS/Linux:
     lsof -i :3001 -t | xargs kill
     # On Windows:
     netstat -ano | findstr :3001
     taskkill /PID [PID] /F
     ```
