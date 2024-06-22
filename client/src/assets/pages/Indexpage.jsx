
import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";


const Indexpage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('bookingapi-gamma.vercel.app/indexplaces')
      .then(response => {
        setData(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Error fetching places:", error);
        setLoading(false);
      });
  }, []);

  return (
    <div className='mt-8 grid grid-cols gap-6 gap-y-8 md:grid-cols-3 lg:grid-cols-4 sm:grid-cols-1'>
      {loading ? (
        Array.from({ length: 8 }).map((_, index) => (
          <div key={index}>
            <div className="bg-gray-500 rounded-2xl flex cursor-pointer">
              <Skeleton className="rounded-2xl aspect-square object-cover" height={200} />
            </div>
            <Skeleton className="font-bold" height={20} />
            <Skeleton className="text-sm text-gray-500" height={15} />
            <Skeleton className="mt-1" height={15} />
          </div>
        ))
      ) : (
        data.length > 0 && data.map((place) => (
          <Link to={'/place/' + place._id} key={place._id}>
            <div className="bg-gray-500 rounded-2xl flex cursor-pointer">
              {place.photos?.[0] && (
                <img src={ place.photos?.[0]} className="rounded-2xl aspect-square object-cover" alt="" />
              )}
            </div>
            <h2 className='font-bold truncate'>{place.address}</h2>
            <h3 className='text-sm text-gray-500'>
              {place.title}
            </h3>
            <div className='mt-1'>
              <span className='font-bold'>${place.price} per night</span>
            </div>
          </Link>
        ))
      )}
    </div>
  );
};

export default Indexpage;



