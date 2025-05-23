# Simple Logger Service

A Node.js Express application that provides a `/log` endpoint to receive and print messages.

## Setup

1.  Clone the repository.
2.  Run `npm install` to install dependencies.

## Running Locally

```bash
npm start
```

The service will start on `http://localhost:3000` (or the port specified by the `PORT` environment variable).

## Endpoints

*   `GET /`: Returns a status message indicating the service is running.
*   `POST /log`:
    *   Expects a JSON body with a `message` field.
    *   Example: `curl -X POST -H "Content-Type: application/json" -d '{"message":"Hello from curl"}' http://localhost:3000/log`
    *   Prints the received message to the console.
    *   Returns a JSON response indicating success or failure.

## Deployment to Railway

This application is configured for easy deployment to Railway using the provided `Dockerfile`.

1.  Push this repository to GitHub.
2.  Connect your GitHub repository to a new Railway project.
3.  Railway will automatically build and deploy the application. 