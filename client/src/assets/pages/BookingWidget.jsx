import React from "react";
import { useState } from "react";
import { differenceInCalendarDays } from "date-fns";
import { Navigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
const BookingWidget = ({ place }) => {
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [numberOfGuests, setNumberOfGuests] = useState(1);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [redirect, setRedirect] = useState("");
  let numberofdays = 0;
  if (checkIn && checkOut) {
    numberofdays = differenceInCalendarDays(checkOut, checkIn);
  }
  async function bookThisPlace() {
    try {
      const response = await axios.post("http://localhost:8080/bookings", {
        checkIn,
        checkOut,
        numberOfGuests,
        name,
        phone,
        place: place._id,
        price: numberofdays * place.price,
      });
  toast.success("Booking sucessfull")
      const bookingId = response.data._id;
      setRedirect(`/account/bookings/${bookingId}`);
    } catch (error) {
      console.error("Error booking the place:", error);
    }
  }
  
  if (redirect) {
    return <Navigate to={redirect} />;
  }
  return (
    <div className="bg-white shadow p-4 rounded-2xl w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg">
      <div className="text-2xl text-center">
        Price: ${place.price} / per night
      </div>
      <div className="border rounded-2xl mt-4">
        <div className="flex flex-col md:flex-row">
          <div className="py-3 px-4 flex-1">
            <label>Check in:</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg border border-gray-300"
              value={checkIn}
              onChange={(ev) => setCheckIn(ev.target.value)}
            />
          </div>
          <div className="py-3 px-4 border-t md:border-t-0 md:border-l flex-1">
            <label>Check out:</label>
            <input
              type="date"
              className="w-full p-2 rounded-lg border border-gray-300"
              value={checkOut}
              onChange={(ev) => setCheckOut(ev.target.value)}
            />
          </div>
        </div>
        <div className="py-3 px-4 border-t">
          <label>Number of guests:</label>
          <input
            type="number"
            className="w-full p-2 rounded-lg border border-gray-300"
            value={numberOfGuests}
            onChange={(ev) => setNumberOfGuests(ev.target.value)}
          />
        </div>
        {numberofdays > 0 && (
          <div className=" px-2 py-2 border-t">
            <label>Your full name:</label>
            <input
              type="text"
              value={name}
              onChange={(ev) => setName(ev.target.value)}
            />
            <label>Phone number:</label>
            <input
              type="tel"
              value={phone}
              onChange={(ev) => setPhone(ev.target.value)}
            />
          </div>
        )}
      </div>
      <button
        className="w-full bg-primary text-white py-2 rounded-2xl mt-4"
        onClick={bookThisPlace}
      >
        Book this place
        {numberofdays > 0 && (
          <span className="px-3">${numberofdays * place.price}</span>
        )}
      </button>
    </div>
  );
};

export default BookingWidget;
