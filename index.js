const express = require('express');
const app = express();           
const port = 5000;

app.use('/public', express.static(__dirname+'/public'));
app.use('/home', express.static(__dirname+'/home'));
app.use('/login', express.static(__dirname+'/login'));
app.use('/services', express.static(__dirname+'/services'));
app.use('/utils', express.static(__dirname+'/utils'));

app.get('/', (req, res) => { 
    res.sendFile('/home/index.html', {root: __dirname});
});

app.get('/login', (req, res) => { 
    res.sendFile('/login/login.html', {root: __dirname});
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});