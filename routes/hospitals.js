const express = require('express');
const router = express.Router();
const {getHospitals, getHospital, createHospital, updateHospital, deleteHospital} = require('../controllers/hospitals');
const {protect, authorize} = require('../middleware/auth');

//Include appointment routers
const appointmentRouter = require('./appointment');

//Re-route into other routers
router.use('/:hospitalId/appointments/', appointmentRouter);

router.route('/').get(getHospitals).post(protect, authorize('admin'), createHospital);
router.route('/:id').get(getHospital).put(protect, authorize('admin'), updateHospital).delete(protect, authorize('admin'), deleteHospital);


module.exports = router;