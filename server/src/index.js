require('dotenv').config();

// Express App Setup
const express = require('express');
const http = require('http');
const bodyParser = require('body-parser');
const cors = require('cors');
const uuid = require('uuid/v4');

// Config
const config = require('./config');

// Initialization
const app = express();
app.use(cors());
app.use(bodyParser.json());

// Postgres client
const { Pool } = require('pg');
const pgClient = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: config.pgPort,
});
pgClient.on('error', () => console.log('Lost Postgres connection'));

// TODO: Create initial DB table called task
pgClient
  .query(
    `
     // TODO: Inser create table SQL query here
    `
  )
  .catch((err) => console.log(err));

// Express route handlers

// Get all to do list tasks
app.get('/api/v1/tasks', async (req, res) => {
  // TODO: Insert your route logic here
});

// Get a single todo task
app.get('/api/v1/tasks', async (req, res) => {
  // TODO: Insert your route logic here
});

// Create a todo task
app.post('/api/v1/tasks', async (req, res) => {
  // TODO: Insert your route logic here
});

// Update a todo task
app.put('/api/v1/tasks/:id', async (req, res) => {
  // TODO: Insert your route logic here
});

// Delete a todo task route

app.delete('/api/v1/tasks/:id', async (req, res) => {
  // TODO: Insert your route logic here
});

// Server
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));
