const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
  blogid: {
    type: String,
    required: true,
    unique: true,
  },
  imageName: {
    type: String,
    required: true,
  },
  imageData: {
    type: String,
    required: true,
  },
});

const ImageModel = mongoose.model("images", ImageSchema);

module.exports = ImageModel;
