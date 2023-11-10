const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

const { users } = require('./data');

// Helper function to authenticate a user
function authenticateUser(username, password) {
    return users.find((user) => user.username === username && user.password === password);
}

app.post('/login', (req, res, next) => {
    const { username, password } = req.body;
    const authenticatedUser = authenticateUser(username, password);

    if (authenticatedUser) {
        app.locals.authenticatedUser = authenticatedUser; // Attach the user data to the response object
        console.log("Check 1", app.locals.authenticatedUser);
        res.status(200).json({ message: 'Authentication successful' });
    } else {
        // Authentication failed
        res.status(401).json({ message: 'Authentication failed' });
    }
    next();
});

// Define routes
const tasksRouter = require('./routes/tasks');
app.use('/tasks', tasksRouter);

app.listen(port, () => {
    console.log(`App listening on port ${port}`);
});