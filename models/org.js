const mongoose = require('mongoose');

const OrgSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  description: { type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Org', OrgSchema);
