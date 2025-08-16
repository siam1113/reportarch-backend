const mongoose = require('mongoose');

const TestSuiteSchema = new mongoose.Schema({
  name: { type: String, required: true },
  projectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Project', required: true },
  description: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('TestSuite', TestSuiteSchema);
