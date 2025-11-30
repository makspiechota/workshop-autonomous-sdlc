# Workshop: Autonomous SDLC Prototype

This is the starter project for the **"Build Your Software Factory Prototype"** workshop.

## What You'll Build

A fully autonomous software development workflow where AI agents:
1. Plan feature implementation
2. Write the code
3. Create tests
4. Generate pull requests
5. Merge after tests pass
6. Deploy to production (GitHub Pages)

**All automatically!**

## Prerequisites

- Node.js 18+
- GitHub CLI (`gh`) installed and authenticated
- Claude Code or Cline installed in VS Code
- GitHub account

## Quick Start

### 1. Fork this repository

Click the **Fork** button on GitHub to create your own copy.

### 2. Clone your fork

```bash
git clone https://github.com/YOUR-USERNAME/workshop-autonomous-sdlc.git
cd workshop-autonomous-sdlc
```

### 3. Install dependencies

```bash
npm install
```

### 4. Run development server

```bash
npm run dev
```

Open http://localhost:5173 to see the app running.

### 5. Run tests

```bash
npm test
```

## Project Structure

```
workshop-autonomous-sdlc/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions workflow (auto-deploy)
├── src/
│   ├── components/             # React components
│   ├── test/
│   │   └── setup.js           # Test configuration
│   ├── App.jsx                # Main app component
│   ├── App.test.jsx           # Tests for App
│   └── main.jsx               # Entry point
├── public/                     # Static assets
├── package.json               # Dependencies and scripts
├── vite.config.js             # Vite configuration (with GitHub Pages support)
└── README.md                  # This file
```

## Available Scripts

- `npm run dev` - Start development server
- `npm test` - Run tests
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## GitHub Actions Workflow

The `.github/workflows/deploy.yml` file configures automatic deployment:

1. **On Pull Request:** Runs tests
2. **On Merge to Main:** Runs tests + deploys to GitHub Pages

### Enable GitHub Pages

1. Push this repository to GitHub
2. Go to repository Settings → Pages
3. Source: **GitHub Actions** (should be selected automatically)
4. Your site will be available at: `https://YOUR-USERNAME.github.io/workshop-autonomous-sdlc/`

## Workshop Exercises

During the workshop, you'll use AI agents to:

### Day 1
- **Exercise 1:** Add a new component (Header)
- **Exercise 2:** Implement a contact form
- **Exercise 3:** Multi-file refactoring (rename components)

### Day 2
- **Exercise 4:** Create PR autonomously with `gh pr create`
- **Exercise 5:** Merge PR autonomously with `gh pr merge --auto`
- **Exercise 6:** Deploy to production (automatic via GitHub Actions)

## Autonomous Workflow Example

```bash
# 1. AI plans the feature
# (Claude Code or Cline analyzes requirements)

# 2. AI implements the feature
# (Creates/modifies files)

# 3. AI creates tests
# (Adds test files)

# 4. Run tests locally
npm test

# 5. AI creates PR
gh pr create --title "Add contact form" --body "Implements contact form with validation"

# 6. GitHub Actions runs tests automatically

# 7. AI merges PR (if tests pass)
gh pr merge --auto --squash

# 8. GitHub Actions deploys to GitHub Pages automatically

# 9. Feature is LIVE!
# Visit: https://YOUR-USERNAME.github.io/workshop-autonomous-sdlc/
```

## Tech Stack

- **Framework:** React 19
- **Build Tool:** Vite 7
- **Testing:** Vitest + React Testing Library
- **CI/CD:** GitHub Actions
- **Deployment:** GitHub Pages
- **AI Agents:** Claude Code / Cline

## Troubleshooting

### Tests fail

Make sure dependencies are installed:
```bash
npm install
```

### Build fails

Check Node.js version (needs 18+):
```bash
node --version
```

### GitHub Pages not deploying

1. Check GitHub Actions tab for errors
2. Verify repository is **public**
3. Ensure Settings → Pages → Source is set to **GitHub Actions**

### `gh` command not found

Install GitHub CLI:
- Mac: `brew install gh`
- Windows: `winget install GitHub.cli`
- Linux: See https://github.com/cli/cli

Then authenticate:
```bash
gh auth login
```

## Learning Resources

- [Vite Documentation](https://vite.dev)
- [React Documentation](https://react.dev)
- [Vitest Documentation](https://vitest.dev)
- [GitHub CLI Documentation](https://cli.github.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)

## License

MIT - Free to use for learning and commercial purposes

## Workshop Information

**Course:** Build Your Software Factory Prototype
**Duration:** 2 days
**Focus:** Autonomous SDLC with AI agents

Ready to build the future of software development? Let's go! 🚀
