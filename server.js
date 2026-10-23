const express = require('express');
const cors = require('cors');
const mysql = require('mysql2');

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Chandini@950',
    database: 'todo'
});

db.connect((err) => {
    if (err) {
        console.log("Error connecting to the database:", err.message);
        return;
    }
    console.log("Connected with database");
});


app.get('/', (req, res) => {
    console.log("Default Route hit");
    db.query('SELECT * FROM todoItems', (err, result) => {
        if (err) {
            console.log("Error Occured", err);
            return res.status(500).send({ error: err.message });
        }
        console.log("Data fetched:", result.length, "rows");
        res.send(result);
    });
});


app.post('/add-item', (req, res) => {
    console.log("Request body:", req.body);
    const { text } = req.body;

    if (!text || text.trim() === '') {
        return res.status(400).send({ error: "text is required" });
    }

    db.query('INSERT INTO todoItems(itemDescription) VALUES (?)', [text], (err, results) => {
        if (err) {
            console.log("Error occured", err);
            return res.status(500).send({ error: err.message });
        }
        console.log("Created Successfully with ID:", results.insertId);
        res.send({ message: "Added successfully", id: results.insertId });
    });
});


app.put('/edit-item', (req, res) => {
    console.log('Request body:', req.body);
    const { itemDescription, ID } = req.body;

    if (!itemDescription || !ID) {
        return res.status(400).send({ error: "itemDescription and ID are required" });
    }

    db.query('UPDATE todoItems SET itemDescription = ? WHERE ID = ?', [itemDescription, ID], (err, results) => {
        if (err) {
            console.log("Error occured", err);
            return res.status(500).send({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send({ error: "Item not found" });
        }
        console.log("Updated successfully");
        res.send({ message: "Updated successfully" });
    });
});


app.delete('/delete-item/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM todoItems WHERE ID = ?', [id], (err, results) => {
        if (err) {
            console.log("Error occured", err);
            return res.status(500).send({ error: err.message });
        }
        if (results.affectedRows === 0) {
            return res.status(404).send({ error: "Item not found" });
        }
        res.send({ message: "Deleted successfully" });
    });
});

app.listen(3000, () => {
    console.log("Server Started running on port 3000");
});


