const express = require('express');
const dotenv = require('dotenv');
const res = require('express/lib/response');
const connectDB = require('./config/db');
const cookieParser = require('cookie-parser');
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const xss = require('xss-clean');
const rateLimit = require('express-rate-limit');
const hpp = require('hpp');
const cors = require('cors');
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUI = require('swagger-ui-express');

//Load variables
dotenv.config({path:'./config/config.env'});

//Connect to DB
connectDB();

//Routes
const hospitals = require('./routes/hospitals');
const auth = require('./routes/auth');
const appointments = require('./routes/appointment');


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

//Prevent NoSQL injection and Sanitize data
app.use(mongoSanitize());

//Set security helmet
app.use(helmet());

//Prevent XSS attacks (Cross site scripting)
app.use(xss());

//rate limiter
const limiter = rateLimit({
    wondowsMs: 10*60*1000, //10mins
    max: 100
})
app.use(limiter);

//prevent http param pollution
app.use(hpp());

//Enable CORS
app.use(cors());

//routers
app.use('/api/v1/hospitals', hospitals);
app.use('/api/v1/auth', auth);
app.use('/api/v1/appointments', appointments);

//swagger
const swaggerOption = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Library API',
            version: '1.0.0',
            description: 'A simple VacQ API'
        },
        servers: [
            {
                url: 'http://localhost:3000/api/v1'
            }
        ]
    },
    apis: ['./routes/*.js'],
};

const swaggerDoc = swaggerJsDoc(swaggerOption);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDoc));

const server = app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`));

//Handle unhandled promise rejection
process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`);
    server.close(() => process.exit(1));
})