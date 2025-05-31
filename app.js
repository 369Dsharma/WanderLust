if(process.env.NODE_ENV !== "production") {
  // this will check if the environment is not production
  // if it is not production then it will load the environment variables from the .env file
  // this will be used to store the environment variables in the process.env object
require("dotenv").config();
}


const express = require("express");
const app = express();
const mongoose = require("mongoose");

const ejs = require("ejs");
const path = require("path");

const ExpressError = require("./utils/ExpressError.js");

const listingRouter = require("./Routes/listing.js");
const reviewRouter = require("./Routes/review.js");
const userRouter = require("./Routes/user.js");
// this will require the listing router and review router
// and user router
// this will be used to create the routes for the listing and review and user



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true })); // taki req ke andr aaya hua sara data parse ho ske


const dbUrl = process.env.ATLASDB_URL;

// require method override -> a package used to convert post request to put request
const methodOverride = require("method-override");
app.use(methodOverride("_method"));

// require ejs-mate
const ejsMate = require("ejs-mate"); // ejs mate basically help us to create templates easily...
app.engine("ejs", ejsMate);

// requiring express-session
const session = require("express-session");
// requiring connect mongo
const MongoStore = require('connect-mongo');

// requiring  connect-flash
const flash = require("connect-flash");

// requiring passport
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.log("Error found!");
  });
async function main() {
  await mongoose.connect(dbUrl);
}

// Mongo store

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto : {
    secret : process.env.SECRET,
  },
  touchAfter : 24*3600,
    
});

store.on("error" , ()=>{
    console.log("Error in Mongo Session Store",err);
});

// session middleware
const sessionOptions = {
  store,
  secret : process.env.SECRET,
  resave : false,
  saveUninitialized : true,
  cookie : {
    httpOnly : true,
    expires : Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
    maxAge : 1000 * 60 * 60 * 24 * 7, // 7 days
  },
  // this will set the cookie in the browser and will expire after 7 days
};

// app.get("/", (req, res) => {
//   res.send("Hi , I am root");
// });
// this is the root route
// this will send the response to the client



app.use(session(sessionOptions));
// session middleware is used to store the session data in the server memory

app.use(flash());
// flash middleware is used to store the flash messages in the session data
// flash messages are used to show the success or error messages to the user

app.use(passport.initialize());
app.use(passport.session());
// passport middleware is used to initialize the passport and use the session data
// passport session middleware is used to store the user data in the session

passport.use(new LocalStrategy(User.authenticate()));
// this will use the local strategy to authenticate the user

passport.serializeUser(User.serializeUser());
// this will serialize the user data and store it in the session
// this will be used to store the user data in the session
passport.deserializeUser(User.deserializeUser());
// this will deserialize the user data and store it in the session
// this will be used to get the user data from the session and store it in the req.user



app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  // this will set the success and error messages in the locals object
  // so that we can use it in the ejs files

  res.locals.currentUser = req.user;
  // this will set the current user in the locals object
  next();
});

app.get("/demouser", async (req, res) => {

  let fakeUser = new User({
    username: "demouser",
    email: "demo123@gmail.com",
});

  let registeredUser = await User.register(fakeUser, "demopassword111");
  // this will register the user and store the user data in the database
  res.send(registeredUser);
  // this will send the response to the client
});

app.use("/listings" , listingRouter);
app.use("/listings/:id/reviews" , reviewRouter);
app.use("/" , userRouter);


app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Page Not Found!"));
});

// middleware

app.use((err, req, res, next) => {
  let { statusCode = 500, message = "Something went wrong!" } = err;
//   res.status(statusCode).send(message);

    res.status(statusCode).render("error.ejs" , {message});
});

app.listen(8080, () => {
  console.log("Serever is listening..");
});
