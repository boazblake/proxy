const mongoose = require('mongoose');

// ----------------------
// USERS
// ----------------------
const userSchema = new mongoose.Schema({
  // required for authentication: DO NOT TOUCH Or You May Get Punched
  email:     { type: String, required: true },
  password:  { type: String, required: true },
  // x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x..x

   // example of optional fields
  name:      { type: String },
  createdAt: { type: Date, default: Date.now }

})

module.exports = mongoose.model('User', userSchema)