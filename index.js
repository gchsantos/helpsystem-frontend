const express = require('express');
const app = express();           
const port = 5000;

app.use(express.static(__dirname+'/public'));
app.use(express.static(__dirname+'/home'));
app.use(express.static(__dirname+'/login'));

app.get('/', (req, res) => { 
    res.sendFile('/home/index.html', {root: __dirname});
});

app.get('/login', (req, res) => { 
    res.sendFile('/login/login.html', {root: __dirname});
});

app.listen(port, () => {            //server starts listening for any attempts from a client to connect at port: {port}
    console.log(`Now listening on port ${port}`); 
});