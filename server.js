const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require("dotenv").config();

const busRoutes = require('./routes/busRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bus',busRoutes);
app.use('/api/auth',authRoutes); 
app.use('/api/upload',uploadRoutes);

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

