const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

require("dotenv").config();

const busRoutes = require('./routes/busRoutes');
const authRoutes = require('./routes/authRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const notificationRoutes = require('./routes/notificationRoutes');

const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/bus',busRoutes);
app.use('/api/auth',authRoutes); 
app.use('/api/upload',uploadRoutes);
app.use("/api/notifications",notificationRoutes);

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

app.get('/', (req, res) => {
  res.send('🚍 Bus Tracker API is running');
});


mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`🚀 Server is running on port ${PORT}`);
    });
});


