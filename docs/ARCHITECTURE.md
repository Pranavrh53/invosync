# System Architecture

This document outlines the high-level architecture of InvoSync.

## Overview

InvoSync follows a modern, cloud-native architecture with clear separation of concerns between the frontend, backend, and external services.

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Frontend      │◄───►│   Backend       │◄───►│   Firebase      │
│   (React)       │     │   (Node.js)     │     │   Services      │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        ▲                        ▲                       ▲
        │                        │                       │
        ▼                        ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│   User          │     │   API           │     │   Database      │
│   Browser       │     │   Endpoints     │     │   (Firestore)   │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## Frontend Architecture

- **Framework**: React 18 with TypeScript
- **State Management**: React Context API + useReducer
- **UI Components**: Custom design system with styled-components
- **Routing**: React Router v6
- **Form Handling**: React Hook Form with Yup validation
- **API Client**: Axios for HTTP requests

## Backend Architecture

### Core Modules

```
backend/functions/src/
├── modules/               # Feature modules
│   ├── clients/          # Client management
│   ├── invoices/         # Invoice generation
│   ├── auth/             # Authentication
│   └── reports/          # Reporting
├── lib/                  # Shared utilities
├── middleware/           # Express middleware
└── index.ts              # Application entry point
```

### Key Design Patterns

- **Modular Design**: Each feature is self-contained with its own routes, controllers, and services
- **Dependency Injection**: For better testability and loose coupling
- **Repository Pattern**: Abstract data access layer
- **Middleware Pipeline**: For cross-cutting concerns (auth, validation, error handling)

## Data Flow

1. User interacts with the React frontend
2. Frontend makes API calls to the backend
3. Backend processes requests, interacts with Firebase services
4. Data is returned to the frontend and UI updates accordingly

## Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- Rate limiting and request validation
- CORS and security headers

## Performance Considerations

- Client-side caching with React Query
- Lazy loading of components
- Optimized database queries with Firestore indexes
- CDN for static assets
