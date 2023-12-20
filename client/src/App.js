import React,{useState, useEffect} from "react"
import { Route, Routes,useNavigate } from 'react-router-dom';
import AdminDashboard from './layout/AdminDashboard';
import Users from './pages/Users';
import Movies from './pages/Movies';
import TvShows from './pages/TvShows';
import Genres from './pages/Genres';
import Cast from './pages/Cast';
import { useCookies } from 'react-cookie'
import axios from 'axios'
import key from './key'
import Signin from "./pages/Signin";


function App() {
  const navigate = useNavigate();
  // eslint-disable-next-line
  const [cookies, setCookie, removeCookie] = useCookies(['x-auth-admin']);
  // eslint-disable-next-line
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = cookies['x-auth-admin'];
    if (token) {
      axios.get(`${key}/api/admin/verify`, {
        headers: {
          'x-auth-admin': token
        }
      }).then(res => {
        setUser(res.data.admin);
      }).catch(err => {
        removeCookie('x-auth-admin');
        navigate('/login');
      })
    } else {
      navigate('/login');
    }
    //eslint-disable-next-line
  }, [cookies['x-auth-admin']]);
  return (
    <div className="App">
      <Routes>
      <Route path="/login" element={<Signin />} />
        <Route path="/" element={<AdminDashboard />}>
          <Route index element={<Users />} />
          <Route path="users" element={<Users />} />
          <Route path="movies" element={<Movies />} />
          <Route path="cast" element={<Cast />} />
          <Route path="tv-shows" element={<TvShows />} />
          <Route path="genres" element={<Genres />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
