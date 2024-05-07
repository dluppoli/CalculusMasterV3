import dotenv from 'dotenv';
import express  from 'express';
import fs from 'fs'
import bodyParser from 'body-parser'
import jwt from 'jsonwebtoken'
import mysql from 'mysql2';
import crypto from 'crypto';
import { Storage } from '@google-cloud/storage'

dotenv.config();
var app = express();
app.use(bodyParser.json());


let publicKey = "";
let privateKey = "";
if( process.env.KEYS_BUCKET)
{
  let cloudStorageService;
  if( process.env.BUCKET_AUT_KEY && fs.existsSync(process.env.BUCKET_AUT_KEY))
    cloudStorageService= new Storage({keyFilename:process.env.BUCKET_AUT_KEY})
  else
    cloudStorageService= new Storage();

  const pubfile = await cloudStorageService.bucket(process.env.KEYS_BUCKET).file(process.env.PUB_KEY_FILE).download();
  publicKey = pubfile.toString('utf8')

  const prvfile = await cloudStorageService.bucket(process.env.KEYS_BUCKET).file(process.env.PRV_KEY_FILE).download();
  privateKey = prvfile.toString('utf8')
}
else
{
  publicKey = fs.readFileSync(process.env.PUB_KEY_FILE, 'utf8');
  privateKey = fs.readFileSync(process.env.PRV_KEY_FILE, 'utf8');
}

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
  
     connection.query('SELECT * FROM Users WHERE Username = ?;',username,function (error, results, fields) {
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
