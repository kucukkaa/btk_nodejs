const User = require("../models/user");
const { Op } = require("sequelize");
const bcrypt = require("bcrypt");

exports.getLogin = (req, res, next) => {
  var errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;
  res.render("account/login", {
    path: "/login",
    title: "Login",
    isAuthenticated: req.session.isAuthenticated,
    errorMessage: errorMessage,
  });
};

exports.postLogin = (req, res, next) => {
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  User.findOne({ where: { email: email } })
    .then((user) => {
      if (!user) {
        req.session.errorMessage = "There is no user with this email address";
        req.session.save(function (err) {
          console.log(err);
          return res.redirect("/login");
        });
      }

      bcrypt
        .compare(password, user.password)
        .then((isSuccess) => {
          if (isSuccess) {
            req.session.user = user;
            req.session.isAuthenticated = true;
            return req.session.save(function (err) {
              console.log(err);
              var url = req.session.redirectTo || "/";
              delete req.session.redirectTo;
              return res.redirect(url);
            });
          }
          req.session.errorMessage = "Password is wrong";
          req.session.save(function (err) {
            console.log(err);
            return res.redirect("/login");
          });
        })
        .catch((err) => {
          console.log(err);
        });
    })
    .catch((err) => {
      console.log(err);
    });

};

exports.getRegister = (req, res, next) => {
  var errorMessage = req.session.errorMessage;
  delete req.session.errorMessage;

  res.render("account/register", {
    path: "/register",
    title: "Register",
    isAuthenticated: req.session.isAuthenticated,
    errorMessage: errorMessage,
  });
};

exports.postRegister = (req, res, next) => {
  const name = req.body.name.trim();
  const email = req.body.email.trim();
  const password = req.body.password.trim();

  User.findAll({
    where: { [Op.or]: [{ name: name }, { email: email }] },
  })
    .then((users) => {
      if (users.length > 0) {
        req.session.errorMessage = "This email address in use.";
        req.session.save(function (err) {
          console.log(err);
          return res.redirect("/register");
        });
      }

      return bcrypt.hash(password, 10);
    })
    .then((hashedPassword) => {
      const newUser = new User({
        name: name,
        email: email,
        password: hashedPassword,
      });
      return newUser.save();
    })
    .then(() => res.redirect("/login"))
    .catch((err) => {
      console.log(err);
    });
};

exports.getReset = (req, res, next) => {
  res.render("account/reset", {
    path: "/reset",
    title: "Reset",
    isAuthenticated: req.session.isAuthenticated,
  });
};

exports.postReset = (req, res, next) => {
  res.redirect("/login");
};

exports.getLogout = (req, res, next) => {
  req.session.destroy((err) => {
    console.log(err);
    res.redirect("/");
  });
};
