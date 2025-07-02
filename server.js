const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require("dotenv").config();

const busRoutes = require('./routes/busRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bus',busRoutes);

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() =>{
    console.log('Connected to MongoDB');
    app.listen(5000,() => {
        console.log('Server is running on port 5000');
    })
})

