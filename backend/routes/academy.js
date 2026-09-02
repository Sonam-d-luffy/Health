import express from 'express'
import Institute from '../models/InstituteModel.js'
import Player from '../models/playerModel.js'

const router = express.Router()

router.get('/academy/:id', async (req, res) => {
    const { id } = req.params
    try {
        const aca = await Institute.findById(id)
        if (!aca) return res.status(400).json({ message: 'No Academy' })
        return res.status(200).json({ message: 'Academy found', academy: aca })
    } catch (err) {
        return res.status(500).json({ message: 'Server error', error: err.message })
    }
})

router.get('/academies', async (req, res) => {
    try {
        const {
            search = '',
            sport = '',
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query

        const pageNumber = Math.max(parseInt(page) || 1, 1)
        const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100)
        const skip = (pageNumber - 1) * limitNumber

        const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'city', 'state']
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
        const sortOrder = order === 'asc' ? 1 : -1

        const filter = {}

        if (search.trim()) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { sports: { $regex: search.trim(), $options: 'i' } },
                { city: { $regex: search.trim(), $options: 'i' } },
                { state: { $regex: search.trim(), $options: 'i' } },
                { address: { $regex: search.trim(), $options: 'i' } }
            ]
        }

        if (sport.trim()) {
            filter.sports = { $regex: sport.trim(), $options: 'i' }
        }

        const total = await Institute.countDocuments(filter)

        const institutes = await Institute.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limitNumber)

        return res.status(200).json({
            success: true,
            institutes,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
                hasNextPage: pageNumber < Math.ceil(total / limitNumber),
                hasPreviousPage: pageNumber > 1
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        })
    }
})

router.get('/matchingAcademy/:userId', async (req, res) => {
    const { userId } = req.params

    try {
        const {
            search = '',
            sport = '',
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query

        const user = await Player.findById(userId)

        if (!user) {
            return res.status(404).json({ message: 'User not found' })
        }

        const userSports = user.sports || []

        const pageNumber = Math.max(parseInt(page) || 1, 1)
        const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100)
        const skip = (pageNumber - 1) * limitNumber

        const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'city', 'state']
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
        const sortOrder = order === 'asc' ? 1 : -1

        const filter = {
            sports: { $in: userSports }
        }

        if (search.trim()) {
            filter.$and = [
                {
                    $or: [
                        { name: { $regex: search.trim(), $options: 'i' } },
                        { sports: { $regex: search.trim(), $options: 'i' } },
                        { city: { $regex: search.trim(), $options: 'i' } },
                        { state: { $regex: search.trim(), $options: 'i' } },
                        { address: { $regex: search.trim(), $options: 'i' } }
                    ]
                }
            ]
        }

        if (sport.trim()) {
            filter.sports = {
                $in: userSports,
                $regex: sport.trim(),
                $options: 'i'
            }
        }

        const total = await Institute.countDocuments(filter)

        const matchingAcademies = await Institute.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limitNumber)

        return res.status(200).json({
            success: true,
            academies: matchingAcademies,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
                hasNextPage: pageNumber < Math.ceil(total / limitNumber),
                hasPreviousPage: pageNumber > 1
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        })
    }
})

router.get('/girls', async (req, res) => {
    try {
        const {
            forGirls = 'Yes',
            search = '',
            sport = '',
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query

        const pageNumber = Math.max(parseInt(page) || 1, 1)
        const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100)
        const skip = (pageNumber - 1) * limitNumber

        const allowedSortFields = ['name', 'createdAt', 'updatedAt', 'city', 'state']
        const sortField = allowedSortFields.includes(sortBy) ? sortBy : 'createdAt'
        const sortOrder = order === 'asc' ? 1 : -1

        const filter = { forGirls }

        if (search.trim()) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { sports: { $regex: search.trim(), $options: 'i' } },
                { city: { $regex: search.trim(), $options: 'i' } },
                { state: { $regex: search.trim(), $options: 'i' } },
                { address: { $regex: search.trim(), $options: 'i' } }
            ]
        }

        if (sport.trim()) {
            filter.sports = { $regex: sport.trim(), $options: 'i' }
        }

        const total = await Institute.countDocuments(filter)

        const institutes = await Institute.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limitNumber)

        return res.status(200).json({
            success: true,
            message: 'Institutes for girls',
            institutes,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
                hasNextPage: pageNumber < Math.ceil(total / limitNumber),
                hasPreviousPage: pageNumber > 1
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        })
    }
})

router.get('/nearby', async (req, res) => {
    try {
        const {
            latitude,
            longitude,
            radius = 10000,
            search = '',
            sport = '',
            page = 1,
            limit = 10
        } = req.query

        if (!latitude || !longitude) {
            return res.status(400).json({
                success: false,
                message: 'Latitude and longitude are required'
            })
        }

        const lat = parseFloat(latitude)
        const lng = parseFloat(longitude)
        const radiusInMeters = Math.min(parseInt(radius) || 10000, 100000)

        if (isNaN(lat) || isNaN(lng)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid latitude or longitude'
            })
        }

        const pageNumber = Math.max(parseInt(page) || 1, 1)
        const limitNumber = Math.min(Math.max(parseInt(limit) || 10, 1), 100)
        const skip = (pageNumber - 1) * limitNumber

        const filter = {
            location: {
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [lng, lat]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        }

        if (search.trim()) {
            filter.$or = [
                { name: { $regex: search.trim(), $options: 'i' } },
                { sports: { $regex: search.trim(), $options: 'i' } },
                { city: { $regex: search.trim(), $options: 'i' } },
                { state: { $regex: search.trim(), $options: 'i' } },
                { address: { $regex: search.trim(), $options: 'i' } }
            ]
        }

        if (sport.trim()) {
            filter.sports = { $regex: sport.trim(), $options: 'i' }
        }

        const institutes = await Institute.find(filter)
            .skip(skip)
            .limit(limitNumber)

        const countFilter = { ...filter }
        delete countFilter.location

        const total = await Institute.countDocuments({
            ...countFilter,
            location: {
                $geoWithin: {
                    $centerSphere: [
                        [lng, lat],
                        radiusInMeters / 6378137
                    ]
                }
            }
        })

        return res.status(200).json({
            success: true,
            message: 'Nearby institutes found',
            institutes,
            location: {
                latitude: lat,
                longitude: lng,
                radius: radiusInMeters
            },
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
                hasNextPage: pageNumber < Math.ceil(total / limitNumber),
                hasPreviousPage: pageNumber > 1
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        })
    }
})
router.get('/search-address', async (req, res) => {
    try {
        const {
            address,
            radius = 10000,
            search = '',
            sport = '',
            page = 1,
            limit = 10,
            sortBy = 'createdAt',
            order = 'desc'
        } = req.query

        if (!address || !address.trim()) {
            return res.status(400).json({
                success: false,
                message: 'Address is required'
            })
        }

        const geoResponse = await fetch(
            `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${process.env.OPENCAGE_API_KEY}&limit=1`
        )

        const geoData = await geoResponse.json()

        if (!geoData.results || geoData.results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'Address not found'
            })
        }

        const latitude = geoData.results[0].geometry.lat
        const longitude = geoData.results[0].geometry.lng
        const formattedAddress = geoData.results[0].formatted

        const radiusInMeters = Math.min(
            parseInt(radius) || 10000,
            100000
        )

        const pageNumber = Math.max(parseInt(page) || 1, 1)
        const limitNumber = Math.min(
            Math.max(parseInt(limit) || 10, 1),
            100
        )

        const skip = (pageNumber - 1) * limitNumber

        const allowedSortFields = [
            'name',
            'createdAt',
            'updatedAt',
            'city',
            'state'
        ]

        const sortField = allowedSortFields.includes(sortBy)
            ? sortBy
            : 'createdAt'

        const sortOrder = order === 'asc' ? 1 : -1

        const filter = {
            'address.location': {
    
                $near: {
                    $geometry: {
                        type: 'Point',
                        coordinates: [longitude, latitude]
                    },
                    $maxDistance: radiusInMeters
                }
            }
        }

        if (search.trim()) {
            filter.$and = [
                {
                    $or: [
                        { name: { $regex: search.trim(), $options: 'i' } },
                        { sports: { $regex: search.trim(), $options: 'i' } },
                        { city: { $regex: search.trim(), $options: 'i' } },
                        { state: { $regex: search.trim(), $options: 'i' } },
                        { address: { $regex: search.trim(), $options: 'i' } }
                    ]
                }
            ]
        }

        if (sport.trim()) {
            filter.sports = {
                $regex: sport.trim(),
                $options: 'i'
            }
        }

        const institutes = await Institute.find(filter)
            .sort({ [sortField]: sortOrder })
            .skip(skip)
            .limit(limitNumber)

   const countFilter = {
    ...filter,
    'address.location': {
        $geoWithin: {
            $centerSphere: [
                [longitude, latitude],
                radiusInMeters / 6378137
            ]
        }
    }
}

        const total = await Institute.countDocuments(countFilter)

        return res.status(200).json({
            success: true,
            message: 'Institutes found near searched address',
            searchedAddress: formattedAddress,
            coordinates: {
                latitude,
                longitude
            },
            institutes,
            pagination: {
                total,
                page: pageNumber,
                limit: limitNumber,
                totalPages: Math.ceil(total / limitNumber),
                hasNextPage: pageNumber < Math.ceil(total / limitNumber),
                hasPreviousPage: pageNumber > 1
            }
        })
    } catch (err) {
        console.error(err)
        return res.status(500).json({
            success: false,
            message: 'Server error',
            error: err.message
        })
    }
})
export default router