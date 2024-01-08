const nodemailer = require("nodemailer");

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
      user: "YOUR_EMAIL_ADDRESS",
      pass: "YOUR_EMAIL_PASSWORD", // app password if 2FA is enabled for the email account
    },
  });

  let icsContent = createICSFile(eventDetails);
  console.log(icsContent);

  let mailOptions = {
    from: "FROM_YOUR_EMAIL_ADDRESS",
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

sendEmailWithICS({
  email: "YOUR_EMAIL_ADDRESS", // The email address of the recipient
  summary: "Job Interview at ABC Corp", // A brief summary or title of the event
  location: "123 Main St, Cityville", // The location of the event
  description:
    "Interview for the position of Software Developer. Please bring your resume and portfolio.", // A detailed description of the event
  startTime: "2024-02-20T10:00:00", // Start time of the event (ISO 8601 format)
  endTime: "2024-02-20T11:00:00", // End time of the event (ISO 8601 format)
});
