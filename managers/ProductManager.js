const fs = require("fs");
const path = require("path");
const CartManager = require("./CartManager");

class ProductManager {
    constructor(filePath) {
        this.filePath = path.resolve(filePath);
        this.products = this.loadProducts();
    }

    loadProducts() {
        try {
            if (!fs.existsSync(this.filePath)) return [];
            const data = fs.readFileSync(this.filePath, "utf-8");
            return JSON.parse(data);
        } catch (error) {
            console.error("Error loading products:", error);
            return [];
        }
    }

    saveProducts(){
        fs.writeFileSync(this.filePath, JSON.stringify(this.products, null, 2));
    }

    addProduct(title, description, price, thumbnails = [], code, stock, category, status = true) {
        console.log({ title, description, price, code, stock, category, status });

        if (!title || !description || !price || !code || !stock || !category) {
            throw new Error("Todos los campos son obligatorios.");
        }
        if (this.products.some(product => product.code === code)) {
            throw new Error(`El código "${code}" ya existe.`);
        }

        const newProduct = {
            id: this.products.length ? Math.max(...this.products.map(p=> p.id)) + 1 : 1,
            title,
            description,
            price,
            thumbnails,
            code,
            stock,
            category,
            status
        };

        this.products.push(newProduct);
        this.saveProducts();
        return newProduct;
    }

    getProducts() {
        return this.products;
    }

    getProductById(id) {
        return this.products.find(product => product.id === id) || null;
    }

    updateProduct(id, updatedFields){
        const index = this.products.findIndex(product => product.id === id);
        if(index === -1) {
            return { status: 404, message: "Producto no encontrado" };
        }

        if (updatedFields.id && updatedFields.id !== id){
            return { status: 400, message: "No puedes modificar la ID del producto" };
        }

        this.products[index] = {... this.products[index], ...updatedFields, id};
        this.saveProducts();
        return { status: 200, message: "Producto actualizado con éxito", product: this.products[index] };
    }

    deleteProduct(id){
        const index = this.products.findIndex(product => product.id === id);
        if (index === -1) return null;
    
        const deletedProduct = this.products.splice(index, 1);
        this.saveProducts();
    
        const cartManager = new CartManager(path.join(__dirname, "../data/carts.json"));
        cartManager.removeProductFromCarts(id);
    
        return deletedProduct;
    }
    
}

module.exports = ProductManager;
