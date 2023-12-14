// Importing required modules
import express from 'express';
import bodyParser from 'body-parser';
import nodemailer from 'nodemailer';
import 'dotenv/config'

// Create an Express app
const app = express();

// Use middleware to parse incoming request bodies
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Serve static files (in this case, the HTML file)
app.use(express.static('public'));

app.get('/', (req, res) => {res.sendFile(index.html)})

// Define a route for handling the form submission
app.post('/send-email', (req, res) => {
    // Extract data from the form submission
    const to = req.body.to;
    const subject = req.body.subject;
    const message = req.body.message;
    if (!to || !subject || !message) {
        res.send("Il faut remplir tout les champs")
    }


    // Create a Nodemailer transporter
    const transporter = nodemailer.createTransport({
        host: "smtp.sendgrid.net",
        secure: false,
        auth: {
           user: "apikey",
           pass: process.env.SENDGRID_SECRET,
        },
    });

    // Define the mail options
    const mailOptions = {
        from: 'buisson@n7.fr', // Replace with your Gmail email
        to: to,
        subject: subject,
        text: message
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error(error);
            res.status(500).send('Internal Server Error');
        } else {
            console.log('Email sent: ' + info.response);
            res.send('Email sent successfully!');
        }
    });
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running at http://localhost:${PORT}`);
});
