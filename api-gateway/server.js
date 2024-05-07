import dotenv from 'dotenv';
import express  from 'express';
import http from 'http-proxy-middleware';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import cors from 'cors';
import { Storage } from '@google-cloud/storage'

dotenv.config();
const app = express();
app.use(cors());

let publicKey = "";
if( process.env.KEYS_BUCKET)
{
  let cloudStorageService;
  if( process.env.BUCKET_AUT_KEY && fs.existsSync(process.env.BUCKET_AUT_KEY))
    cloudStorageService= new Storage({keyFilename:process.env.BUCKET_AUT_KEY})
  else
    cloudStorageService= new Storage();

  const pubfile = await cloudStorageService.bucket(process.env.KEYS_BUCKET).file(process.env.PUB_KEY_FILE).download();
  publicKey = pubfile.toString('utf8')
}
else
{
  publicKey = fs.readFileSync(process.env.PUB_KEY_FILE, 'utf8');
}

function isAuthenticated(req, res, next) {
    if(!req.headers['authorization']) return res.status(401).json({ error: 'Token Missing' });
    
    const token = req.headers['authorization'].split(' ')[1];
    if (!token) return res.status(401).json({ error: 'Token Missing' });

    jwt.verify(token, publicKey, { algorithms: ['RS256'] }, (err, user) => {
      if (err) 
        return res.status(403).json({ error: 'Invalid Token' });
      return next();
    });
}

app.use(
    '/login',
    http.createProxyMiddleware({
      target: process.env.AUTH_API,
      changeOrigin: true
    }),
);

app.use(
    '/eratostene',isAuthenticated,
    http.createProxyMiddleware({
      target: process.env.ERATOSTENE_API,
      changeOrigin: true,
      pathRewrite: {
        '^/eratostene': '', // Rimuove il percorso "/eratostene" dall'URL inoltrato
      }
    }),
);

app.use(
    '/pigreco',isAuthenticated,
    http.createProxyMiddleware({
      target: process.env.PIGRECO_API,
      changeOrigin: true,
      pathRewrite: {
        '^/pigreco': '', // Rimuove il percorso "/pigreco" dall'URL inoltrato
      }
    }),
);
  
/*404*/
app.use(function(req, res, next) {
    res.status(404).json({ error:'Not Found' });
});
 

var server = app.listen(process.env.PORT, function () {
    var host = server.address().address
    var port = server.address().port
})
  