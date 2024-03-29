import { eratostene } from './controllers/eratostene.js';
import dotenv from 'dotenv';
import express  from 'express';

dotenv.config();
var app = express();

/*Endpoints*/
app.get('/:n/:s', function (req, res) {
    let n = parseInt(req.params.n);
    let s = parseInt(req.params.s)

    if( isNaN(n) || isNaN(s)) 
        res.status(400).json({ error:'Bad Request' });
    else
        res.send(eratostene(n,s==1))
})

/*404*/
app.use(function(req, res, next) {
    res.status(404).json({ error:'Not Found' });
});
 
/*Avvio Server*/
var server = app.listen(process.env.PORT, function () {
    var host = server.address().address
    var port = server.address().port
})
