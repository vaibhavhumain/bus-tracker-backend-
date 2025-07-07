const mongoose = require('mongoose');

const busOrderSchema = new mongoose.Schema({
    clientName:String,
    clientPhone:String,
    busNumber:String,
    progressStage:{type:String,default:"Not Started"},
    estimatedCompletion:Date,
    progressLog: [
        {
            stage:String,
            date:Date,
            remark:String
        }
    ],
    media:[
        {
        type:{type:String},
        url:String,
        }
        
    ], 
    progressPdf: {
  type: Buffer,
},
contentType: {
  type: String,
  default: 'application/pdf',
},
},{timestamps:true})

module.exports = mongoose.model('BusOrder',busOrderSchema);
