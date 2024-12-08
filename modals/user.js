import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    default: true,
    required: true,
  },
  profilePic: {
    type: String,
    required: false,
  },
});

const User = mongoose.model("AugBatchIITHUsers", userSchema);
export default User;
