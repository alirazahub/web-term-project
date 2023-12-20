import mongoose from 'mongoose'
const genereScheme = mongoose.Schema({
    name: String,
}, {
    timestamps: true
}
)

const Genere = mongoose.model('Genere', genereScheme);
export default Genere;