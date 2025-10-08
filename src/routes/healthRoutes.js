// File: src/routes/healthRoutes.js
// Generated: 2025-10-08 11:51:12 UTC
// Project ID: proj_b011d78fc681
// Task ID: task_bmtd54awzgos


const express = require('express');


const router = express.Router();

const {
  healthCheck,
  readinessCheck,
  livenessCheck
} = require('../controllers/healthController');

router.get('/', healthCheck);
router.get('/readiness', readinessCheck);
router.get('/liveness', livenessCheck);

module.exports = router;
