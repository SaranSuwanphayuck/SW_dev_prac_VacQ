const express = require('express');
const dotenv = require('dotenv');
const res = require('express/lib/response');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');

//Load variables
dotenv.config({path:'./config/config.env'});

//Connect to DB
connectDB();

//Routes
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');


const app = express();
app.use(express.json());
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data:{
            id:1
        }
    })
})
//cookie-parser
app.use(cookieParser());

app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth);


const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`));

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})