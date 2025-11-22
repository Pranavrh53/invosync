# Development Guide

This guide covers setting up the development environment and workflow for InvoSync.

## Prerequisites

- Node.js v18+
- npm v9+
- Firebase CLI (`npm install -g firebase-tools`)
- Git

## Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/invosync.git
   cd invosync
   ```

2. **Install Dependencies**
   ```bash
   # Install backend dependencies
   cd backend/functions
   npm install
   
   # Install frontend dependencies
   cd ../../frontend
   npm install
   ```

3. **Environment Setup**
   - Copy `.env.example` to `.env` in both `backend/functions/` and `frontend/`
   - Update the environment variables with your Firebase project details

## Running Locally

### Backend
```bash
cd backend/functions
npm run serve
```

### Frontend
```bash
cd frontend
npm run dev
```

## Testing

### Backend Tests
```bash
cd backend/functions
npm test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## Code Style
- Follow [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript)
- Use Prettier for code formatting
- Run ESLint before committing

## Commit Message Format
Follow [Conventional Commits](https://www.conventionalcommits.org/):
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code changes that neither fixes a bug nor adds a feature
- `test:` Adding missing tests or correcting existing tests
- `chore:` Changes to the build process or auxiliary tools

## Pull Requests
1. Create a feature branch from `main`
2. Make your changes
3. Run tests
4. Submit a PR with a clear description of changes
5. Request review from at least one team member
