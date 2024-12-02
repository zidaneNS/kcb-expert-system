require('dotenv').config();

const express = require('express');
const app = express();
const connectDB = require('./config/dbConn');
const mongoose = require('mongoose');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const credentials = require('./middlewares/credentials');
const verifyJWT = require('./middlewares/verifyJWT');
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
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/logout', require('./routes/logout'));
app.use('/refresh', require('./routes/refresh'));
// this will be protected
app.use(verifyJWT);
app.use('/disease', require('./routes/api/sympthom'));
app.use('/expert', require('./routes/api/expert'));
app.use('/user', require('./routes/api/user'));

mongoose.connection.once('open', () => {
    console.log('db connected');

    app.listen(PORT, () => {
        console.log(`server listening at http://localhost:${PORT}`);
    });
    module.exports = app;
});
