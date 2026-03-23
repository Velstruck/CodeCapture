# CodeCapture

CodeCapture is your personal, AI-enhanced Stack Overflow. It is a full-stack, production-ready code snippet manager that allows developers to precisely store, search, improve, and understand their reusable code. 

## Features

- **Authentication & Secure Storage**: Powered by InsForge for secure OTP authentication, PostgreSQL storage with Row-Level Security, and file attachments up to 5MB.
- **AI-Powered Insights**: Integrates directly with OpenAI models via InsForge AI to summarize, explain, and suggest refactors for your snippets with a click of a button.
- **Modern UI**: Built with Next.js 15 App Router, React, Tailwind CSS v4, and Shadcn UI components in a sleek dark mode.
- **Rich Dashboard**: Filter snippets dynamically by tags or search queries.
- **Markdown Rendering**: AI responses and code snippets are clean, readable, and beautifully formatted via `react-markdown`.

## Tech Stack

- **Frontend**: Next.js (App Router), React, Tailwind CSS, Shadcn UI
- **Backend & BaaS**: [InsForge](https://insforge.dev)
- **Database**: PostgreSQL (via InsForge)
- **AI Integration**: InsForge AI capabilities (OpenAI `gpt-4o-mini`)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Velstruck/CodeCapture.git
   cd CodeCapture
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   You will need to configure your InsForge credentials in `.env.local`:
   ```env
   NEXT_PUBLIC_INSFORGE_URL=your-insforge-project-url
   NEXT_PUBLIC_INSFORGE_ANON_KEY=your-insforge-anon-key
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.
