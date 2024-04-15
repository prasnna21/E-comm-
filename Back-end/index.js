const port = 4000;
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require("multer");
const path = require("path");
const cors = require("cors");
const { type } = require("os");

app.use(express.json());
app.use(cors());

//Database connection with MongoDB
mongoose.connect("mongodb://localhost:27017/Shopping");

//API creation
app.get("/", (req, resp) => {
  resp.send("express app is running");
});

//Image Storage Engine
const storage = multer.diskStorage({
  destination: "./upload/images",
  filename: (req, file, cb) => {
    return cb(
      null,
      `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`
    );
  },
});
const upload = multer({ storage: storage });

// Creating Upload Endpoint for Images
app.use("/images", express.static("upload/images"));

app.post("/upload", upload.single("product"), (req, resp) => {
  resp.json({
    success: 1,
    image_url: `http://localhost:${port}/images/${req.file.filename}`,
  });
});

// Schema for Creating Products
const Product = mongoose.model("Products", {
  id: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  new_price: {
    type: Number,
    required: true,
  },
  old_price: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  available: {
    type: Boolean,
    default: true,
  },
});

//Add Product API
app.post("/addproduct", async (req, resp) => {
  // id automatically get
  let products = await Product.find({});
  let id;
  if (products.length > 0) {
    let last_product_array = products.slice(-1);
    let last_product = last_product_array[0];
    id = last_product.id + 1;
  } else {
    id = 1;
  }
  // id automatically get

  const product = new Product({
    id: id,
    name: req.body.name,
    image: req.body.image,
    category: req.body.category,
    new_price: req.body.new_price,
    old_price: req.body.old_price,
  });
  console.log(product);
  await product.save();
  console.log("saved");
  resp.json({
    success: true,
    name: req.body.name,
  });
});

//Creating API for deleting Products

app.post("/removeproduct", async (req, resp) => {
  await Product.findOneAndDelete({ id: req.body.id });
  console.log("Removed");
  resp.json({
    success: true,
    name: req.body.name,
  });
});

//Creating API for getting all products
app.get("/allproducts", async (req, resp) => {
  let products = await Product.find({});
  console.log("All Products Fetched");
  resp.send(products);
});

//Schemas Creating for  User Model
const Users = mongoose.model("Users", {
  name: {
    type: String,
  },
  email: {
    type: String,
    unique: true,
  },
  password: {
    type: String,
  },
  cartData: {
    type: Object,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

//Creating Endpoint for registering the users
app.post("/signup", async (req, resp) => {
  let check = await Users.findOne({ email: req.body.email });
  if (check) {
    return resp
      .status(400)
      .json({ success: false, error: "existing user found with same email " });
  }
  let cart = {};
  for (let i = 0; i < 300; i++) {
    cart[i] = 0;
  }
  const user = new Users({
    name: req.body.username,
    email: req.body.email,
    password: req.body.password,
    cartData: cart,
  });

  await user.save();

  const data = {
    user: {
      id: user.id,
    },
  };

  const token = jwt.sign(data, "secret_ecom");
  resp.json({ success: true, token });
});

//Creating endpoint for user login
app.post("/login", async (req, resp) => {
  let user = await Users.findOne({ email: req.body.email });
  if (user) {
    const passCompare = req.body.password === user.password;
    if (passCompare) {
      const data = {
        user: {
          id: user.id,
        },
      };

      const token = jwt.sign(data, "secret_ecom");
      resp.json({ success: true, token });
    } else {
      resp.json({ success: false, errors: "Wrong Password" });
    }
  } else {
    resp.json({ success: false, errors: "Wrong Email Addressed" });
  }
});

//Creating Endpoint for newcollection data
app.get("/newcollections", async (req, resp) => {
  let products = await Product.find({});
  let newcollection = products.slice(1).slice(-8);
  console.log("NewCollection Fetched");
  resp.send(newcollection);
});

// Creating Endpoint for popular in women section
app.get("/popularwomen", async (req, resp) => {
  let products = await Product.find({ category: "women" });
  let popular_in_women = products.slice(0, 4);
  console.log("Popular In Women Fetched");
  resp.send(popular_in_women);
});

// creating Middleware to Fetch user
const fetchUser = async (req, resp, next) => {
  const token = req.header("auth-token");
  if (!token) {
    resp.status(401).send({ errors: "Please authenticate using valid token" });
  } else {
    try {
      const data = jwt.verify(token, "secret-ecom");
      req.user = data.user;
      next();
    } catch (error) {
      resp
        .status(401)
        .send({ errors: "Please authenticate using a valid token" });
    }
  }
};

//creating endpoint for adding products in cartdata
app.post("/addtocart", fetchUser, async (req, resp) => {
  console.log("Added", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  userData.cartData[req.body.itemId] += 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  resp.send("Added");
});

//Creating endpoint to remove product from cartdata
app.post("/removefromcart", fetchUser, async (req, resp) => {
  console.log("Removed", req.body.itemId);
  let userData = await Users.findOne({ _id: req.user.id });
  if (userData.cartData[req.body.itemId] > 0)
    userData.cartData[req.body.itemId] -= 1;
  await Users.findOneAndUpdate(
    { _id: req.user.id },
    { cartData: userData.cartData }
  );
  resp.send("Removed");
});

// app.post("/addtocart", fetchUser, async (req, resp) => {
//   console.log(req.body, req.user);
// });

// Creating Endpoint to get Cartdata
app.post("/getcart", fetchUser, async (req, resp) => {
  console.log("Getcart");
  let userData = await Users.findOne({ _id: req.user.id });
  resp.json(userData.cartData);
});

app.listen(port, (error) => {
  if (!error) {
    console.log("server running on port " + port);
  } else {
    console.log("error : " + error);
  }
});
