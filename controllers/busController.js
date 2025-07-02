const BusOrder = require('../models/BusOrder');

exports.createBusOrder = async (req,res) =>{
    try {
        const newOrder = new BusOrder(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    }catch(err){
        res.status(500).json({error:"Failed to create bus order"});
    }
};  