const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const adminRoutes = require("./routes/admin");
const userRoutes = require("./routes/shop");
const errorsController = require("./controllers/errors");
const path = require("path");
const sequelize = require("./utility/database");
const Category = require("./models/category");
const Product = require("./models/product");
const User = require("./models/user");
const Cart = require("./models/cart");
const CartItem = require("./models/cartItem");
const Order = require("./models/order");
const OrderItem = require("./models/orderItem");
const accountRoutes = require("./routes/account");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const csurf = require('csurf')
var SequelizeStore = require("connect-session-sequelize")(session.Store);

app.set("view engine", "pug");
app.set("views", "./views");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
var myStore = new SequelizeStore({
  db: sequelize,
});
app.use(
  session({
    secret: "keyboard cat",
    store: myStore,
    resave: false,
    proxy: true,
    saveUninitialized: false,
    cookie: {
      maxAge: 3600000,
    },
  })
);
myStore.sync();
app.use(express.static(path.join(__dirname, "public")));

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }

  User.findByPk(req.session.user.id)
    .then((user) => {
      req.user = user;
      next();
    })
    .catch((err) => {
      console.log(err);
    });
});

app.use(csurf())
app.use("/admin", adminRoutes);
app.use(userRoutes);
app.use(accountRoutes);

Product.belongsTo(Category, {
  foreignKey: {
    allowNull: false,
  },
});
Category.hasMany(Product);
Product.belongsTo(User);
User.hasMany(Product);

User.hasOne(Cart);
Cart.belongsTo(User);

Cart.belongsToMany(Product, { through: CartItem });
Product.belongsToMany(Cart, { through: CartItem });

Order.belongsTo(User);
User.hasMany(Order);

Order.belongsToMany(Product, { through: OrderItem });
Product.belongsToMany(Order, { through: OrderItem });


sequelize
  //.sync({ force: true })
  .sync()
  .then(() => {
    Category.count().then((count) => {
      if (count === 0) {
        Category.bulkCreate([
          { name: "Telefon", description: "telefon" },
          { name: "Bilgisayar", description: "bilgisayar" },
        ]);
      }
    });
  })
  .catch((err) => console.log(err));

app.use(errorsController.get404Page);

app.listen(3000, () => {
  console.log("listening on port 3000");
});
