const express=require('express');
const cors=require('cors');
const mysql = require('mysql2');         

const app=express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({      
    host: 'localhost',
    user: 'root',
    password: 'Chandini@950',
    database: 'todo'
});

db.connect((err) => {
    if (err) return console.log("DB error:", err.message);
    console.log("Connected with database");
});



// const middleware= (req,res,next)=>{
//     console.log("Middleware is added")
//     next();
// };
// app.use(middleware); 

//now every route is logged automatically no need to write console.log inside any route anymore
const requestLogger=(req,res,next)=>{
    console.log("Request arrived at:",req.method,req.url)
    next();
};
app.use(requestLogger);

//checks text exists or not 
const validateText = (req, res, next) => {
    const raw = req.body?.text;
    if (typeof raw !== 'string' || raw.trim() === '') {
        return res.status(400).send({ error: "text is required" });
    }
    req.body.text = raw.trim();  // so "  buy milk  " becomes "buy milk" in DB  for cleaning
    next();
};  
//this validates the text and trims it before passing to the next middleware or route handler 
//also we removed app.use(validateText) because we want to use it only for specific routes not for all routes 




// app.get('/hello',(req,res)=>{
//     res.send("Hello World");
// })
app.get('/items', (req, res) => {
    db.query('SELECT * FROM todoItems', (error, results) => {
        if (error) {
            console.log("SELECT FAILED:", error);
            return res.status(500).send({ error: error.message });
        }
        console.log("FOUND", results.length, "items");
        res.send(results);
    });
});

app.post('/insert-item',validateText,(req,res)=>{
    const {text}=req.body;
    db.query('INSERT INTO todoItems(itemDescription) VALUES (?)',[text],(error,result)=>{
        if(error){
            console.log("Error occured",error)
            return res.status(500).send({error:error.message});
        }
        res.send({message:"Added successfully",id:result.insertId})
    });
});

app.listen(3001,()=>{
    console.log("Server is running on port 3001")
})




//middleware--req logger,vadidate text,