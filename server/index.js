const express = require("express");
const app = express();
const path = require("path");
const port = 8080;
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("./models/user.js");
const Place = require("./models/places.js");
const Booking = require("./models/booking.js");
const cookieParser = require("cookie-parser");
const imageDownloader = require("image-downloader");
const fs = require("fs");
const multer = require("multer");

require("dotenv").config();

const Mongo_Url = process.env.Mongo_Url;
console.log(Mongo_Url);
app.use(express.urlencoded({ extended: true })); // post request ka data parse krne ke liye
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));
app.use(express.static(path.join(__dirname, "public")));
const cors = require("cors");

const corsoption = {
  credentials: true,
  origin: "http://localhost:5173",
  methods: "GET,PUT,PATCH,DELETE,POST,HEAD",
};

app.use(cors(corsoption));
//  jwt token secret
const jwtSecret = "adhushfsfshfusfsklfhsf";
const bcryptsalt = bcrypt.genSaltSync(10);

const maxRetries = 5;
const retryDelay = 5000; // 5 seconds

async function connectWithRetry(retries = 0) {
  try {
    await mongoose.connect(Mongo_Url);
    console.log("Connection successful");
  } catch (err) {
    console.log(`Database connection failed. Retry ${retries + 1}/${maxRetries}`);
    if (retries < maxRetries) {
      setTimeout(() => connectWithRetry(retries + 1), retryDelay);
    } else {
      console.log("Max retries reached. Could not connect to database.");
    }
  }
}

connectWithRetry();

// JagDS7WFjldHEqMM
app.listen(port, () => {
  console.log(`app is running at ${port}`);
});

app.get("/", (req, res) => {
  res.send("index here");
});

// Register user
app.post("/register", async (req, res) => {
  await mongoose.connect(Mongo_Url);
  try {
    let { name, email, password } = req.body;

    const userdoc = await User.create({
      name,
      email,
      password: bcrypt.hashSync(password, bcryptsalt),
    });

    res.json(userdoc);
  } catch (e) {
    res.status(422).json(e);
  }
});

// Login user
app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const userDoc = await User.findOne({ email });
    if (userDoc) {
      const passOk = bcrypt.compareSync(password, userDoc.password);
      if (passOk) {
        jwt.sign(
          {
            email: userDoc.email,
            id: userDoc._id,
          },
          jwtSecret,
          {},
          (err, token) => {
            if (err) throw err;
            res.cookie("token", token).json(userDoc);
          }
        );
      } else {
        res.status(422).json("Password not correct");
      }
    } else {
      res.status(404).json("User not found");
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get profile
app.get("/profile", async (req, res) => {
  await mongoose.connect(Mongo_Url);
  try {
    const { token } = req.cookies;
    if (token) {
      jwt.verify(token, jwtSecret, {}, async (err, userData) => {
        if (err) throw err;
        const { name, email, _id } = await User.findById(userData.id);
        res.json({ name, email, _id });
      });
    } else {
      res.json(null);
    }
  } catch (e) {
    res.status(500).json(e);
  }
});

// Logout
app.post("/logout", (req, res) => {
  res.cookie("token", "").json(true);
});

// Upload image by link
app.post("/uploadbylink", async (req, res) => {
  await mongoose.connect(Mongo_Url);
  try {
    const { link } = req.body;
    const newname = "photo" + Date.now() + ".jpg";
    const destpath = __dirname + "/uploads/" + newname;
    const options = {
      url: link,
      dest: destpath,
    };
    imageDownloader
      .image(options)
      .then(({ filename }) => {
        
        res.json(newname);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json(err);
      });
  } catch (e) {
    res.status(500).json(e);
  }
});

// Upload images
const upload = multer({ dest: "uploads/" });
app.post("/upload", upload.array("photos", 100), async function (req, res) {
  await mongoose.connect(Mongo_Url);
  try {
    const uploadedfiles = [];
    for (let i = 0; i < req.files.length; i++) {
      const { path, originalname } = req.files[i];
      const parts = originalname.split(".");
      const ext = parts[parts.length - 1];
      const newpath = path + "." + ext;
      fs.renameSync(path, newpath);
      uploadedfiles.push(newpath.replace("uploads\\", ""));
    }
    res.json(uploadedfiles);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Create place
app.post("/places", async (req, res) => {
  await mongoose.connect(Mongo_Url);
  try {
    const {
      title,
      address,
      addedPhotos,
      description,
      price,
      perks,
      extraInfo,
      checkIn,
      checkOut,
      maxGuests,
    } = req.body;
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.create({
        owner: userData.id,
        price,
        title,
        address,
        photos: addedPhotos,
        description,
        perks,
        extraInfo,
        checkIn,
        checkOut,
        maxGuests,
      });
      res.json(placeDoc);
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get user places
app.get("/user-places", async (req, res) => {
  await mongoose.connect(Mongo_Url);
  try {
    const { token } = req.cookies;
    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const places = await Place.find({ owner: userData.id });
      res.json(places);
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get place by ID
app.get("/places/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const data = await Place.findById(id);
    res.json(data);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Update place
app.put("/places/", async (req, res) => {
  await mongoose.connect(Mongo_Url);
  try {
    const { token } = req.cookies;
    const {
      id,
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
    } = req.body;

    jwt.verify(token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      const placeDoc = await Place.findById(id);
      if (userData.id === placeDoc.owner.toString()) {
        placeDoc.set({
          price,
          title,
          address,
          photos: addedPhotos,
          description,
          perks,
          extraInfo,
          checkIn,
          checkOut,
          maxGuests,
        });
        await placeDoc.save();
        res.json("ok");
      } else {
        res.status(403).json("Forbidden");
      }
    });
  } catch (e) {
    res.status(500).json(e);
  }
});

// Get all places
app.get("/indexplaces", async (req, res) => {
  await mongoose.connect(Mongo_Url);
  try {
    const placeDoc = await Place.find();
    res.json(placeDoc);
  } catch (e) {
    res.status(500).json(e);
  }
});

// Create booking
app.post("/bookings", async (req, res) => {
  try {
    const userData= await getuserdatafromtoken(req)
    const { place, checkIn, checkOut, name, phone, numberOfGuests, price } = req.body;
    const bookingdoc = await Booking.create({
      price,
      place,
      name,
      phone,
      checkIn,
      checkOut,
      numberOfGuests,
      user:userData.id
    });
    res.json(bookingdoc);
  } catch (e) {
    res.status(500).json(e);
  }
});

function getuserdatafromtoken(req){

  return new Promise((resolve,reject)=>{

    jwt.verify(req.cookies.token, jwtSecret, {}, async (err, userData) => {
      if (err) throw err;
      resolve(userData)
    })
  })
}
app.get('/booking', async (req,res) => {
  mongoose.connect(process.env.Mongo_Url);
  const userData = await getuserdatafromtoken(req);
  res.json( await Booking.find({user:userData.id}).populate('place'))
});
