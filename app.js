const express = require('express');
const mysql = require('mysql2');
const app = express();

const connection = mysql.createConnection({
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: 'Tuttle140822:)',
  database: 'c237_studentlistapp'
});

connection.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL database');
});

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(express.urlencoded({
  extended: false
}));

app.get('/', (req, res) => {
  const sql = 'SELECT * FROM student';

  connection.query(sql, (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error retrieving students');
    }

    res.render('index', { students: results });
  });
});

app.get('/student/:id', (req, res) => {
  const studentId = req.params.id;

  const sql = 'SELECT * FROM student WHERE studentId = ?';

  connection.query(sql, [studentId], (error, results) => {
    if (error) {
      console.error('Database query error:', error.message);
      return res.send('Error retrieving student by ID');
    }

    if (results.length > 0) {
      res.render('student', { student: results[0] });
    } else {
      res.send('Student not found');
    }
  });
});

app.get('/addStudent', (req, res) => {
  res.render('addStudent');
});

app.post('/addStudent', (req, res) => {
  const { name, dob, contact, image } = req.body;

  const sql = 'INSERT INTO student (name, dob, contact, image) VALUES (?, ?, ?, ?)';

  connection.query(sql, [name, dob, contact, image], (error, results) => {
    if (error) {
      console.error('Error adding student:', error);
      res.send('Error adding student');
    } else {
      res.redirect('/');
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));