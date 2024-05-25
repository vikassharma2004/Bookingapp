const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const placeSchema = new Schema({
    owner:{type:Schema.Types.ObjectId, ref:'User'},
  title: String,
  address: String,
  description: String,
  photos: [String],
  perks: [String],
  extraInfo: String,
  checkIn:Number,
  checkOut:Number,
  maxGuests:Number,
  price:Number
});

const PlaceModel=mongoose.model("Place",placeSchema  );
module.exports=PlaceModel;