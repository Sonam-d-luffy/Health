import axios from 'axios'
import dotenv from 'dotenv'
dotenv.config()

const OPENCAGE_API_KEY = process.env.OPENCAGE_API_KEY;

export const getCoords = async (pincode) => {
    try {
        const res = await axios.get(
            "https://api.opencagedata.com/geocode/v1/json",
            {
                params: {
                    q: `${pincode}, India`,
                    key: OPENCAGE_API_KEY,
                    limit: 1
                }
            }
        );


        if (res.data.results?.length > 0) {
            const { lat, lng } = res.data.results[0].geometry;


            return {
                latitude: lat,
                longitude: lng
            };
        }


        return {
            latitude: null,
            longitude: null
        };

    } catch (error) {
        console.error(
            "OpenCage Error:",
            error.response?.data || error.message
        );

        return {
            latitude: null,
            longitude: null
        };
    }
};
export const getLocationFromPincode = async (pincode) => {
    try {
        if (!pincode) {
            throw new Error('Pincode is required')
        }

        const res = await axios.get(
            `https://api.postalpincode.in/pincode/${String(pincode).trim()}`
        )

        console.log('API Response:', res.data)

        const data = res.data?.[0]

        if (data?.Status !== 'Success' || !data?.PostOffice?.length) {
            throw new Error('Invalid pincode')
        }

        const postOffice = data.PostOffice[0]

        return {
            state: postOffice.State,
            district: postOffice.District
        }

    } catch (error) {
        console.error('Pincode Error:', error.response?.data || error.message)
        throw error
    }
}