const mongoose = require("mongoose");

const Schema = mongoose.Schema

const CategoriesSchema = new Schema({
  name: {type: String, required: true, maxLength: 100},
  description: { type: String, maxLength: 100}

});

CategoriesSchema.virtual("url").get(function () {
  return `/catalog/categories/${this.name}/${this._id}`
})

module.exports = mongoose.model("Categories", CategoriesSchema)