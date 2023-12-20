import { AiOutlineUser } from 'react-icons/ai';
import { MdOutlineMovieFilter, MdOutlineStarRate } from 'react-icons/md';
import { PiUsersBold } from 'react-icons/pi';
import { RiMovie2Line, RiSlideshow3Line } from "react-icons/ri";
const items = [
    {
        to: 'users',
        label: 'Users',
        icon: <PiUsersBold  size={25} />,
        subnavs: [],
    },
    {
        to: 'movies',
        label: 'Movies',
        icon: <MdOutlineMovieFilter size={25} />,
        subnavs: [],
    },
    {
        to: 'tv-shows',
        label: 'Tv Shows',
        icon: <RiSlideshow3Line  size={25} />,
        subnavs: [],
    },
    {
        to: 'genres',
        label: 'Genres',
        icon: <RiMovie2Line  size={25} />,
        subnavs: [],
    },
    {
        to: 'cast',
        label: 'Casts',
        icon: <AiOutlineUser  size={25} />,
        subnavs: [],
    },
    {
        to: 'ratings',
        label: 'Ratings',
        icon: <MdOutlineStarRate  size={25} />,
        subnavs: [],
    },

];




export { items };
