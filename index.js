const express = require('express');
const app = express();
require('dotenv').config();
require('./connection/connection.js')
const user = require('./routes/user.js');

app.use(express.json())
app.use('/api/v1', user);

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})