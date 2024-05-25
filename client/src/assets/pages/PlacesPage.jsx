import React from "react";
import { Link, useParams } from "react-router-dom";

import AccountNav from "./AccountNav";
import axios from "axios";
import { useEffect, useState } from "react";
import PlaceImg from "../../PlaceImg";
import {toast} from "react-toastify"
const PlacesPage = () => {
  const { action } = useParams();
  const [place, setPlaces] = useState([]);
  const { id } = useParams();

  useEffect(() => {
    axios
      .get("http://localhost:8080/user-places")

      .then(({data}) => {
        setPlaces(data)
        
      })
      .catch((error) => {
        console.error("Error fetching places:", error);
toast.error("Some Error Occured")
      });
  }, []);
console.log(place);
  return (
    <div>
      <AccountNav />
      {action !== "new" && (
       <div className="text-center">
       <Link className="inline-flex gap-1 bg-primary text-white py-2 px-6 rounded-full" to={'/account/places/new'}>
         <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
           <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v6.75h6.75a.75.75 0 010 1.5h-6.75v6.75a.75.75 0 01-1.5 0v-6.75H4.5a.75.75 0 010-1.5h6.75V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
         </svg>
         Add new place
       </Link>
     </div>
      )}
<div className="mt-4">
{place.length > 0 ? (
        place.map(place => (
          <Link 
            key={place._id} 
            to={`/account/places/${place._id}`} 
            className="flex cursor-pointer gap-4 justify-center items-center mb-2 bg-gray-100 p-4 rounded-2xl"
          >
            <div className="flex w-32 h-32 bg-gray-300 grow shrink-0">
              <PlaceImg place={place} />
            </div>
            <div className="grow-0 shrink">
              <h2 className="text-xl font-semibold">{place.title}</h2>
              <p className="text-sm mt-2">{place.description}</p>
            </div>
          </Link>
        ))
      ) : (
        <h1 className="text-3xl text-center text-shadow-md mt-48 text-neutral-900">
          No Place added
        </h1>
      )}
        </div> 

    </div>
  );
}

export default PlacesPage;
