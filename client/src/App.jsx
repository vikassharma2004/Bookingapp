
import './App.css'
import {Route, Routes} from "react-router-dom";


import axios from "axios";
import Layout from './assets/Layout';
import Loginpage from './assets/pages/Loginpage';
import RegisterPage from './assets/pages/Registerpage';
import Indexpage from './assets/pages/Indexpage';
import {UserContextProvider} from "../../client/src/UserContext.jsx"


import Accountpage from './assets/pages/AccountPage.jsx';
import PlacesPage from './assets/pages/PlacesPage.jsx';
import PlacesFormpage from './assets/pages/PlacesFormpage.jsx';
import Bookingspage from './assets/pages/Bookingspage.jsx';
import IndividualPlace from './assets/pages/IndividualPlace.jsx';
import Bookingpage from './assets/pages/Bookingpage.jsx';
axios.defaults.withCredentials=true;
function App() {
 
  return (
   <UserContextProvider>

      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Indexpage />} />
          <Route path="/login" element={<Loginpage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/account" element={<Accountpage />} />
          <Route path="/account/places" element={<PlacesPage/>} />
          <Route path="/account/places/new" element={<PlacesFormpage/>} />
          <Route path="/account/places/:id" element={<PlacesFormpage/>} />
          <Route path="/account/bookings" element={<Bookingspage/>} />
          <Route path="/account/bookings/:id" element={<Bookingpage/>} />
          <Route path="/place/:id" element={<IndividualPlace/>} />
          
        </Route>
      </Routes>
  
   </UserContextProvider>
  )
}

export default App
