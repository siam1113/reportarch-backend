const TestSuite = require('../models/testSuite');

exports.createTestSuite = async (req, res) => {
  try {
    const testSuite = await TestSuite.create(req.body);
    res.status(201).json(testSuite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.getTestSuite = async (req, res) => {
  try {
    const testSuite = await TestSuite.findById(req.params.id);
    if (!testSuite) return res.status(404).json({ error: 'Test Suite not found' });
    res.json(testSuite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.updateTestSuite = async (req, res) => {
  try {
    const testSuite = await TestSuite.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!testSuite) return res.status(404).json({ error: 'Test Suite not found' });
    res.json(testSuite);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

exports.deleteTestSuite = async (req, res) => {
  try {
    const testSuite = await TestSuite.findByIdAndDelete(req.params.id);
    if (!testSuite) return res.status(404).json({ error: 'Test Suite not found' });
    res.json({ message: 'Test Suite deleted' });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
