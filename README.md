# Book Inventory Frontend

## AI-assisted development disclosure

This submission made deliberate use of AI tools during the technical assessment:

- **Gemini** and **Cursor Pro (Ask mode)** were used as tutors during coding: explanations of how to implement features and comparisons of approaches (why one option might be preferable over another).
- **Cursor Pro (Agent mode)** was used to draft and refresh documentation (`README.md`), generate and update the Postman collection alongside code changes, and as a starting point for commit messages.

Human judgment remained responsible for reviewing suggestions, integrating changes, and validating behavior.

---

A Fresh frontend app for managing the Book Inventory UI.

## Stack

- Deno
- Fresh
- Preact (`islands` for interactive components)
- Tailwind CSS (utility classes in UI)

## Prerequisites

Before running this frontend, make sure:

- Deno is installed: [https://docs.deno.com/runtime/getting_started/installation](https://docs.deno.com/runtime/getting_started/installation)
- The backend API is up and running (Laravel app)

Default backend URL expected by the frontend:

- `http://127.0.0.1:8000/api`

## Installation

1. Go to the frontend project folder.
2. Create your environment file:

```bash
cp .env.example .env
```

If `.env.example` is not present, create `.env` manually.

3. Set the API URL:

```env
API_URL=http://127.0.0.1:8000/api
```

4. Start development server:

```bash
deno task dev
```

## Change API URL

To point the frontend to another backend host/port, update:

- `.env` -> `API_URL`

Example:

```env
API_URL=http://localhost:9000/api
```

Then restart the dev server so the new value is picked up.
