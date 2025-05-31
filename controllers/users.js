const User = require("../models/user");

module.exports.renderSignupForm = (req, res) => {
    res.render("users/signup.ejs");
    // this will render the signup page
    // and will send the response to the client
    // and will show the signup page to the user
  };

  module.exports.signUp = async (req, res) => {
      // this route will handle the signup form submission
      // and will create a new user in the database
      // and will redirect to the listings page
      // and will show the listings there
      try {
        let { username, email, password } = req.body;
        let newUser = new User({ email, username });
        const registeredUser = await User.register(newUser, password);
        // this will register the user and store the user data in the database
        req.login(registeredUser, (err) => {
          if (err) {
            return next(err);
          }
          // this will login the user and store the user data in the session
          // this will be used to get the user data from the session and store it in the req.user
  
          req.flash("success", "Welcome to wandelust!");
          res.redirect("/listings");
        });
        // this will redirect to the listings page
      } catch (e) {
        req.flash("error", e.message);
        res.redirect("/signup");
      }
      // this will send the response to the client
    };

    module.exports.renderLoginForm = (req, res) => {
        res.render("users/login.ejs");
        // this route will render the login page
        // and will send the response to the client
        // and will show the login page to the user
      };

      module.exports.loginUser = async(req, res) => {
        // this route will handle the login form submission
        // and will redirect to the listings page
        // and will show the listings there
        req.flash("success", "Welcome back to Wanderlust!");
        let redirectUrl = res.locals.redirectUrl || "/listings";
        // this will get the redirect url from the locals
        res.redirect(redirectUrl);
        // this will redirect to the listings page
      };

      module.exports.logoutUser = (req, res) => {
        req.logout((err) => {
          if (err) {
          return next(err);
          }
          req.flash("success", "You are logged out!");
          res.redirect("/listings");
        });
        // this route will handle the logout form submission
        // and will redirect to the listings page
        // and will show the listings there
      };
