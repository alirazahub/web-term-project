import express from 'express'
import expressLayouts from 'express-ejs-layouts'
import connectDB from './config/db.js'
import multer from 'multer';
import cors from 'cors'
import bodyParser from 'body-parser';
import fs from 'fs'
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv'
import user from './routes/user.js'
import admin from './routes/admin.js'
import Movie from './models/movieModel.js'
import session from 'express-session'
import { isAuthenticated } from './middleware/verifyUser.js';
import User from './models/userModel.js';
import Genere from './models/genereModel.js';
import Cast from './models/castModel.js';
import { fileURLToPath } from 'url';
import path from 'path';


const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(cors())
dotenv.config()
connectDB();
app.use(cookieParser());
app.use(express.json())
app.use(bodyParser.json());

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    console.log("filee", file)
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, req.body.name);
  }
});

const upload = multer({ storage: storage });

app.post('/api/upload', upload.single("file"), (req, res) => {
  if (req.file) {
    res.status(200).send({ message: 'File is Uploaded', status: true })
  } else {
    res.status(500).send({ message: 'File is not Uploaded', status: false })
  }
});


app.use('/images', express.static("images"))


//delete Image
app.delete('/api/delete/:id', (req, res) => {
  try {
    const path = `images/${req.params.id}`
    fs.unlinkSync(path)
    res.status(200).json('File is Deleted')
  }
  catch (err) {
    res.status(500).json('File is not Deleted')
  }
}
)

app.use(express.static("public"));
app.set("view engine", "ejs");
app.use(expressLayouts);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
  secret: process.env.JWT_SECRET,
  resave: false,
  saveUninitialized: true,
}));

app.get('/', async (req, res) => {
  const movies = await Movie.find()
  res.render('landing', { user: req.session.user, movies });
});

app.get('/login', function (req, res) {
  res.render('login');
});
// Add logout route and logic to clear session data
app.get('/api/user/logout', (req, res) => {
  req.session.destroy(() => {
    res.clearCookie('session-id'); // Clear session cookie
    res.redirect('/login');
  });
});



app.get('/register', function (req, res) {
  res.render("register");
});

app.get('/profile', isAuthenticated, async (req, res) => {
  const user = await User.findById(req?.session?.user?._id)
  res.render("profile", { user });
});

app.get('/movies', async function (req, res) {

  const ITEMS_PER_PAGE = 4;
  const pageNumber = parseInt(req.query.page) || 1;
  const skip = (pageNumber - 1) * ITEMS_PER_PAGE;
  const searchTerm = req.query.search;
  const language = req.query.language;
  const classification = req.query.classification;
  let filteredMovies;

  try {
    const movies = await Movie.find().skip(skip).limit(ITEMS_PER_PAGE);
    const allMovies = await Movie.find()
    const totalMovies = await Movie.countDocuments();
    const totalPages = Math.ceil(totalMovies / ITEMS_PER_PAGE);


    if (searchTerm) {
      filteredMovies = allMovies.filter(movie => movie.name.toLowerCase().includes(searchTerm.toLowerCase()))
      if (filteredMovies.length === 0) {
        filteredMovies = movies;
      } else {
        filteredMovies = filteredMovies.slice(skip, skip + ITEMS_PER_PAGE);
      }
    } else {
      filteredMovies = movies;
    }

    if (language) {
      filteredMovies = filteredMovies.filter(movie => movie.language === language);
    }
    if (classification) {
      filteredMovies = filteredMovies.filter(movie => movie.classification === classification);
    }
    if (language && classification) {
      filteredMovies = filteredMovies.filter(movie => movie.language === language && movie.classification === classification);
    }

    res.render("movies", {
      movies: filteredMovies,
      user: req.session.user,
      currentPage: pageNumber,
      totalPages
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get('/movies/:id', async function (req, res) {
  try {
    const movie = await Movie.findById(req.params.id)
      .populate('allCast.id')
    const generess = [], prducerss = [], writerss = [], directorss = [], reviewss = [];
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
    for (const review of movie.reviews) {
      const reviewData = await User.findById(review.user);
      reviewss.push({ ...review._doc, user: reviewData });
    }
    const newMovie = {
      ...movie._doc,
      genere: generess,
      prducer: prducerss,
      writer: writerss,
      director: directorss,
      reviews: reviewss
    }
    console.log("new", newMovie)
    res.render("movie", { movie: newMovie, user: req.session.user });
  } catch (error) {
    console.error(error);
    res.render("movie", { movie: {}, user: req.session.user })
  }
}
);

app.get('/tv-shows', async function (req, res) {
  res.render("tv-shows", { user: req.session.user });
});


const storagee = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'images');
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const uploadd = multer({ storage: storagee });

app.post('/api/admin/upload', uploadd.single("file"), (req, res) => {
  if (req.file) {
    res.status(200).json({ message: 'File Uploaded Successfully', success: true, fileName: req.file.filename })
  } else {
    res.status(500).json({ message: 'File Not Uploaded', success: false })
  }
});

//  backend api routes
app.get('/api', (req, res) => {
  res.send('Welcome to the Movie App API!')
})
app.use('/api/user', user)
app.use('/api/admin', admin)

const __dirname = fileURLToPath(new URL('.', import.meta.url));

// Serve built admin - must be defined before client
const adminBuildDir = path.join(__dirname, '..', 'client', 'build');

app.use('/admin', express.static(adminBuildDir));
app.get('/admin*', (req, res) => {
  res.sendFile(path.join(adminBuildDir, 'index.html'));
});


const PORT = process.env.PORT || 5000
app.listen(PORT, console.log(`Server is running on port ${PORT}`))