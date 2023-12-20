import mongoose from 'mongoose'
const moviesScheme = mongoose.Schema({
    name: String,
    releaseDate: String,
    description: String,
    language: String,
    classification: String,
    poster: String,
    genere: [String],
    allCast: [{id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cast"
    }, characterName: String, character: String}],
    director: [String],
    prducer:[String],
    writer: [String],
    duration: String,
    photos: [String],
    trailer: String,
    reviews:[
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            rating: String,
            review: String
        }
    ]
}, {
    timestamps: true
}
)

const Movie = mongoose.model('Movie', moviesScheme);
export default Movie;