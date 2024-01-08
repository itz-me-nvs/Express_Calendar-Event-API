const express = require("express");
const nodemailer = require("nodemailer");
const app = express();
const port = 3000;

app.use(express.json());

app.post("/send-event", async (req, res) => {
  try {
    const eventDetails = req.body;
    await sendEmailWithICS(eventDetails);
    res.send("Email with calendar event sent successfully!");
  } catch (error) {
    console.error(error);
    res.status(500).send("Error sending email");
  }
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});

// helper function to create the ICS file
function createICSFile(eventDetails) {
  const { startTime, endTime, email, summary, location, description } =
    eventDetails;

  // Format dates to the iCalendar format
  const startDate = formatToICalDate(new Date(startTime));
  const endDate = formatToICalDate(new Date(endTime));

  // Create the content of the ICS file
  let icsFileContent = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "BEGIN:VEVENT",
    "UID:" + generateUID(), // Unique identifier for the event
    "DTSTAMP:" + formatToICalDate(new Date()), // Current timestamp
    "DTSTART:" + startDate,
    "DTEND:" + endDate,
    "SUMMARY:" + summary,
    "DESCRIPTION:" + description,
    "LOCATION:" + location,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  return icsFileContent;
}

function formatToICalDate(date) {
  return date.toISOString().replace(/-|:|\.\d\d\d/g, "");
}

function generateUID() {
  // Implement a function to generate a unique identifier for each event
  return "example-uid-" + Date.now(); // This is a simplistic approach
}

async function sendEmailWithICS(eventDetails) {
  let transporter = nodemailer.createTransport({
    service: "gmail", // Replace with your email service
    auth: {
      user: "muhammednavas320203@gmail.com",
      pass: "qiyw lnta wtxb osxe", // google account app specific password (less secure)
    },
  });

  let icsContent = createICSFile(eventDetails);
  console.log(icsContent);

  let mailOptions = {
    from: "muhammednavas320203@gmail.com",
    to: eventDetails.email,
    subject: "Your Event Details",
    text: "Here are your event details.",
    attachments: [
      {
        filename: "event.ics",
        content: icsContent,
      },
    ],
  };

  await transporter.sendMail(mailOptions);
}
