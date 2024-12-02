require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./src/config/dbConn');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./src/config/corsOptions');
const credentials = require('./src/middlewares/credentials');
const verifyJWT = require('./src/middlewares/verifyJWT');
const cookieParser = require('cookie-parser');
const PORT = 3000;

// connecting to database
connectDB()

// custom cors
app.use(cors(corsOptions));
// allow sending cookies with certain origins
app.use(credentials);

// third party middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

// api routes
app.use('/register', require('./src/routes/register'));
app.use('/auth', require('./src/routes/auth'));
app.use('/logout', require('./src/routes/logout'));
app.use('/refresh', require('./src/routes/refresh'));
// this will be protected
// app.use(verifyJWT);
app.use('/disease', require('./src/routes/api/sympthom'));
app.use('/expert', require('./src/routes/api/expert'));
app.use('/user', require('./src/routes/api/user'));

mongoose.connection.once('open', () => {
    console.log('db connected');

    app.listen(PORT, () => {
        console.log(`server listening at http://localhost:${PORT}`);
    });
});

module.exports = app;