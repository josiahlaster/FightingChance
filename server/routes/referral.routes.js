const express = require('express');
const { submitReferral } = require('../controllers/referral.controller');

const router = express.Router();

router.post('/', submitReferral);

module.exports = router;
