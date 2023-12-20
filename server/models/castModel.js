import mongoose from 'mongoose'
const castScheme = mongoose.Schema({
    firstName: String,
    lastName: String,
    gender: String,
    dateOfBirth: String,
    city: String,
    country: String,
    images: [String],
    status: String,
    language: String,
    nationality: String,
    education: String,
    height: String,
    weight: String,
    hair: String,
    description: String,
    role: [String],
}, {
    timestamps: true
}
)

const Cast = mongoose.model('Cast', castScheme);
export default Cast;