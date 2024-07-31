import mongoose, { Schema } from "mongoose";

// Define a schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Name is required'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email is already used'],
  },
  password: {
    type: String,
    required: true
  },
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  },
  isVerifiedEmail: {
    type: Boolean,
    default: false
  },
  verificationToken: {
    type: String
  },
  verificationTokenExpire: {
    type: Date
  },
  favoritePosts: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    }
  ]
});

// Create an index on resetPasswordToken and resetPasswordExpires
userSchema.index({ resetPasswordToken: 1, resetPasswordExpires: 1 });

// Create a model
const User = mongoose.model('User', userSchema);

// Export the model
export default User;