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
// https://sqliteonline.com/#emlink=13.112.511.10;tasks;postgres
const pgClient = new Pool({
  user: config.pgUser,
  host: config.pgHost,
  database: config.pgDatabase,
  password: config.pgPassword,
  port: config.pgPort,
  // user: 'postgres',
  // host: 'localhost',
  // database: 'tasks',
  // password: 'postgres',
  // port: 5432,
});
pgClient.on('error', () => console.log('Lost Postgres connection'));

// TODO: Create initial DB table called task
pgClient
  .query(`
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    CREATE TABLE IF NOT EXISTS tasks (
      id uuid DEFAULT uuid_generate_v4 (),
      title VARCHAR NOT NULL,
      details VARCHAR,
      completed BOOLEAN NOT NULL DEFAULT false,
      PRIMARY KEY (id)
    )
  `)
  .catch((err) => console.log(err));

// Express route handlers

// Get all to do list tasks
app.get('/api/v1/tasks', async (req, res) => {
  // TODO: Insert your route logic here
  const query = 'SELECT * FROM tasks'
  try {
    const result = await pgClient.query(query)
    console.log(result.rows)
    return res.status(200).json({
      message: "success",
      data:result.rows
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).json({
      error: err
    });
  }
});

// Get a single todo task
app.get('/api/v1/tasks/:id', async (req, res) => {
  // TODO: Insert your route logic here
  const id = `'${req.params.id}'`
  const query = `SELECT * FROM tasks WHERE id=${id}`;
  console.log(query)
  try {
    const result = await pgClient.query(query)
    console.log(result.rows)
    return res.status(200).json({
      message: "success",
      data:result.rows
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).json({
      error: err
    });
  }
});

// Create a todo task
app.post('/api/v1/tasks', async (req, res) => {
  // TODO: Insert your route logic here
  // async/await
  const text = 'INSERT INTO tasks(title, details,completed) VALUES($1, $2, $3) RETURNING *'
  const values = [req.body.title, req.body.details, req.body.completed]
  try {
    const result = await pgClient.query(text, values)
    console.log(result.rows[0])
    return res.status(201).json({
      message: "success"
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).json({
      error: err
    });
  }
});

// Update a todo task
app.put('/api/v1/tasks/:id', async (req, res) => {
  const text = `UPDATE tasks SET title=$1, details=$2,completed=$3 WHERE id=$4`;
  const values = [req.body.title, req.body.details, req.body.completed,req.params.id]
  try {
    const result = await pgClient.query(text, values)
    console.log(result.rows[0])
    return res.status(200).json({
      message: "success"
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).json({
      error: err
    });
  }
});

// Delete a todo task route

app.delete('/api/v1/tasks/:id', async (req, res) => {
  // TODO: Insert your route logic here
  const query = `DELETE FROM tasks WHERE id=$1`;
  const values = [req.params.id]
  try {
    const result = await pgClient.query(query, values)
    console.log(result.rows[0])
    return res.status(200).json({
      message: "success"
    });
  } catch (err) {
    console.log(err.stack)
    return res.status(500).json({
      error: err
    });
  }
});

app.get('/api/v1/health',async(req,res)=>{
  res.send('I am alive :)')
});
// Server
const port = process.env.PORT || 3001;
const server = http.createServer(app);
server.listen(port, () => console.log(`Server running on port ${port}`));
