require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const cors = require('cors');

const sympthom = require('./routes/api/sympthom');

const PORT = process.env.PORT || 3000;

connectDB()

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/sympthom',sympthom);

mongoose.connection.once('open', () => {
    console.log('db connected');

    app.listen(PORT, () => {
        console.log(`server listening at http://localhost:${PORT}`);
    });
});