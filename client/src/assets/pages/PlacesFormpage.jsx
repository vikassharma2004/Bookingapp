import React from "react";
import { useState, useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import axios from "axios";
import Perks from "./Perks";
import {toast} from "react-toastify"
const PlacesFormpage = () => {
  const { id } = useParams();
const [uploading,setuploading]=useState(false)
  const [title, setTitle] = useState("");
  const [address, setAddress] = useState("");
  const [addedPhotos, setAddedPhotos] = useState([]);
  const [PhotoLink, setphotoLink] = useState("");
  const [description, setDescription] = useState("");
  const [perks, setPerks] = useState([]);
  const [extraInfo, setExtraInfo] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [maxGuests, setMaxGuests] = useState(1);
  const [price, setPrice] = useState(100);
  const [redirect, setRedirect] = useState(false);
  console.log(id);

  useEffect(() => {
    if (!id) {
      return;
    }

    axios
      .get(`bookingapi-gamma.vercel.app/places/${id}`)
      .then((response) => {
        const { data } = response;
        setTitle(data.title);
        setAddress(data.address);
        setAddedPhotos(data.photos);
        setDescription(data.description);
        setPerks(data.perks);
        setExtraInfo(data.extraInfo);
        setCheckIn(data.checkIn);
        setCheckOut(data.checkOut);
        setMaxGuests(data.maxGuests);
        setPrice(data.price);
        console.log(data);
      })
      .catch((error) => {
        console.error("Error fetching place:", error);
      });
  }, [id]);
  function inputHeader(text) {
    return <h2 className="text-2xl mt-4">{text}</h2>;
  }
  function inputDescription(text) {
    return <p className="text-gray-500 text-sm">{text}</p>;
  }
  function preInput(header, description) {
    return (
      <>
        {inputHeader(header)}
        {inputDescription(description)}
      </>
    );
  }
  async function uploadphoto(ev) {
    setuploading(true)
    const files = ev.target.files;
    console.log(files);
    const data = new FormData();

    for (let i = 0; i < files.length; i++) {
      data.append("photos", files[i]);
    }

    const response = await axios.post("bookingapi-gamma.vercel.app/upload", data, {
      headers: { "content-type": "multipart/form-data" },
    });
    const { data: filenames } = response;
    setAddedPhotos((prev) => {
      return [...prev, ...filenames];
    });
    setuploading(false)
  }



  async function savePlace(ev) {
    ev.preventDefault();
    const placedata = {
      title,
      address,
      addedPhotos,
      description,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
      price,
    };
    if (id) {
      //  update
      await axios.put("bookingapi-gamma.vercel.app/places", {
        id,
        ...placedata,
      });

      setRedirect(true);
      
      toast.success("Your Post has been Updated")

    } else {
      //  create
      await axios.post("bookingapi-gamma.vercel.app/places", {
        title,
        address,
        addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
        price,
      });

      setRedirect(true);
      toast.success("created")
   
    }
  }
  if (redirect) {
    return <Navigate to={"/account/places"} />;
  }
  function removephoto(ev,link) {
    ev.preventDefault()
    const newPhotos = addedPhotos.filter((photo) => photo !== link);
    setAddedPhotos(newPhotos);
  }
  function Selectedmainphoto(ev,link){
    ev.preventDefault()
    const addedphotowithoutselected = addedPhotos.filter((photo) => photo !== link);
    const newaddedphotos=[link,...addedphotowithoutselected]
    setAddedPhotos(newaddedphotos)

  }
  return (
    <div className="p-4">
      <form onSubmit={savePlace}>
        {preInput(
          "Title",
          "Title for your place. should be short and catchy as in advertisement"
        )}
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mt-2"
          placeholder="title, for example: My lovely apt"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        {preInput("Address", "Address to this place")}
        <input
          type="text"
          className="w-full p-2 border border-gray-300 rounded mt-2"
          placeholder="address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />

        {preInput("Photos", "more = better")}
       
        <div className=" grid grid-cols-3  gap-2 md:grid-cols-4  lg:grid-cols-6    border border-gray-300 p-2 mt-2">
          {addedPhotos.length > 0 &&
            addedPhotos.map((link) => (
              <div className="shadow shadow-md h-32 flex relative" key={link}>
                <img
                  src={`${link}`}
                  alt="image"
                  className="rounded-2xl w-full object-cover   "
                ></img>
                <div
                  className="absolute  bottom-1 right-1 text-white bg-black bg-opacity-50 rounded-2xl py-2 px-3 cursor-pointer"
                  onClick={ev => removephoto(ev,link)}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-6 h-6"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                    />
                  </svg>
                </div>
                <div
                  className="absolute  bottom-1 left-1 text-white bg-black  rounded-2xl py-2 px-3 cursor-pointer"
                  onClick={ev => Selectedmainphoto(ev,link)}
                >
                  {link === addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="w-6 h-6 text-primary"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                  {link !== addedPhotos[0] && (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="w-6 h-6 "
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z"
                      />
                    </svg>
                  )}
                </div>
              </div>
            ))}

          <label className="border gap-1 flex justify-center items-center cursor-pointer p-2  bg-transparent rounded-2xl   text-2xl text-gray-600 ">
            <input
              type="file"
              multiple
              className="hidden"
              onChange={uploadphoto} accept="image/*"
            />
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 16.5V9.75m0 0 3 3m-3-3-3 3M6.75 19.5a4.5 4.5 0 0 1-1.41-8.775 5.25 5.25 0 0 1 10.233-2.33 3 3 0 0 1 3.758 3.848A3.752 3.752 0 0 1 18 19.5H6.75Z"
              />
            </svg>
           {uploading?"uploading":"upload"}
          </label>
        </div>

        {preInput("Description", "description of the place")}
        <textarea
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        ></textarea>

        {preInput("Perks", "select all the perks of your place")}
        <div className="grid mt-2 gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          <Perks selected={perks} onChange={setPerks} />
        </div>

        {preInput("Extra info", "house rules, etc")}
        <textarea
          className="w-full p-2 border border-gray-300 rounded mt-2"
          value={extraInfo}
          onChange={(e) => setExtraInfo(e.target.value)}
        ></textarea>
        {preInput(
          "Check in&out times",
          "add check in and out times, remember to have some time window for cleaning the room between guests"
        )}
        <div className="grid gap-2 grid-cols-2 md:grid-cols-4">
          <div>
            <h3 className="mt-2 -mb-1">Check in time</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="14"
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Check out time</h3>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              placeholder="11"
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Max number of guests</h3>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              value={maxGuests}
              onChange={(e) => setMaxGuests(e.target.value)}
            />
          </div>
          <div>
            <h3 className="mt-2 -mb-1">Price per night</h3>
            <input
              type="number"
              className="w-full p-2 border border-gray-300 rounded mt-2"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
        </div>
        <button className="primary my-4 bg-primary text-white p-2 rounded">
          Save
        </button>
      </form>
    </div>
  );
};

export default PlacesFormpage;
