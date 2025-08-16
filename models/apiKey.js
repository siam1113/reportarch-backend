const mongoose = require('mongoose');
const crypto = require('crypto');

const ApiKeySchema = new mongoose.Schema({
  key: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  status: { type: String, enum: ['active', 'revoked'], default: 'active' },
  createdAt: { type: Date, default: Date.now },
  lastUsed: { type: Date },
});

ApiKeySchema.statics.generateKey = function () {
  return crypto.randomBytes(32).toString('hex');
};

module.exports = mongoose.model('ApiKey', ApiKeySchema);
