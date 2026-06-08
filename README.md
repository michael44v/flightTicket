# SkyBridge - Flight Booking Website

SkyBridge is a premium flight booking platform for Turkey-based routes, built with React, Tailwind CSS, and Vanilla PHP.

## Features

- **Flight Search:** Search for flights between major Turkish and international hubs.
- **Flight Board (FIDS):** Real-time flight status board with auto-refresh.
- **Flexible Payments:** Pay in full or split into 3 monthly installments.
- **Penalty Logic:** Automatic 8% penalty for installments overdue by more than 7 days.
- **Ticket Lookup:** Manage your booking, view itinerary, and pay installments.

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v7, Axios, Lucide React.
- **Backend:** PHP 8.2+, PDO (MySQL).
- **Styling:** Premium airline feel with a deep navy and red palette.

## Installation

### Prerequisites

- Node.js & npm
- PHP 8.2+
- MySQL / MariaDB

### Backend Setup

1.  Ensure MySQL is running.
2.  Navigate to the `api` directory or serve from the root.
3.  Configure database credentials in `api/db.php` (defaults are localhost/root/no password).
4.  Run the seeding script to create the database, tables, and initial data:
    ```bash
    php api/seed.php
    ```

### Frontend Setup

1.  Install dependencies:
    ```bash
    npm install
    ```
2.  Start the development server:
    ```bash
    npm run dev
    ```

## API Endpoints

- `GET /api/flights.php`: Search flights.
- `GET /api/flight-logs.php`: Fetch FIDS board data.
- `POST /api/book.php`: Create a new booking.
- `GET /api/ticket.php?id=...`: Retrieve booking details.
- `POST /api/pay-installment.php`: Process installment payments and penalties.

## Routes

- `/`: Home (Search)
- `/flights`: Search Results
- `/book/:flightId`: Booking & Payment
- `/confirmation`: Booking Success
- `/board`: Live Flight Board
- `/ticket`: Ticket Lookup
