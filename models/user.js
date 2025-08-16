const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Member', 'Admin'], default: 'Member' },
  orgs: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Org' }],
  projects: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Project' }],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('User', UserSchema);
