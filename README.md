# Repository Popularity Scoring Service

A RESTful API service that searches GitHub repositories and assigns a dynamic popularity score to each result based on stars, forks, and update recency.

## Features

-   **Dynamic Scoring:** Implements a weighted algorithm to score repository popularity.
-   **Parameter Validation:** Robust input validation using Zod.
-   **In-Memory Caching:** Features an in-memory cache with TTL and LRU eviction to improve performance and reduce API calls.
-   **Clean Architecture:** Follows a clean, scalable project structure.
-   **Comprehensive Testing:** Includes both unit and integration tests.

## Prerequisites

-   [Node.js](https://nodejs.org/) (v18.x or later recommended)
-   [npm](https://www.npmjs.com/)

## Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/MostafaKamel16/scoring-service.git
    cd scoring-service
    ```

2.  Install the dependencies:
    ```bash
    npm install
    ```

## Running the Application

### Development

To run the server in development mode with live reloading:

```bash
npm run dev
```

The server will be available at `http://localhost:3000`.

### Production

To build and run the application for production:

```bash
# 1. Build the TypeScript source
npm run build

# 2. Start the server
npm start
```

## Running Tests

This project uses Jest for testing.

-   **Run all tests (unit & integration):**
    ```bash
    npm test
    ```

-   **Run tests in watch mode:**
    ```bash
    npm run test:watch
    ```

## API Endpoint

### `GET /score/repositories`

Searches repositories and returns them with an added `popularity_score`.

#### Query Parameters

| Parameter       | Description                                          | Type     | Required | Default |
| :-------------- | :--------------------------------------------------- | :------- | :------- | :------ |
| `q`             | The search query string.                             | `string` | **Yes**  | `N/A`   |
| `language`      | Filters repositories by programming language.        | `string` | No       | `N/A`   |
| `created_after` | Filters for repos created after a date (YYYY-MM-DD). | `string` | No       | `N/A`   |
| `sort`          | The sort field.                                      | `enum`   | No       | `best-match` |
| `order`         | The sort order (`asc` or `desc`).                    | `enum`   | No       | `desc`  |
| `per_page`      | The number of results per page (max: 100).           | `number` | No       | `30`    |
| `page`          | The page number of the results.                      | `number` | No       | `1`     |

#### Example Request

```bash
curl "http://localhost:3000/score/repositories?q=react&language=javascript&created_after=2024-01-01"
```

## Popularity Scoring Algorithm

The score is calculated using a logistic function to ensure the result is always between 0 and 1. It uses log-normalization for star and fork counts to handle extreme values gracefully.

-   **Formula**: `1 / (1 + e^(-(log10(stars+1)*0.5 + log10(forks+1)*0.3 + recency*0.2)))`
-   **Weights**:
    -   Stars: 50%
    -   Forks: 30%
    -   Recency: 20% (calculated as `1 / (days_since_last_update + 1)`)

## Environment Variables

Create a `.env` file in the root directory to configure the application.

| Variable             | Description                                      | Default     |
| :------------------- | :----------------------------------------------- | :---------- |
| `PORT`               | The port the server will run on.                 | `3000`      |  |

## Project Structure

```
src/
├── __tests__/         # Integration tests
├── services/         # External service communication (e.g., GitHub API)
├── utils/            # Reusable utility functions (cache, scoring, etc.)
│   └── __tests__/    # Unit tests for utilities
├── app.ts            # Main server entry point (starts the server)
├── config.ts         # Application configuration
├── createApp.ts      # Express app factory (for testing)
└── types.ts          # Shared TypeScript types and
