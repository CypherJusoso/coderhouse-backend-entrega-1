const express = require("express");
const ProductManager = require("../managers/ProductManager");
const path = require("path");

const router = express.Router();
const productManager = new ProductManager(path.join(__dirname, "../data/products.json"));

//Todos los productos
router.get("/", (req, res) => {
    res.json(productManager.getProducts());
});

//Por ID
router.get("/:pid", (req, res) => {
    const product = productManager.getProductById(parseInt(req.params.pid));
    if(!product) return res.status(404).json({error: "Product no encontrado"});
    res.json(product);
});

//Post nuevo producto
router.post("/", (req, res) => {
    try {
        const { title, description, price, thumbnails, code, stock, category, status } = req.body;

        const newProduct = productManager.addProduct(
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        );        
        res.status(201).json(newProduct);
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

router.put("/:pid", (req, res) =>{
    const productId = parseInt(req.params.pid);
    const updatedFields = req.body;

    const result = productManager.updateProduct(productId, updatedFields);

    res.status(result.status).json({ message: result.message, product: result.product || null });
});

router.delete("/:pid", (req, res) => {
    const productId = parseInt(req.params.pid);

    try {
        const deletedProduct = productManager.deleteProduct(productId);
        if(!deletedProduct || deletedProduct.length === 0){
            return res.status(404).json({ error: "Producto no encontrado" });
        }
        res.json({
            message: "Producto eliminado con exito",
            product: deletedProduct[0]
        });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router;

