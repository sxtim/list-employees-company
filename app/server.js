const express = require('express');
const app =express();
var http = require('http');
const https = require('https')
const www = process.env.WWW || './dist';
var fs = require('fs');

const httpsOptions = {
    key: fs.readFileSync('./ssl/localhost.key'),
    cert: fs.readFileSync('./ssl/localhost.crt')
}

app.use(express.static(www));
console.log(`serving ${www}`);
app.get('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});
app.post('*', (req, res) => {
    res.sendFile(`index.html`, { root: www });
});
http.createServer(app).listen(3000);

https.createServer(httpsOptions, app).listen(3001)
