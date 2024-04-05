const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5000;


const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'manager',
    database: 'support_system'
});


connection.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL database:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'attachments/') 
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});

const upload = multer({ storage: storage });

app.use(cors());
app.use(bodyParser.json());


app.post('/api/login', (req, res) => {
    const { email, password } = req.body;

    
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    
    const sql = 'SELECT * FROM users WHERE email = ?';
    connection.query(sql, [email], async (err, results) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }
        
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

       
        const user = results[0];
        try {
            if (await bcrypt.compare(password, user.password)) {
                
                const token = jwt.sign({ userId: user.id }, 'your_secret_key', { expiresIn: '1h' });
                
                let roleValue;
                switch (user.role) {
                    case 'end_user':
                        roleValue = 0;
                        break;
                    case 'tech_support':
                        roleValue = 1;
                        break;
                    case 'admin':
                        roleValue = 2;
                        break;
                    default:
                        roleValue = -1; 
                }
               
                return res.status(200).json({ token, userId: user.id, role: roleValue });
            } else {
                
                return res.status(401).json({ message: 'Invalid password' });
            }
        } catch (error) {
            console.error('Error comparing passwords:', error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    });
});



app.post('/api/register', (req, res) => {
    const { email, password, role } = req.body;

    
    if (!email || !password || !role) {
        return res.status(400).json({ message: 'Email, password, and role are required' });
    }

   
    bcrypt.hash(password, 10, (err, hashedPassword) => {
        if (err) {
            console.error('Error hashing password:', err);
            return res.status(500).json({ message: 'Internal server error' });
        }

        
        const sql = 'INSERT INTO users (email, password, role) VALUES (?, ?, ?)';
        connection.query(sql, [email, hashedPassword, role], (err, results) => {
            if (err) {
                console.error('Error inserting user into database:', err);
                return res.status(500).json({ message: 'Internal server error' });
            }

            
            return res.status(201).json({ message: 'User registered successfully' });
        });
    });
});

app.get('/api/tickets', (req, res) => {
    
    const userId = req.query.userId; 

    
    const sql = 'SELECT * FROM tickets WHERE user_id = ?';
    console.log(sql)

    
    connection.query(sql, [userId], (err, results) => {
        if (err) {
            console.error('Error fetching tickets:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        
        res.status(200).json(results);
    });
});

app.put('/api/tickets/close/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'UPDATE tickets SET status = "Closed" WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error marking ticket as closed:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: `Ticket ${id} marked as closed.` });
    });
});

app.put('/api/tickets/resolve/:id', (req, res) => {
    const { id } = req.params;
    
    const sql = 'UPDATE tickets SET status = "Resolved" WHERE id = ?';
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error marking ticket as resolved:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: `Ticket ${id} marked as resolved.` });
    });
});

app.post('/api/tickets', upload.single('attachment'), (req, res) => {
    const { title, description } = req.body;
    const attachment = req.file ? req.file.filename : null;
    const userId = req.query.user_id; 

    
    const sql = 'INSERT INTO tickets (title, description, attachment, user_id) VALUES (?, ?, ?, ?)';
    connection.query(sql, [title, description, attachment, userId], (err, result) => {
        if (err) {
            console.error('Error creating ticket:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'Ticket created successfully', ticketId: result.insertId });
    });
});



app.use('/attachments', express.static(path.join(__dirname, 'attachments')));




app.get('/api/tech-support/assigned-tickets', (req, res) => {
    const supportId = req.query.support_id; 
    const sql = 'SELECT * FROM tickets WHERE support_id = ?'; 

   
    connection.query(sql, [supportId], (err, results) => {
        if (err) {
            console.error('Error fetching assigned tickets:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        
        res.status(200).json(results);
    });
});


app.get('/api/tickets/:id', (req, res) => {
    const { id } = req.params;


    const sql = 'SELECT * FROM tickets WHERE id = ?';

    
    connection.query(sql, [id], (err, result) => {
        if (err) {
            console.error('Error fetching ticket details:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        
        if (result.length === 0) {
            res.status(404).json({ message: 'Ticket not found' });
            return;
        }
        
        res.status(200).json(result[0]);
    });
});


app.post('/api/tech-support/answer-ticket/:ticketId', upload.single('attachment'), (req, res) => {
    const { ticketId } = req.params;
    const { answerText } = req.body;
    const attachment = req.file ? req.file.filename : null;

    
    const sql = 'INSERT INTO ticket_answers (ticket_id, answer_text, attachment) VALUES (?, ?, ?)';
    connection.query(sql, [ticketId, answerText, attachment], (err, result) => {
        if (err) {
            console.error('Error answering ticket:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(201).json({ message: 'Ticket answered successfully', answerId: result.insertId });
    });
});


app.get('/api/admin/tickets', (req, res) => {
   
    const sql = 'SELECT * FROM tickets WHERE status = "open"';

   
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching open tickets:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        
        res.status(200).json(results);
    });
});



app.get('/api/admin/support-options', (req, res) => {
   
    const sql = 'SELECT id, email FROM users WHERE role = "tech_support"';

   
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching support options:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        
        res.status(200).json(results);
    });
});




app.get('/api/admin/support-options', (req, res) => {
   
    const sql = 'SELECT id, name FROM users WHERE role = "tech_support"';

   
    connection.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching support options:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        
        res.status(200).json(results);
    });
});


app.put('/api/admin/tickets/:ticketId/assign-support', (req, res) => {
    const { ticketId } = req.params;
    const { supportId } = req.body;

    
    const sql = 'UPDATE tickets SET support_id = ? WHERE id = ?';
    connection.query(sql, [supportId, ticketId], (err, result) => {
        if (err) {
            console.error('Error assigning support to ticket:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: `Support assigned to ticket ${ticketId} successfully.` });
    });
});

app.put('/api/admin/tickets/:ticketId/mark-closed', (req, res) => {
    const { ticketId } = req.params;

    
    const sql = 'UPDATE tickets SET status = "Closed" WHERE id = ?';
    connection.query(sql, [ticketId], (err, result) => {
        if (err) {
            console.error('Error marking ticket as closed:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: `Ticket ${ticketId} marked as closed.` });
    });
});

app.put('/api/admin/tickets/:ticketId/mark-resolved', (req, res) => {
    const { ticketId } = req.params;

    
    const sql = 'UPDATE tickets SET status = "Resolved" WHERE id = ?';
    connection.query(sql, [ticketId], (err, result) => {
        if (err) {
            console.error('Error marking ticket as resolved:', err);
            res.status(500).json({ message: 'Internal server error' });
            return;
        }
        res.status(200).json({ message: `Ticket ${ticketId} marked as resolved.` });
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
