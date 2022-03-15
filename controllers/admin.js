const Product = require("../models/product");
const Category = require("../models/category");

exports.getProducts = (req, res, next) => {
  Product.findAll()
    .then((products) => {
      res.render("admin/products", {
        title: "Admin Products",
        products: products,
        path: "/admin/products",
        action: req.query.action,
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getAddProduct = (req, res, next) => {
  Category.findAll()
    .then((categories) => {
      res.render("admin/add-product", {
        title: "New Product",
        path: "/admin/add-product",
        categories: categories,
        isAuthenticated: req.session.isAuthenticated,
      });
    })
    .catch();
};

exports.postAddProduct = (req, res, next) => {
  const name = req.body.name;
  const price = req.body.price;
  const imageUrl = req.body.imageUrl;
  const description = req.body.description;
  const categoryId = req.body.categoryId;
  const user = req.user;

  user
    .createProduct({
      name: name,
      price: parseInt(price),
      imageUrl: imageUrl,
      description: description,
      categoryId: categoryId
    })

    // Product.create({
    //   name: name,
    //   price: parseInt(price),
    //   imageUrl: imageUrl,
    //   description: description,
    //   categoryId: categoryId,
    //   userId: user.id
    // })
    .then((result) => {
      console.log(result);
      res.redirect("/");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.getEditProduct = (req, res, next) => {
  Product.findByPk(req.params.productid)
    .then((product) => {
      if (!product) {
        return res.redirect("/");
      }
      Category.findAll()
        .then((categories) => {
          res.render("admin/edit-product", {
            title: "Edit Product",
            path: "/admin/products",
            isAuthenticated: req.session.isAuthenticated,
            product: product,
            categories: categories,
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

exports.postEditProduct = (req, res, next) => {
  const id = req.body.id;
  const name = req.body.name;
  const imageUrl = req.body.imageUrl;
  const price = req.body.price;
  const description = req.body.description;
  const categoryId = req.body.categoryId;

  Product.findByPk(id)
    .then((product) => {
      product.name = name;
      product.imageUrl = imageUrl;
      product.description = description;
      product.price = parseInt(price);
      product.categoryId = categoryId;
      return product.save();
    })
    .then((result) => {
      res.redirect("/admin/products?action=edit");
    })
    .catch((err) => {
      console.log(err);
    });
};

exports.postDeleteProduct = (req, res, next) => {
  const id = req.body.productid;

  Product.findByPk(id)
    .then((product) => {
      return product.destroy();
    })
    .then(() => {
      res.redirect("/admin/products?action=delete");
    })
    .catch((err) => {
      console.log(err);
    });
};
