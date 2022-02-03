//@desc Get all hospitals
//@route GET /api/v1/hospitals
//@access Public
exports.getHospitals = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Show all hospitals'
    })
}

//@desc Get one hospital
//@route GET /api/v1/hospital/:id
//@access Public
exports.getHospital = (req, res, next) => {
    res.status(200).json({
        success: true,
        mas: `Show hospital ${req.params.id}`
    })
}

//@desc Create a hospital
//@route POST /api/v1/hospitals
//@access Public
exports.createHospital = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: 'Create a hospital'
    })
}

//@desc Update a hospital
//@route PUT /api/v1/hospitals/:id
//@access Private
exports.updateHospital = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Update hospital ${req.params.id}`
    })
}

//@desc Delete a hospital
//@route DELETE /api/v1/hospitals/:id
//@access Private
exports.deleteHospital = (req, res, next) => {
    res.status(200).json({
        success: true,
        msg: `Delete hospital ${req.params.id}`
    })
}
