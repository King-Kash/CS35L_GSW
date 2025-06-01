import mongoose from "mongoose";

//Template for individual location documents
const locationSchema = new mongoose.Schema({
  name: {
      type: String,
      required: true,
  },
  location: {
      type: {
          type: String,
          enum: ['Point'],
          required: true,
      },
      coordinates: {
          type: [Number], //[longitude, latitude]
          required: true,
      }
  },
  rating: {
      type: mongoose.Schema.Types.Decimal128,
      required: true,
  },
  reviews: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Review'
  }],
  image: {
      type: String,
      required: false,
  },
  description: {
      type: String,
      required: false,
  },
  tags: [{
      type: String,
      lowercase: true,
      trim: true
  }]
}, {
  timestamps: true //Adds createdAt and updatedAt
});

//Create geospatial index
locationSchema.index({ location: '2dsphere' });

//Location model
const Location = mongoose.model('Location', locationSchema); //Singular and Capital for model name.
export default Location;