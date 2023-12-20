import mongoose from 'mongoose'
const moviesScheme = mongoose.Schema({
    episodeId: String,
    name: String,
    releaseDate: String,
    description: String,
    language: String,
    poster: String,
    trailer: String,
    status: String,
    genre: [{genreId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Genre"
    }}],
    cast: [{castId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cast"
    }, as: String, character: String, images: [String]}],
    director: [{castId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Cast"
    }}],
    prducers:[
        {producerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cast"
        }}
    ],
    writers: [
        {writerId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Cast"
        }}
    ],
    duration: String,
    photos: [String],
    videos: [String],
    episodes: [
        {episodeId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Episode"
        }}
    ],
}, {
    timestamps: true
}
)

const Movie = mongoose.model('Movie', moviesScheme);
export default Movie;