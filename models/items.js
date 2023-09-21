const mongoose = require("mongoose");

const Schema = mongoose.Schema

const ItemsSchema = new Schema({
  name: {type: String, required: true, maxLength: 100},
  description: { type: String, required: true, maxLength: 100},
  category: { type: Schema.Types.ObjectId, ref: "Categories", required: true },
  price: { type: Number},
  stock: {type: Number},
});

ItemsSchema.virtual("url").get(function () {
  return `/catalog/item/${this._id}`
})

module.exports = mongoose.model("Items", ItemsSchema)