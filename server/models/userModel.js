import mongoose from 'mongoose'
const userScheme = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
    gender: String,
    dateOfBirth: String,
    address: String,
    city: String,
    country: String,
    image: String,
    role: String,
    status: String,
    language: String,
}, {
    timestamps: true
}
)

const User = mongoose.model('User', userScheme);
export default User;