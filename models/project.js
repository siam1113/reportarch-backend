const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  name: { type: String, required: true },
  orgId: { type: mongoose.Schema.Types.ObjectId, ref: 'Org', required: true },
  description: { type: String },
  users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
}, { timestamps: true });

module.exports = mongoose.model('Project', ProjectSchema);
