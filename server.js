const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const { engine } = require("express-handlebars");
const path = require("path");

const app = express();
const server = createServer(app);
const io = new Server(server);

const productsRouter = require("./routes/products")(io);
const cartsRouter = require("./routes/carts");
const ProductManager = require("./managers/ProductManager");
const productManager = new ProductManager(path.join(__dirname, "data/products.json"), io);
const PORT = 8080;

//Handlbars
app.engine("handlebars", engine());
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, "public")));

app.use("/api/products", productsRouter);
app.use("/api/carts", cartsRouter);

app.get("/", (req, res) => {
    res.render("home", { products: productManager.getProducts() });
});
app.get("/realtimeproducts", (req, res) => {
    res.render("realTimeProducts");
});

io.on("connection", (socket) => {
    console.log("Socket funciona");

    socket.emit("products", productManager.getProducts());

    socket.on("newProduct", (product) => {
        const newProduct = productManager.addProduct(
            product.title,
            product.description,
            product.price,
            product.thumbnails,
            product.code,
            product.stock,
            product.category,
            product.status
        );
        io.emit("products", productManager.getProducts());
    });


    socket.on("deleteProduct", (id) => {
        productManager.deleteProduct(id);
        io.emit("products", productManager.getProducts());
    });

    socket.on("disconnect", () => {
        console.log("Socket desconectado");
    });
});
server.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
