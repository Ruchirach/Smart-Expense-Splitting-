# Smart-Expense-Splitting-
Smart Expense Splitter is a full-stack web application that allows users to add shared expenses and automatically calculates how much each person owes or should receive. Built using React for the frontend and Spring Boot (Maven) for the backend.
# Smart Expense Splitter

Simple full-stack app to track shared expenses and see how much each person owes or should receive.

- **Backend**: Spring Boot (Maven, Spring Web, Spring Data JPA, H2, Validation)
- **Frontend**: React (Vite, functional components + hooks)

## Backend (Spring Boot)

Location: `backend`

### Run

```bash
cd backend
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`.

### Main endpoints

- `POST /expenses` – create a new expense
- `GET /expenses` – list all expenses
- `GET /expenses/balances` – calculate balances as `Map<String, Double>`

Balance rules:

- Each expense amount is split equally between `splitBetween` users.
- Each participant owes their share (their balance goes down).
- The payer (`paidBy`) is credited with the full amount (their balance goes up).
- Positive balance → should **receive** money; negative balance → **owes** money.

## Frontend (React)

Location: `frontend`

### Install & run

```bash
cd frontend
npm install
npm run dev
```

The frontend runs on `http://localhost:3000` (configured in `vite.config.js`).

The app has three main parts:

- Add Expense form
- Expense list
- Balance summary

Make sure the backend is running before using the UI so API calls succeed.
