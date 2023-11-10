const express = require('express');
const router = express.Router();
const { users } = require('../data'); // Import data from data.js



// Create a new task (POST)
router.post('/', (req, res) => {
  const user = users.find((user) => user.username === req.app.locals.authenticatedUser.username);
  if (user) {
    const taskName = req.body.taskName;
    user.tasks.push(taskName); // Add the task to the user's tasks array

    // Update data.js for data persistence
    const fs = require('fs');
    fs.writeFileSync('./data.js', `module.exports = ${JSON.stringify({ users })}`);

    res.status(201).json(user.tasks);
  } else {
    res.status(401).json({ message: 'User not found' });
  }
});

// Retrieve all tasks (GET)
router.get('/', (req, res) => {
  
  const user = req.app.locals.authenticatedUser;
  console.log("Check 2", user);
  res.status(200).json(user.tasks);
});

// Update an existing task (PUT)
router.put('/:taskName', (req, res) => {
  const user = req.app.locals.authenticatedUser;
  const taskName = req.params.taskName;
  const taskIndex = user.tasks.findIndex((task) => task === taskName);

  if (taskIndex !== -1) {
      user.tasks[taskIndex] = req.body.taskName;
      const fs = require('fs');
      fs.writeFileSync('./data.js', `module.exports = ${JSON.stringify({ users })}`);
      res.status(200).json({ message: 'Task updated successfully' });
  } else {
      res.status(404).json({ error: 'Task not found', message: 'Task could not be updated. Please make sure the task exists.' });
  }
});

// Delete a task (DELETE)
router.delete('/:taskName', (req, res) => {
  const taskName = req.params.taskName;
  const user = req.app.locals.authenticatedUser;
  const taskIndex = user.tasks.findIndex((task) => task === taskName);

  if (taskIndex !== -1) {
      user.tasks.splice(taskIndex, 1);
      const fs = require('fs');
      fs.writeFileSync('./data.js', `module.exports = ${JSON.stringify({ users })}`);
      res.status(204).send();
  } else {
    res.status(404).json({ error: 'Task not found', message: 'Task could not be deleted. Please make sure the task exists.'});
  }
});

module.exports = router;