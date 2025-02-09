const express = require("express");
const CartManager = require ("../managers/CartManager");

const path = require("path");

const router = express.Router();
const cartManager = new CartManager(path.join(__dirname, "../data/carts.json"));

//Nuevo carrito
router.post("/", (req, res) => {
    const newCart = cartManager.createCart();
    res.status(201).json(newCart);
});

router.get("/:cid", (req, res) => {
    const cart = cartManager.getCartById(parseInt(req.params.cid));
    if(!cart) return res.status(404).json({error: "Carrito no encontrado"});
    res.json(cart);
});

//Agregar prod al carrito
router.post("/:cid/product/:pid", (req, res) => {
    try {
        const { cid, pid } = req.params;
        cartManager.addProductToCart(parseInt(cid), parseInt(pid));
        res.json({message: "Producto agregado al carrito"});
    } catch (error) {
        res.status(400).json({error: error.message});
    }
});

module.exports = router;