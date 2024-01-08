# Google Calendar Event Creator

This project is an Express.js application that integrates with the Google Calendar API to create calendar events and send ICS email requests. It allows users to authenticate via Google, authorize the application to access their Google Calendar, and create events in their calendar.

## Features

- OAuth2 Google Authentication
- Creation of events in Google Calendar
- Sending ICS email requests for event invites

## Prerequisites

- Node.js
- npm (Node Package Manager)
- Google Cloud Platform account with access to the Calendar API
- OAuth2 credentials from Google API Console

## Installation

1. **Clone the repository:**

   ```bash
   git clone [repository_url]
   ```

## How to use

cd [project_name]

install dependencies

```bash
npm install
```

Set up environment variables:

    CLIENT_ID=your_google_client_id
    CLIENT_SECRET=your_google_client_secret

REFRESH_TOKEN=your_google_refresh_token

Start the server:

```bash
npm start
```
