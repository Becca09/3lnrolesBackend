# User Roles REST API

A simple Node.js REST API built with Express and TypeScript to manage and display user roles.

## Features

- ✅ Get all user roles
- ✅ Get role by ID
- ✅ Filter roles by status (Active, Inactive, Pending)
- ✅ Filter roles by type (DEFAULT, CUSTOM, SYSTEM_CUSTOM)
- ✅ TypeScript support
- ✅ CORS enabled
- ✅ Mock data from JSON file
- ✅ Serves static avatar images from `public/` at `/static`
- ✅ Comprehensive test suite (64 tests, 94.44% coverage)

## Tech Stack

- **Node.js** - Runtime environment
- **Express.js** - Web framework
- **TypeScript** - Type safety
- **CORS** - Cross-origin resource sharing
- **Jest** - Testing framework
- **Supertest** - API testing

## Project Structure

```
src/
├── __tests__/
│   └── server.test.ts          # Server integration tests
├── api/
│   └── roles/
│       ├── __tests__/          # Role-specific tests
│       │   ├── rolesService.test.ts
│       │   ├── rolesController.test.ts
│       │   └── rolesRouter.test.ts
│       ├── rolesModels.ts      # TypeScript interfaces
│       ├── rolesService.ts     # Business logic
│       ├── rolesController.ts  # Request handlers
│       └── rolesRouter.ts      # Route definitions
├── data/
│   └── roles.json              # Mock data
└── server.ts                   # Main server file
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm run build
npm start
```

The server will start on `http://localhost:3000`

## API Endpoints

### 1. Get All Roles
```
GET /api/roles
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "1",
      "name": "Supervisors",
      "type": "DEFAULT",
      "dateCreated": "Jan 1, 2023",
      "status": "Active",
      "teamMembers": [
        {
          "id": "1",
          "name": "User 1",
          "avatar": "/static/Avatar1.jpg"
        }
      ]
    }
  ],
  "total": 7
}
```

### 2. Get Role by ID
```
GET /api/roles/:id
```

**Example:**
```bash
curl http://localhost:3000/api/roles/1
```

### 3. Get Roles by Status
```
GET /api/roles/status/:status
```

**Available statuses:** `active`, `inactive`, `pending`

**Example:**
```bash
curl http://localhost:3000/api/roles/status/active
```

### 4. Get Roles by Type
```
GET /api/roles/type/:type
```

**Available types:** `default`, `custom`, `system_custom`

**Example:**
```bash
curl http://localhost:3000/api/roles/type/default
```

### 5. Health Check
```
GET /health
```

## Testing the API

You can test the API using:

### cURL
```bash
# Get all roles
curl http://localhost:3000/api/roles

# Get specific role
curl http://localhost:3000/api/roles/1

# Get active roles
curl http://localhost:3000/api/roles/status/active

# Get default type roles
curl http://localhost:3000/api/roles/type/default
```

### Browser
Simply open your browser and navigate to:
- http://localhost:3000/api/roles
- http://localhost:3000/health
- http://localhost:3000/static/Avatar1.jpg (sample static image)

### Postman/Thunder Client
Import the endpoints and test them directly in your API client.

## Mock Data

The API includes 7 pre-configured roles:
1. **Supervisors** (DEFAULT, Active)
2. **Moderators** (DEFAULT, Active)
3. **Supporters** (DEFAULT, Active)
4. **Lead personnel** (CUSTOM, Active)
5. **Deputy sales personnel** (CUSTOM, Pending)
6. **Developments** (SYSTEM_CUSTOM, Active)
7. **Developer-basic** (SYSTEM_CUSTOM, Active)

Each role includes team members with avatars served locally from the `public/` folder via the `/static` path (e.g., `/static/Avatar1.jpg`).

## Deployment to Vercel

This project is configured to run on Vercel using a single serverless function that wraps the Express app.

- **Function entry**: `api/[...all].ts` exports the Express app from `src/app.ts`.
- **Static files**: Files in `public/` are available at `/static/*` via a rewrite in `vercel.json`.
- **Local vs Vercel routes**:
  - Local: `http://localhost:3000/health`, `http://localhost:3000/api/roles`.
  - Vercel: `https://<your-app>.vercel.app/api/health`, `https://<your-app>.vercel.app/api/roles`.

### Deploy with Vercel CLI

```bash
npm i -g vercel
vercel login
vercel  # first deploy (link project)
vercel --prod  # production deploy
```

After deployment, verify:
- `https://<your-app>.vercel.app/api/roles`
- `https://<your-app>.vercel.app/api/health`
- `https://<your-app>.vercel.app/static/Avatar1.jpg`

## Environment Variables

You can customize the port by setting the `PORT` environment variable:

```bash
PORT=4000 npm run dev
```

## Testing

This project has comprehensive test coverage:

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage report
npm run test:coverage
```

### Test Statistics
- **64 tests** across 4 test suites
- **94.44% code coverage**
- Unit tests for service and controller layers
- Integration tests for API endpoints
- End-to-end workflow tests

See [TESTING.md](./TESTING.md) for detailed testing documentation.

## Error Handling

The API includes comprehensive error handling:
- **400** - Bad Request (missing parameters)
- **404** - Not Found (role doesn't exist)
- **500** - Internal Server Error

## Next Steps

To extend this API, you can:
- Add database integration (MongoDB, PostgreSQL, etc.)
- Implement POST, PUT, DELETE endpoints
- Add authentication & authorization
- Add pagination for large datasets
- Add input validation middleware
- ✅ ~~Add unit and integration tests~~ (COMPLETED)

## License

ISC
