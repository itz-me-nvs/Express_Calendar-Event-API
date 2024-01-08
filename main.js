require("dotenv").config();
const express = require("express");
const { google } = require("googleapis");
const { OAuth2Client } = require("google-auth-library");
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
const REDIRECT_URI = "http://localhost:3000/oauth2callback";
const SCOPES = ["https://www.googleapis.com/auth/calendar"];
const app = express();
const port = 3000;

app.use(express.json());

const oauth2Client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

app.get("/", (req, res) => {
  const authUrl = oauth2Client.generateAuthUrl({
    access_type: "offline",
    scope: SCOPES,
  });
  res.send(`<a href="${authUrl}">Authorize</a>`);
});

app.get("/oauth2callback", async (req, res) => {
  const { code } = req.query;
  const { tokens } = await oauth2Client.getToken(code);
  // Store tokens.refresh_token securely
  console.log("Refresh Token:", tokens.refresh_token);
  res.send("Authorization successful!");
});

// api for creating calendar event
app.post("/create-event", async (req, res) => {
  try {
    const eventDetails = req.body;
    const accessToken = await refreshAccessToken(REFRESH_TOKEN);
    console.log("accessToken", accessToken);
    await createCalendarEvent(eventDetails);
    res.send("Calendar event created successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error creating calendar event");
  }
});

async function refreshAccessToken(refreshToken) {
  oauth2Client.setCredentials({
    refresh_token: refreshToken,
  });

  try {
    const response = await oauth2Client.getAccessToken();
    console.log("Access Token:", response.token);
    const accessToken = response.token;
    return accessToken;
  } catch (error) {
    console.error("Error refreshing access token: ", error);
    throw error;
  }
}

// create calendar event
async function createCalendarEvent(eventDetails) {
  const calendar = google.calendar({
    version: "v3",
    auth: oauth2Client,
  });

  const event = {
    // Define the calendar event details
    summary: eventDetails.summary,
    location: eventDetails.location,
    description: eventDetails.description,
    start: {
      dateTime: eventDetails.startTime,
      timeZone: "America/Los_Angeles",
    },
    end: {
      dateTime: eventDetails.endTime,
      timeZone: "America/Los_Angeles",
    },
    // additional event properties...
  };

  try {
    const response = await calendar.events.insert({
      calendarId: "primary",
      resource: event,
    });
    console.log("Event created:", response.data);
  } catch (error) {
    console.error("Error creating calendar event:", error);
  }
}

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
