import mongoose from 'mongoose'
const userScheme = mongoose.Schema({
    name: String,
    email: {
        type: String,
        unique: true,
    },
    password: String,
}, {
    timestamps: true
}
)

const Admin = mongoose.model('Admin', userScheme);
export default Admin;