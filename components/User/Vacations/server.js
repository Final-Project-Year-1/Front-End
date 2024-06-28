const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 8080;
const DATA_FILE = path.join(__dirname, 'user_data.json');

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname, 'Front-End')));

// CORS middleware
const cors = require('cors');
app.use(cors());

// Serve register.html at root
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'Front-End/Auth/Register/register.html'));
});

// POST route to handle registration
app.post('/api/register', (req, res) => { 
    const newUser = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        gender: req.body.gender,
        password: req.body.password
    };

    // Check if user_data.json exists, if not create it with an empty array
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, JSON.stringify([]));
    }

    // Read the current users from the file
    fs.readFile(DATA_FILE, 'utf8', (err, data) => {
        if (err) {
            console.error('Error reading the file', err);
            return res.status(500).send('Internal server error');
        }

        let users = JSON.parse(data); // Parse the JSON data
        users.push(newUser);

        // Write the updated users back to the file
        fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2), (err) => {
            if (err) {
                console.error('Error writing to the file', err);
                return res.status(500).send('Internal server error');
            }

            res.json({ success: true });
        });
    });
});

// Handle POST requests for vacations route
app.post('/api/vacations', (req, res) => {
    // Handle vacations POST request here
    res.json({ message: 'Vacations data received' });
});

// Handle POST requests for all other routes
app.post('*', (req, res) => {
    res.status(405).send('Method Not Allowed');
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
