# FirstWish ✦
### Remember the date. Make the moment.

FirstWish is a polished, dark-mode birthday and annual-event reminder app built for the people who matter. Add a name, date, and category; FirstWish creates a yearly recurring all-day event in your primary Google Calendar and configures reminders so you can plan ahead and send that midnight message.

> **Try the interface immediately:** the project starts in Demo Mode by default. You can explore the dashboard, add events, filter categories, remove dates, see the countdown, and experience the success confetti without Google credentials.

![FirstWish](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=white)
![Node](https://img.shields.io/badge/Node.js-Express-339933?logo=nodedotjs&logoColor=white)
![Google Calendar](https://img.shields.io/badge/Google_Calendar-API-4285F4?logo=googlecalendar&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-purple)

---

## ✨ What is FirstWish?

Life gets busy. FirstWish helps you remember birthdays, anniversaries, and special days—without turning the act of caring into another complicated task.

### Product highlights

- **Live countdown:** days, hours, minutes, and seconds until the next saved moment.
- **Three-field event creation:** event title, date, and category.
- **Yearly recurrence:** Google Calendar events use `RRULE:FREQ=YEARLY`.
- **Two popup reminders:** 1 day before (1440 minutes) and 15 minutes before the event's midnight start.
- **Category filters:** Birthday, Anniversary, and Special Day.
- **Confetti and toast feedback:** a celebratory moment when an event is saved.
- **Responsive interface:** dark glass panels, purple gradients, coral accents, and motion details.
- **Demo Mode:** no Google account or API credentials needed to preview the app.
- **Modular codebase:** frontend components, API client, date helpers, backend routes, OAuth integration, and demo store are separated.

## 🧰 Tech stack

| Layer | Technologies |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, custom CSS |
| Motion & feedback | Framer Motion, canvas-confetti |
| Icons | Lucide React |
| Backend | Node.js, Express |
| Google integration | Google OAuth 2.0, Google Calendar API via `googleapis` |
| Session & security basics | express-session, Helmet, CORS |
| Event storage | Google Calendar in live mode; in-memory demo store in Demo Mode |

## 🗂️ Project structure

```text
FirstWish/
├── README.md
├── .gitignore
├── .env.example
├── package.json                 # Root scripts / concurrent development
│
├── backend/
│   ├── .env.example
│   ├── package.json
│   └── src/
│       ├── server.js            # Express app, middleware, API routes
│       ├── config.js            # Environment configuration
│       ├── google.js            # OAuth client and Calendar API helper
│       ├── demoStore.js         # Sample events for preview mode
│       └── routes/
│           ├── auth.js          # Google sign-in, callback, status, logout
│           └── events.js        # List, create, and delete events
│
└── frontend/
    ├── index.html
    ├── package.json
    ├── vite.config.js
    ├── tailwind.config.js
    ├── postcss.config.js
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── api/
        │   └── client.js        # Frontend-to-backend requests
        ├── components/
        │   ├── Countdown.jsx
        │   ├── EventForm.jsx
        │   ├── EventCard.jsx
        │   └── Toast.jsx
        ├── utils/
        │   └── dates.js         # Countdown and date calculations
        └── styles/
            └── index.css        # Tailwind directives and app styling
```

## 🚀 Run locally — Demo Mode

### Requirements

- Node.js 20 or newer recommended
- npm
- A modern browser

### 1. Install dependencies

From the root `FirstWish/` directory:

```bash
npm install
npm --prefix backend install
npm --prefix frontend install
```

Or use the root shortcut:

```bash
npm run install:all
```

### 2. Configure the backend

```bash
cp backend/.env.example backend/.env
```

On Windows PowerShell, use:

```powershell
Copy-Item backend/.env.example backend/.env
```

The default `DEMO_MODE=true` setting means you do **not** need Google credentials yet. The app uses sample events and an in-memory store; demo-created events disappear when the backend restarts.

### 3. Start frontend and backend

From the project root:

```bash
npm run dev
```

Open **http://localhost:5173**.

The API runs at **http://localhost:4000**. Check its health at **http://localhost:4000/api/health**.

> If you prefer separate terminals, run `npm run dev:server` and `npm run dev:client` from the root in two terminals.

## 🔐 Enable live Google Calendar sync

Demo Mode is intentionally safe and immediate. To write events to a real calendar, configure a Google Cloud OAuth client.

### Step 1 — Create a Google Cloud project

1. Open the [Google Cloud Console](https://console.cloud.google.com/).
2. Create a project (for example, `FirstWish`), or select an existing project.
3. Open **APIs & Services → Library**.
4. Search for **Google Calendar API** and click **Enable**.

### Step 2 — Configure the OAuth consent screen

1. Open **Google Auth Platform** (or **APIs & Services → OAuth consent screen**, depending on the Console UI).
2. Set the app name to `FirstWish`, add a support email, and fill in the required developer contact details.
3. Select the audience appropriate for your use:
   - **External** for ordinary personal Google accounts.
   - **Internal** only if the app is restricted to a supported Google Workspace organization.
4. While the app is in **Testing**, add the Google accounts that will test it under **Test users**.
5. Configure the requested Calendar events scope. This project requests:
   `https://www.googleapis.com/auth/calendar.events`

Google may require additional verification before an externally available app can use sensitive/restricted scopes broadly. For a hackathon or personal prototype, use test users and follow the current instructions shown in your Cloud Console.

### Step 3 — Create OAuth credentials

1. Go to **APIs & Services → Credentials** (or **Google Auth Platform → Clients**).
2. Create an **OAuth client ID**.
3. Choose **Web application**.
4. Add this exact **Authorized redirect URI**:

   `http://localhost:4000/api/auth/google/callback`

5. Create the client and copy its **Client ID** and **Client secret**.

For local development, the frontend origin is `http://localhost:5173`; the OAuth callback is the backend URL above. Do not put the client secret in React/Vite variables or commit it to Git.

### Step 4 — Set backend environment variables

Edit `backend/.env`:

```dotenv
PORT=4000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:4000
DEMO_MODE=false
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
GOOGLE_REDIRECT_URI=http://localhost:4000/api/auth/google/callback
SESSION_SECRET=replace-with-a-long-random-secret
```

Generate a strong session secret rather than using the example value. Restart the backend after changing `.env`.

### Step 5 — Connect and test

1. Start the app with `npm run dev`.
2. Click **Try Google sync / Connect Calendar** in the header.
3. Choose the Google account and grant the requested permission.
4. Add a test event using a date you can easily inspect.
5. Open Google Calendar and verify the event, recurrence, and popup reminders.

The application stores OAuth tokens in the server-side session. The default `express-session` MemoryStore is suitable only for local development; use a persistent session store and secure production cookie settings before deploying.

## 📅 Calendar event behavior

Live events are created as **all-day events**:

- `start.date`: selected date.
- `end.date`: the next calendar date, because Google Calendar's all-day event end is exclusive.
- `recurrence`: `RRULE:FREQ=YEARLY`.
- `reminders.useDefault`: `false`.
- Popup reminder override at **1440 minutes**.
- Popup reminder override at **15 minutes**.
- Private event properties mark FirstWish events for the app's event list.

### Important reminder detail

Google Calendar expresses reminder overrides as minutes before the event's start. For an all-day event, a 15-minute reminder is relative to the event's midnight start, which is intended to correspond to **11:45 PM on the previous evening** in the calendar's timezone. Actual delivery depends on Google Calendar notification settings, device/browser permissions, and the calendar's timezone. The API cannot guarantee that a notification will be delivered or that a message will be sent automatically at 12:00 AM.

## 🔌 API endpoints

All endpoints are served from `http://localhost:4000`.

| Method | Endpoint | Purpose |
|---|---|---|
| `GET` | `/api/health` | API health and current mode |
| `GET` | `/api/auth/status` | Demo/live and connection status |
| `GET` | `/api/auth/google` | Start OAuth flow (live mode) |
| `GET` | `/api/auth/google/callback` | OAuth callback |
| `POST` | `/api/auth/logout` | Destroy the session |
| `GET` | `/api/events` | List FirstWish events |
| `POST` | `/api/events` | Create a yearly event |
| `DELETE` | `/api/events/:id` | Delete an event |

Example create request:

```json
{
  "title": "Rahul's Birthday 🎂",
  "date": "2027-02-11",
  "category": "Birthday"
}
```

Example successful response:

```json
{
  "event": {
    "id": "google-calendar-event-id",
    "title": "Rahul's Birthday 🎂",
    "category": "Birthday",
    "date": "2027-02-11"
  },
  "mode": "live"
}
```

## 🧠 How the code is organized

- **`App.jsx`** coordinates page state and user actions; it doesn't contain the whole UI in one component.
- **`components/`** contains independent UI parts: countdown, event form, event card, and toast.
- **`api/client.js`** centralizes API requests and credentials.
- **`utils/dates.js`** keeps date math separate from presentation.
- **`routes/auth.js`** handles the OAuth redirect and callback.
- **`routes/events.js`** validates user input and creates/list/deletes calendar events.
- **`google.js`** creates the OAuth client and Calendar API client.
- **`demoStore.js`** supplies mock data so the interface works without external credentials.

## 🛡️ Production checklist

This is a hackathon-ready starter, not a fully audited production service. Before public deployment:

- Replace the default in-memory session store with Redis or another persistent session store.
- Use HTTPS and set secure, HTTP-only cookies; review `sameSite` and proxy settings for your deployment.
- Generate a strong `SESSION_SECRET` and store secrets in your hosting provider's secret manager.
- Add rate limiting, CSRF protections appropriate to your OAuth/session design, stronger input/date validation, and structured logging.
- Add a database if you need app-owned metadata or reliable demo/personal data persistence.
- Configure Google OAuth authorized origins and redirect URIs for the deployed domains.
- Complete any Google OAuth consent-screen verification that applies to your audience and requested scope.
- Add automated tests for date validation, recurrence payloads, authorization, and API errors.
- Explain data handling and deletion in a privacy policy before inviting public users.

## 🧪 Useful commands

```bash
# Start API + frontend in development
npm run dev

# Build the frontend
npm run build

# Run only the backend
npm run dev:server

# Run only the frontend
npm run dev:client

# Start the backend in production mode
npm start
```

## 📄 License

MIT — feel free to adapt this starter for your portfolio or hackathon. Add a `LICENSE` file with the standard MIT text before publishing if you want to formally distribute it under that license.

---

**FirstWish — because being remembered feels good, and remembering someone feels even better.**
