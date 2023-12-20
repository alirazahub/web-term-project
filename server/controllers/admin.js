import asyncHandler from 'express-async-handler'
import jwt from 'jsonwebtoken'
import Admin from '../models/adminModel.js';
import User from '../models/userModel.js';
import bcrypt from 'bcryptjs'
import Genere from '../models/genereModel.js';
import Cast from '../models/castModel.js';
import Movie from '../models/movieModel.js';

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await Admin.findOne({ email })
        if (!user) {
            res.status(400).json({ message: 'Admin does not exist', status: false })
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            res.status(400).json({ message: 'Invalid credentials', status: false })
        }
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '30d' })
        res.cookie('x-auth-admin', token, { httpOnly: true, maxAge: 30 * 24 * 60 * 60 * 1000 })
        res.status(200).json({ message: 'Login successful', token, status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})
export const register = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const user = await Admin.findOne({ email })
        if (user) {
            res.status(400).json({ message: 'Admin already exists', status: false })
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)
        const newUser = await Admin.create({
            name,
            email,
            password: hashedPassword
        })
        await newUser.save()
        res.status(201).json({ message: 'Admin created successfully', status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const verify = asyncHandler(async (req, res) => {
    const admin = await Admin.findById(req.admin.id)
    if (admin) {
        res.status(200).json({ admin, status: true })
    }
    else {
        res.status(401).json({ message: "Invalid Admin Data!" })
    }
})

export const allUsers = asyncHandler(async (req, res) => {
    const users = await User.find({}).sort({ createdAt: -1 })
    if (users) {
        res.status(200).json({ users, status: true })
    }
    else {
        res.status(401).json({ message: "Invalid Admin Data!" })
    }
})

export const deleteUser = asyncHandler(async (req, res) => {
    try {
        await User.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'User deleted successfully', status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const addNewUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, gender, city } = req.body;

    try {
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(email, salt)
        const newUser = await User.create({
            firstName,
            lastName,
            email,
            gender,
            city,
            password: hashedPassword
        })
        const user = await newUser.save()

        res.status(201).json({ message: 'User created successfully', user, status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const addGenere = asyncHandler(async (req, res) => {
    const { name } = req.body;

    try {
        const newGenere = await Genere.create({
            name
        })
        const genere = await newGenere.save()

        res.status(201).json({ message: 'Genere created successfully', genere, status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const allGeneres = asyncHandler(async (req, res) => {
    const generes = await Genere.find({}).sort({ createdAt: -1 })
    if (generes) {
        res.status(200).json({ generes, status: true })
    }
    else {
        res.status(401).json({ message: "Invalid Admin Data!" })
    }
})

export const updateGenere = asyncHandler(async (req, res) => {
    try {
        const genere = await Genere.findById(req.params.id)
        if (genere) {
            genere.name = req.body.name || genere.name

            const updatedGenere = await genere.save()
            res.status(200).json({ message: 'Genere updated successfully', genere: updatedGenere, status: true })
        }
        else {
            res.status(401).json({ message: "Invalid Admin Data!" })
        }
    } catch (error) {

    }
})
export const deleteGenere = asyncHandler(async (req, res) => {
    try {
        await Genere.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'Genere deleted successfully', status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const addCast = asyncHandler(async (req, res) => {
    try {
        const newCast = await Cast.create(req.body)
        const cast = await newCast.save()

        res.status(201).json({ message: 'Cast created successfully', cast, status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const allCasts = asyncHandler(async (req, res) => {
    const casts = await Cast.find({}).sort({ createdAt: -1 })
    if (casts) {
        res.status(200).json({ casts, status: true })
    }
    else {
        res.status(401).json({ message: "Invalid Admin Data!" })
    }
})

export const deleteCast = asyncHandler(async (req, res) => {
    try {
        await Cast.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'Cast deleted successfully', status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const addMovie = asyncHandler(async (req, res) => {
    const { durationHRS, durationMINS } = req.body
    try {
        req.body.duration = `${durationHRS}h ${durationMINS}m`
        const newMovie = await Movie.create(req.body)
        const movie = await newMovie.save()

        res.status(201).json({ message: 'Movie created successfully', movie, status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})

export const allMovies = asyncHandler(async (req, res) => {
    const movies = await Movie.find({})
        .populate('allCast.id')
        .sort({ createdAt: -1 });

    if (movies) {
        const allPromises = movies.map(async (movie) => {
            const generess = [], prducerss = [], writerss = [], directorss = []
            for (const genere of movie.genere) {
                const genereData = await Genere.findById(genere);
                generess.push(genereData);
            }
            for (const prducer of movie.prducer) {
                const prducerData = await Cast.findById(prducer);
                prducerss.push(prducerData);
            }
            for (const writer of movie.writer) {
                const writerData = await Cast.findById(writer);
                writerss.push(writerData);
            }
            for (const director of movie.director) {
                const directorData = await Cast.findById(director);
                directorss.push(directorData);
            }
            const newMovie = {
                ...movie._doc,
                genere: generess,
                prducer: prducerss,
                writer: writerss,
                director: directorss
            }

            return newMovie;
        });
        const moviess = await Promise.all(allPromises);
        res.status(200).json({ movies: moviess, status: true });
    } else {
        res.status(401).json({ message: "Invalid Admin Data!" });
    }
});

export const movie = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.id)
        .populate('allCast.id')
        .sort({ createdAt: -1 });

    if (movie) {
        const generess = [], prducerss = [], writerss = [], directorss = []
        for (const genere of movie.genere) {
            const genereData = await Genere.findById(genere);
            generess.push(genereData);
        }
        for (const prducer of movie.prducer) {
            const prducerData = await Cast.findById(prducer);
            prducerss.push(prducerData);
        }
        for (const writer of movie.writer) {
            const writerData = await Cast.findById(writer);
            writerss.push(writerData);
        }
        for (const director of movie.director) {
            const directorData = await Cast.findById(director);
            directorss.push(directorData);
        }
        const newMovie = {
            ...movie._doc,
            genere: generess,
            prducer: prducerss,
            writer: writerss,
            director: directorss
        }
        res.status(200).json({ movie: newMovie, status: true });
    } else {
        res.status(401).json({ message: "Invalid Admin Data!" });
    }
});

export const postReview = asyncHandler(async (req, res) => {
    const { rating, review, userId } = req.body;
    const movie = await Movie.findById(req.params.id)
    console.log("userId", req.body)
    if (movie) {
        const alreadyReviewed = movie.reviews.find(
            (r) => r.user.toString() === userId.toString()
        )
        if (alreadyReviewed) {
            res.status(400).json({ message: 'Movie already reviewed', status: false, code: 400 })
        } else {
            const revieww = {
                rating,
                review,
                user: userId
            }
            movie.reviews.push(revieww)
            await movie.save()
            res.status(201).json({ message: 'Review added', status: true, code: 201 })
        }
    } else {
        res.status(404).json({ message: 'Movie not found', status: false, code: 404 })
    }
})

export const deleteReview = asyncHandler(async (req, res) => {
    const movie = await Movie.findById(req.params.movieId)
    if (movie) {
        const review = movie.reviews.find(
            (r) => r._id.toString() == req.params.reviewId.toString()
        )
        for (const review of movie.reviews) {
            console.log("review", review._id.toString())
        }
        console.log("reviewID", req.params.reviewId.toString())

        if (review) {
            movie.reviews.pull(review)
            await movie.save()
            res.status(200).json({ message: 'Review deleted', status: true, code: 200 })
        } else {
            res.status(404).json({ message: 'Review not found', status: false, code: 404 })
        }
    } else {
        res.status(404).json({ message: 'Movie not found', status: false, code: 404 })
    }
})


export const deleteMovie = asyncHandler(async (req, res) => {
    try {
        await Movie.findOneAndDelete({ _id: req.params.id })
        res.status(200).json({ message: 'Movie deleted successfully', status: true })
    } catch (error) {
        res.status(500).json({ message: error.message, status: false })
    }
})
