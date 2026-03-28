const mongoose = require("mongoose");

const saleSchema = new mongoose.Schema({
  product:{type:mongoose.Schema.Types.ObjectId, ref:"Product"},
  quantity:Number,
  totalAmount:Number,
  soldBy:{type:mongoose.Schema.Types.ObjectId, ref:"User"}
},{timestamps:true});

module.exports = mongoose.model("Sale", saleSchema);