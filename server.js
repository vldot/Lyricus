const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get('/callback', (req, res) => {
    res.sendFile(__dirname + '/callback.html');
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
