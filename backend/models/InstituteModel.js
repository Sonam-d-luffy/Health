import mongoose from "mongoose"

const instituteSchema = new mongoose.Schema({
    name: { type: String, required: true },
    registrationNo: { type: String, required: true, unique: true },
    address: {
        pincode: { type: String, required: true },
        state: { type: String, required: true },
        district: { type: String, required: true },
        local: { type: String, required: true },
        location: {
            type: {
                type: String,
                enum: ['Point'],
                default: 'Point'
            },
            coordinates: {
                type: [Number],
                required: true
            }
        }
    },
    email: { type: String, required: true },
    password: { type: String, required: true },
    phone: { type: String, required: true },
    docs: {
        registration: { type: String, required: true },
        affiliation: { type: String, required: true },
        pan: { type: String, required: true },
        image: { type: String, required: true }
    },
    sports: {
        type: [String],
        required: true
    },
    forGirls: { type: String, required: true, enum: ['Yes', 'No'] }
}, { timestamps: true })

instituteSchema.index({ 'address.location': '2dsphere' })

const Institute = mongoose.model('Institute', instituteSchema)

export default Institute