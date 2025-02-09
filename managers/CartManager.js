const fs = require("fs");
const path = require("path");

class CartManager {
    constructor(filePath){
        this.filePath = path.resolve(filePath);
        this.carts = this.loadCarts();
    }

    loadCarts(){
        try {
            if (!fs.existsSync(this.filePath)) return [];
            const data = fs.readFileSync(this.filePath, "utf-8");
            if (data.trim() === "") {
                return []; 
            }
            return JSON.parse(data);
        } catch (error) {
            console.error("Error loading carts: ", error);
            return [];
        }
    }

    saveCarts(){
        fs.writeFileSync(this.filePath, JSON.stringify(this.carts, null, 2));
    }
    
    createCart(){
        const newCart = {
            id: this.carts.length ? Math.max(...this.carts.map(c => c.id)) + 1 : 1,
            products: []
        };
        this.carts.push(newCart);
        this.saveCarts();
        return newCart;
    }

    getCartById(id) {
        return this.carts.find(cart => cart.id === id) || null;
    }

    addProductToCart(cartId, productId){
        const cart = this.getCartById(cartId);
        if (!cart) throw new Error("Carrito no encontrado");

        const productIndex = cart.products.findIndex(p => p.product === productId);
        if (productIndex !== -1){

            cart.products[productIndex].quantity += 1;
        }else {
            
            cart.products.push({product: productId, quantity: 1});
        }

        this.saveCarts();
    }

    removeProductFromCarts(productId){
        this.carts.forEach(cart => {
            cart.products = cart.products.filter(p => p.product !== productId);
        });
        this.saveCarts();
    }
}

module.exports = CartManager;