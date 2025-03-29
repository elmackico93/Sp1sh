Sp1sh – Shell Script Repository PWA

Sp1sh is a Progressive Web App for discovering, sharing, and organizing shell scripts. It provides a curated collection of shell (.sh) and PowerShell (.ps1) scripts for various operating systems (Linux, macOS, Windows) and categories (security, networking, automation, etc.). Sp1sh aims to help developers and IT professionals find ready-to-use scripts and contribute their own, all through a user-friendly web interface that works offline.
Features

    🔍 Powerful Search and Filters: Quickly search through scripts by keywords. Filter results by operating system or category to find relevant scripts fast.

    📂 Categories & Tags: Browse scripts organized in categories like “System Admin”, “DevOps CI/CD”, “Emergency Recovery” and more. Each script is tagged for easy discovery.

    💾 Script Details: Each script has a dedicated page with syntax-highlighted code, description, usage instructions, author info, and related scripts suggestions.

    ➕ Submit Your Scripts: Logged-in users can add new scripts via a guided form with fields for description, code, tags, etc., helping grow the repository.

    👤 User Accounts: Sign up or log in to manage your contributed scripts. (Authentication is currently basic, planned to integrate with a robust auth provider.)

    🌐 PWA Offline Support: Sp1sh is a Progressive Web App – it can be installed on your device and used offline. Frequently accessed pages and scripts are cached, with an offline page available when you have no internet connection.

    🌑 Theming: Includes a “terminal” dark theme for a classic hacker look, and supports system dark/light mode. You can switch the visual theme to your preference.

    🌎 Internationalization: The interface is available in English and Italian (with potential to add more languages).

Technology Stack

Sp1sh is built with a modern web stack:

    Next.js 13 (React 18) – Server-side rendering, static generation, and routing.

    TypeScript – Static typing for reliability and developer ease.

    Tailwind CSS 3 – Utility-first CSS framework for responsive design and theming.

    Radix UI – Headless accessible components (used for menus, dialogs, tabs).

    Framer Motion – Animations and transitions in the interface.

    Next PWA – Custom service worker and Web App Manifest for offline support.

    Prism.js + react-syntax-highlighter – Code highlighting for script content.

    SWR (React Hooks) – Data fetching library (to be used for loading scripts from an API in future).

    Node.js – Backend runtime for Next.js server (if deploying on custom server).

Project Structure

sp1sh-next/
├── pages/              # Next.js pages (routing)
│   ├── index.tsx       # Home page (search and feed)
│   ├── search.tsx      # Search results page
│   ├── add-script.tsx  # Script submission form
│   ├── signin.tsx      # Sign-in page
│   ├── signup.tsx      # Sign-up page
│   ├── offline.tsx     # Offline fallback page
│   ├── scripts/        # Dynamic routes for script details
│   │   └── [id].tsx    # Script detail page (SSG with revalidation)
│   ├── categories/     # Category listing pages
│   │   ├── index.tsx   # All categories overview
│   │   ├── [category].tsx    # Specific category page
│   │   └── [...slug].tsx     # Nested category route (for subcategories)
│   └── _app.tsx, _document.tsx  # Custom App and Document (global providers, HTML structure)
├── components/         # Reusable UI components
│   ├── layout/         # Layout skeleton (Navbar, Footer, Layout wrapper)
│   ├── home/           # Components for home page sections (Hero, FeaturedScript, TrendingTable, etc.)
│   ├── search/         # Components for search and results (SearchResults, etc.)
│   ├── scripts/        # Components for script detail (ScriptCode, ScriptTags, DownloadModal, etc.)
│   ├── forms/          # Components for the add script form (ScriptCodeEditor, form fields)
│   └── auth/           # Components for login/signup (Terminal-themed UI)
├── context/            # React Context providers for global state
│   ├── ScriptsContext.tsx     # Manages script list, filters, search term, etc.
│   └── NavigationContext.tsx  # Manages category navigation structure and breadcrumbs
├── hooks/              # Custom React hooks
├── utils/              # Utility functions (search filtering, dynamic imports, rendering strategies)
├── public/             # Public assets and PWA files
│   ├── site.webmanifest      # PWA manifest (name, icons, theme color)
│   ├── sw.js                 # Service Worker for offline caching
│   ├── favicon.ico/.png/.svg # Icons
│   └── assets/logo.svg       # Project logo
├── styles/             # Global styles and Tailwind CSS
│   ├── globals.css           # Global CSS imports (Tailwind base, etc.)
│   └── terminal-theme.css    # Additional theming styles for terminal look
├── package.json        # Project meta and dependencies
└── tailwind.config.js  # Tailwind configuration (theme colors, dark mode)

Installation
Prerequisites

    Node.js v18+ and npm v9+ are recommended (Next.js 13 requires Node 16.8 or higher).

    (Optional) Git to clone the repository.

Setup Steps

    Clone the repository:

git clone https://github.com/YourUsername/sp1sh-next.git
cd sp1sh-next

Install dependencies:

    npm install
    # or use yarn
    # yarn install

    This will fetch all required npm packages as listed in package.json.

    Configure environment (if needed):

    Sp1sh does not require any secret environment variables for the basic setup. Default configuration is used for demo purposes (it uses mock data and offline capabilities).

    However, if you plan to connect a database or external APIs for scripts, you might need to set up environment variables (e.g. database URL). In that case, create a .env.local file and add the needed configs.

    Run database migrations/seed (if applicable):

    (Not applicable in the current version as it uses in-memory mock data. Skip this step.)
    In future, if the project integrates a database, you would run migrations here (for example, with Prisma or other ORM migrations).

Usage
Development Server

During development, use the Next.js dev server with hot reload:

npm run dev

This starts the app locally at http://localhost:3000. The server will reload on code changes and display errors in the console and browser.

While running in dev:

    PWA Service Worker is usually disabled or in debug mode (to avoid caching issues during development).

    You can access the application in a browser and play with features (search, browse, etc.). The console will log performance metrics (First Contentful Paint, etc.) due to development settings.

Building for Production

To create an optimized production build:

npm run build

This will:

    Lint and type-check the code.

    Compile and bundle the Next.js application for production, including minification and code splitting.

    Generate static files for pages that can be prerendered (with Next.js static generation).

After a successful build, start the production server:

npm start

By default, this will run the app on port 3000 in production mode. You can test the PWA functionality now:

    Visit http://localhost:3000 (ensure you use HTTPS if testing service worker locally – or use a tool like npm run dev with next-pwa if configured).

    The service worker (/sw.js) should register and cache assets. Try switching off internet to see the offline page and cached content.

Deployment

Sp1sh can be deployed on any platform that supports Node.js. Common methods:

    Vercel: (Recommended) Deploy directly with Vercel for optimal Next.js support. Just connect the GitHub repo to Vercel, and it will handle build & deploy (including environment variables and automatic SSL).

    Static Export: (Not fully static due to dynamic routes; using Next.js server is preferred.)

    Custom Server: You can deploy the Node server (after npm run build) on services like Heroku, AWS EC2, etc. Ensure to serve over HTTPS to enable PWA features fully.

After deployment, verify:

    The app is accessible via HTTPS.

    The service worker is functioning (check in devtools Application tab).

    SEO tags (if any) are correct for better discovery.

Scripts and Commands

Besides dev, build, and start, the project has a few other useful npm scripts:

    npm run lint – Runs ESLint to analyze code for issues and enforce style rules.

    npm run format – (If configured with Prettier) Formats the code according to the style guidelines.

    npm run analyze – (If configured) Launches Next.js Bundle Analyzer to inspect bundle size.

    npm run test – (If tests are added) Executes the test suite.

(Note: Currently, the project does not include automated tests. Tests can be added using Jest/React Testing Library or Cypress for end-to-end testing.)
Contributing

Contributions are welcome! If you’d like to report a bug or request a feature, please open an issue. For code contributions:

    Fork the repository and create a new branch for your feature/bugfix.

    Commit your changes with clear descriptions.

    Ensure the app builds and runs without errors (npm run lint and ideally add tests for new functionality).

    Submit a Pull Request to the main repository.

Please follow the existing code style and include relevant documentation or comments for new code. All contributions will be reviewed by maintainers.
