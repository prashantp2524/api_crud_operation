import express from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
const app = express();

app.use(express.json());
// app.use(bodyParser);
// app.use(express.urlencoded({ encodeURI: true }));
app.use(bodyParser.urlencoded({ extended: false }));

mongoose
  .connect(
    `mongodb+srv://prashantp:Anilpp@cluster0.cw6lc.mongodb.net/api-practice?authSource=admin&replicaSet=atlas-lvir0o-shard-0&readPreference=primary&ssl=true`
  )
  .then(() => console.log("mongodb connected"))
  .catch((err) => console.log(err));

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

const Product = new mongoose.model("Product", productSchema);

app.get("/", (req, res) => {
  res.json("server ready");
});
app.listen(5000, () => {
  console.log("server listening on port 5000");
});

app.post("/api/product/create", async (req, res) => {
  const product = await Product.create(req.body);
  product.save();

  if (product) {
    return res.status(200).json(product);
  }
});

app.get("/api/product/getall", async (req, res) => {
  const products = await Product.find();

  if (products) {
    return res.status(200).json(products);
  }
});
app.get("/api/product/:id", async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (product) {
    return res.status(200).json(product);
  }
});

app.put("/api/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    useFindAndModify: false,
    runValidators: true,
  });
  product.save();
  // console.log(product);
  return res.status(200).json(product);
});

app.delete("/api/product/:id", async (req, res) => {
  let product = await Product.findById(req.params.id);

  if (!product) {
    return res.status(404).json({ message: "Product not found" });
  }

  await product.deleteOne();
  return res.status(200).json({ message: "product deleted successfully" });
});
