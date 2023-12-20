import express from "express";
import {
    login, register, verify, allUsers, deleteUser, addNewUser,
    addGenere, allGeneres, deleteGenere, addCast, allCasts, deleteCast,
    addMovie, allMovies, deleteMovie, updateGenere, postReview, deleteReview
} from "../controllers/admin.js";
import { verifyUser } from '../middleware/verifyUser.js'

const router = express.Router();

router.post("/login", login);
router.post("/register", register);
router.get("/verify", verifyUser, verify);
router.get("/all-users", allUsers);
router.post("/add-user", addNewUser);
router.delete("/delete-user/:id", deleteUser);

router.post("/add-genere", addGenere);
router.put("/update-genere/:id", updateGenere);
router.get("/all-generes", allGeneres);
router.delete("/delete-genere/:id", deleteGenere);

router.post("/add-cast", addCast);
router.get("/all-casts", allCasts);
router.delete("/delete-cast/:id", deleteCast);

router.post("/add-movie", addMovie);
router.get("/all-movies", allMovies);
router.delete("/delete-movie/:id", deleteMovie);
router.post("/post-review/:id",postReview)
router.delete("/delete-review/:movieId/:reviewId",deleteReview)

export default router;