const express = require('express');
const dotenv = require('dotenv');
const res = require('express/lib/response');
//Load variables
dotenv.config({path:'./config/config.env'});

const app = express();
const PORT = process.env.PORT;

app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        data:{
            id:1
        }
    })
})

app.listen(PORT, console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}.`));