# Inventory Management System Frontend

## Project Overview

This frontend is the client application for an Inventory Management System developed as part of the ESE assignment. It provides the user interface for authentication, password recovery, and inventory item management, and it communicates with a backend API over HTTP.

The application is built with React and follows a feature-oriented structure so that authentication logic, inventory workflows, route definitions, and service calls remain clearly separated. The result is a frontend that is straightforward to maintain, easy to extend, and suitable for academic demonstration as well as deployment.

## Purpose

The purpose of this frontend is to give authenticated users a clean and usable interface for:

- registering accounts,
- logging in securely,
- requesting and completing password resets,
- creating inventory items,
- searching and viewing inventory records,
- updating existing items, and
- deleting items when the backend authorizes the action.

## Key Features

### 1. Authentication and Session Management

- Login screen with client-side email validation and backend error handling.
- User registration flow with role selection for `STAFF` or `ADMIN`.
- Persistent authentication using a stored token in `localStorage`.
- Protected routes that block unauthenticated access to inventory pages.
- Logout support from the dashboard.

### 2. Password Recovery

- Forgot password page to request a reset code by email.
- Reset password page with validation for email, reset code, and password confirmation.
- Clear user feedback for successful and failed reset attempts.

### 3. Inventory Management

- Create new inventory items with name, description, quantity, and category.
- Search inventory items by name, category, description, or a broader search term.
- View item details, including metadata such as creation and update timestamps.
- Update inventory items through a dedicated edit screen.
- Delete items with confirmation before the request is sent.

### 4. Validation and Error Handling

- Email format validation before requests are sent.
- Basic protection against unsafe input patterns associated with XSS and SQL injection attempts.
- Field-level and general error messaging for backend validation responses.
- Friendly handling of network and server failures.

### 5. Deployment Readiness

- Production build support through Create React App.
- Configured for deployment as a static site on Render.
- SPA rewrite rule included through the root-level `render.yaml` blueprint.

## Technology Stack

| Category | Technology |
| --- | --- |
| Frontend framework | React 19 |
| Routing | React Router DOM 7 |
| HTTP client | Axios |
| Build tooling | Create React App / react-scripts |
| Testing utilities | React Testing Library, Jest DOM |
| Code quality | ESLint, Prettier |
| Deployment target | Render static site |

## Application Workflow

The frontend supports the following primary workflow:

1. A user registers or logs in.
2. After authentication, the application stores the token and loads the current user profile.
3. The user accesses the dashboard and chooses an inventory action.
4. Inventory operations are sent to the backend API using Axios service modules.
5. The backend enforces authorization rules, while the frontend displays success or error feedback.

## Implemented Routes

### Public Routes

| Route | Description |
| --- | --- |
| `/` | Default entry route, mapped to login |
| `/login` | User login page |
| `/register` | User registration page |
| `/forgot-password` | Request password reset code |
| `/reset-password` | Submit reset code and new password |

### Protected Routes

| Route | Description |
| --- | --- |
| `/dashboard` | Main user dashboard |
| `/add-item` | Create a new inventory item |
| `/search-items` | Search and list inventory items |
| `/items/:itemId` | View item details |
| `/items/:itemId/edit` | Update an existing item |

## Backend Integration

This frontend depends on a backend API that exposes authentication and inventory endpoints. The application is currently wired to use these endpoint groups:

- `/auth/login/`
- `/auth/register/`
- `/auth/me/`
- `/auth/password-reset/request/`
- `/auth/password-reset/confirm/`
- `/inventory/items/`
- `/inventory/items/:id/`

### Authorization Behavior

The frontend stores the access token and automatically sends it in the `Authorization` header for authenticated requests.

Important authorization decisions are enforced by the backend:

- update actions are described in the UI as admin-only,
- delete actions are expected to be allowed for admin or staff users depending on backend policy,
- unauthorized requests are surfaced to the user through API error messages.

## Project Structure

```text
ims_frontend/
├── public/                  # Static public assets
├── src/
│   ├── components/          # Shared UI components such as route guards
│   ├── constants/           # Aggregated route constants
│   ├── context/             # Global auth context/provider
│   ├── features/
│   │   ├── auth/            # Auth routes and service exports
│   │   └── inventory/       # Inventory routes and service exports
│   ├── pages/               # Page-level React components
│   ├── services/            # Axios client and API request modules
│   ├── styles/              # Page-specific CSS files
│   └── utils/               # Validation helpers
├── package.json             # Scripts and dependencies
└── README.md                # Frontend documentation
```

## Environment Configuration

The application reads the backend base URL from an environment variable.

### Required Environment Variable

```env
REACT_APP_API_BASE_URL=https://your-backend-domain.com/api
```

### Local Default

If the variable is not set, the frontend falls back to:

```text
http://127.0.0.1:8000/api
```

This default is helpful for local development, but a production deployment should explicitly set `REACT_APP_API_BASE_URL`.

## Installation and Local Setup

### Prerequisites

Before running the project locally, make sure you have:

- Node.js installed,
- npm installed,
- a running backend API compatible with the endpoints listed above.

### Setup Steps

1. Open a terminal in the `ims_frontend` directory.
2. Install dependencies:

```bash
npm install
```

3. Create an environment file if needed and define the API base URL:

```env
REACT_APP_API_BASE_URL=http://127.0.0.1:8000/api
```

4. Start the development server:

```bash
npm start
```

5. Open the application in your browser at:

```text
http://localhost:3000
```

## Available Scripts

| Command | Purpose |
| --- | --- |
| `npm start` | Runs the development server |
| `npm run build` | Creates an optimized production build |
| `npm test` | Runs the test suite |
| `npm run lint` | Runs ESLint on source and public files |
| `npm run format` | Formats supported files with Prettier |
| `npm run format:check` | Checks formatting without modifying files |

## Quality and Maintainability

This frontend includes several practices that improve code quality and maintainability:

- modular service layer for API communication,
- centralized route constants,
- context-based authentication state management,
- reusable protected route logic,
- client-side validation helpers for common unsafe input patterns,
- linting and formatting scripts for consistent code quality.

## Deployment on Render

This repository already includes a Render blueprint at the root level in `render.yaml`.

### Render Configuration Summary

- Service type: static site
- Root directory: `ims_frontend`
- Build command: `npm ci; npm run build`
- Publish directory: `build`
- Rewrite rule: all routes rewrite to `/index.html`

### Deployment Steps

1. Push the repository to GitHub.
2. Create a new Blueprint deployment in Render.
3. Allow Render to detect the existing `render.yaml` file.
4. Set `REACT_APP_API_BASE_URL` in the Render environment settings.
5. Trigger the deployment.

## Assumptions and Known Constraints

- This frontend assumes the backend provides JWT-style or token-based authentication and returns an access token on login.
- The interface displays some actions that may still be rejected by the backend if the signed-in user lacks permission.
- Password strength and most authorization rules are enforced server-side rather than fully duplicated in the client.
- The frontend is designed as a single-page application and depends on correct API and CORS configuration in the backend environment.

## Suggested Improvements

The current implementation is functional and deployment-ready, but the following improvements would strengthen it further:

- add broader automated test coverage for page flows and API error states,
- add loading skeletons and empty-state illustrations for better UX,
- hide restricted actions in the UI based on resolved user role,
- add toast notifications for success and error messages,
- add pagination or debounced search for larger inventory datasets.

## Conclusion

This frontend delivers the core capabilities expected from an inventory management client application: authentication, password recovery, protected navigation, and full inventory item workflow support. Its separation of concerns, deployment readiness, and validation/error-handling approach make it appropriate for a strong academic submission and a solid base for further extension.
