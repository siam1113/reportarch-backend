# ReportArch Backend

The API backend for ReportArch, a platform for archiving and viewing automated test reports. Handles organizations, projects, test suites, API keys, users, authentication, and report uploads.

## Stack

- Node.js, Express
- MongoDB (Mongoose)
- AWS S3 and DynamoDB (for report storage)

## Layout

```text
config/       Database and app configuration
controllers/  Request handlers
middleware/   Security and request middleware
models/       Mongoose data models
routes/       API route definitions (org, project, testSuite, report, apiKey, user, auth)
index.js      Server entry point
```

## Getting Started

```bash
npm install
cp .env.example .env   # fill in database and AWS credentials
npm run server
```

This runs the server with nodemon, restarting automatically on file changes.

This backend serves the [ReportArch frontend](https://github.com/siam1113/reportarch-frontend).
