const BusOrder = require('../models/BusOrder');

exports.createBusOrder = async (req,res) =>{
    try{
        if(!req.body.clientPhone)
        {
            return res.status(400).json({error:"client phone is required"});
        }
        const newOrder = new BusOrder(req.body);
        await newOrder.save();
        res.status(201).json(newOrder);
    }catch(err){
        res.status(500).json({error:"Failed to create bus order"});
    } 
};

exports.getAllBusOrders = async (req, res) => {
  try {
    const role = req.user.role;
    const username = req.user.username; // we’ll inject this via JWT
    let buses;

    if (role === 'customer') {
      buses = await BusOrder.find({ clientPhone: username });
    } else {
      buses = await BusOrder.find();
    }

    res.status(200).json(buses);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch bus orders" });
  }
};
exports.getBusOrderById = async(req,res)=>{
    try{
        const bus = await BusOrder.findById(req.params.id);
        if(!bus){
            return res.status(404).json({error:"Bus not found"});
        }
        res.status(200).json(bus);
    }catch(err){
        res.status(500).json({error:"Failed to fetch bus order"});
    }
};

exports.updateProgressStage = async (req,res)=>{
    try{
        const {id} = req.params;
        const {progressStage} = req.body;
        const updatedBus = await BusOrder.findByIdAndUpdate(
            id,
            {progressStage},
            {new:true}
        );
        if(!updatedBus){
            return res.status(404).json({error:"Bus order not found"});
        }
        res.status(200).json(updatedBus);
    }catch(err){
        res.status(500).json({error:"Failed to update bus order progress stage"});
    }
};

exports.addProgressLog = async(req,res) =>{
    try {
        const {id}= req.params;
        const {stage,date,remark}=req.body;
        const bus = await BusOrder.findById(id);
        if(!bus) return res.status(404).json({error:"Bus order not found"});
        bus.progressLog.push({stage,date,remark});
        await bus.save();
        res.status(200).json(bus);
    }catch(err){
        res.status(500).json({error:"Failed to add progress log"});
    }
};

exports.uploadBusMedia = async (req, res) => {
  try {
    const { id } = req.params;
    const { url, type } = req.body;

    const bus = await BusOrder.findById(id);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    bus.media.push({ type, url });
    await bus.save();

    res.status(200).json({ success: true, bus });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to upload media' });
  }
};
