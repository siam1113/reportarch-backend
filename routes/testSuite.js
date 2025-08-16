const express = require('express');
const router = express.Router();
const testSuiteController = require('../controllers/testSuiteController');
const Joi = require('joi');
const validate = require('../middleware/validate');

const testSuiteSchema = Joi.object({
  name: Joi.string().required(),
  projectId: Joi.string().required(),
  description: Joi.string().allow(''),
});

router.post('/', validate(testSuiteSchema), testSuiteController.createTestSuite);
router.get('/:id', testSuiteController.getTestSuite);
router.put('/:id', validate(testSuiteSchema), testSuiteController.updateTestSuite);
router.delete('/:id', testSuiteController.deleteTestSuite);

module.exports = router;
