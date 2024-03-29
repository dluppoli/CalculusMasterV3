import dotenv from 'dotenv';
import express  from 'express';
import fs from 'fs'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2';
import crypto from 'crypto';

dotenv.config();
var app = express();
app.use(bodyParser.json());

const privateKey = fs.readFileSync('../private.key', 'utf8');
const publicKey = fs.readFileSync('../public.key', 'utf8');

/*Auth Functions*/
function isAuthenticated(req, res, next) {
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) {
      return res.status(401).json({ error: 'Token Missing' });
    }

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid Token' });
      }
      return next();
    });
}

/*Endpoints*/
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    const connection = mysql.createConnection({
        host: process.env.DB_HOST,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        database: process.env.DB
     });
     connection.connect();
  
     connection.query('SELECT * FROM Users WHERE username = ?',username,function (error, results, fields) {
        if(error) throw error;
        if(results.length==0) return res.status(401).json({ error: 'Incorrect username or password' });
        
        let candidate = crypto.createHash('sha512').update(password + results[0].Salt).digest('hex').toUpperCase();
        if( results[0].Password != candidate) return res.status(401).json({ error: 'Incorrect username or password' });
  
        const token = jwt.sign({ username }, privateKey, { algorithm: 'RS256' });
        return res.json({ token });
     });
});

/*404*/
app.use(function(req, res, next) {
    res.status(404).json({ error:'Not Found' });
});
 
/*Avvio Server*/
var server = app.listen(process.env.PORT, function () {
    var host = server.address().address
    var port = server.address().port
})
