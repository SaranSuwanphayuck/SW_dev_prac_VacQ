const Hospital = require('../models/Hospital');

//@desc Get all hospitals
//@route GET /api/v1/hospitals
//@access Public
exports.getHospitals = async (req, res, next) => {
    try{
        let query;

        const reqQuery = { ...req.query };

        //excluded fields
        const removeFields = ['select', 'sort', 'page', 'limit'];

        removeFields.forEach(param => {
            delete reqQuery[param];
        });

        let queryStr = JSON.stringify(reqQuery);
        //replace to match sort syntax
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
        
        query = Hospital.find(JSON.parse(queryStr));

        //Select
        if (req.query.select) {
            //match nosql syntax
            const fields = req.query.select.split(',').join(' ');
            query = query.select(fields);
        }
        
        //Sort
        if (req.query.sort) {
            //match NoSQL syntax
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else {
            query = query.sort('-createdAt');
        }

        //Pagination
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 25;
        const startIndex = (page-1) * limit;
        const endIndex = page * limit;
        const total = await Hospital.countDocuments();

        query = query.skip(startIndex).limit(limit);

        //executing query
        const hospitals = await query;

        //pagination result
        const pagination = {};

        if (endIndex < total) {
            pagination.next = {
                page: page+1,
                limit
            }
        }

        if(startIndex>0) {
            pagination.prev = {
                page: page-1,
                limit
            }
        }

        //return status
        res.status(200).json({
            success: true,
            count: hospitals.length,
            pagination,
            data: hospitals
        });
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err
        });
    }
}
//@desc Get one hospital
//@route GET /api/v1/hospital/:id
//@access Public
exports.getHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findById(req.params.id);
        
        if(!hospital){
            res.status(400).json({
                success: false
            });
        }

        res.status(200).json({
            success: true,
            data: hospital
        });
    } catch(err) {
        res.status(400).json({
            success: false,
            error: err
        });
    }
}

//@desc Create a hospital
//@route POST /api/v1/hospitals
//@access Private
exports.createHospital = async (req, res, next) => {
    const hospital = await Hospital.create(req.body);
    res.status(201).json({
        success: true,
        data: hospital
    })
}

//@desc Update a hospital
//@route PUT /api/v1/hospitals/:id
//@access Private
exports.updateHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!hospital) {
            res.status(400).json({
                success: false
            })
        }

        res.status(200).json({
            success: true,
            data: hospital
        })
    } catch (err) {
        res.status(400).json({
            success: false,
            error: err
        })
    }
}

//@desc Delete a hospital
//@route DELETE /api/v1/hospitals/:id
//@access Private
exports.deleteHospital = async (req, res, next) => {
    try {
        const hospital = await Hospital.findByIdAndDelete(req.params.id);

        if(!hospital) {
            return res.status(400).json({
                success: false
            })
        }

        res.status(200).json({
            success: true,
            data: {}
        })
    } catch(err) {
        res.status(200).json({
            success: false,
            error: err
        })
    }
}
