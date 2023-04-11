import { cartsModel } from "../models/carts.model.js";

export default class CartManager {
  async createCart() {
    try {
      const cart = await cartsModel.create({});
      return cart;
    } catch (error) {
      console.log(`Error creando carrito: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      const cart = await cartsModel.findOne({ _id: id }).populate("products");
      return cart;
    } catch (error) {
      console.log(
        `Error buscando el carrito con el id ${id}: ${error.message}`
      );
    }
  }

  async addToCart(cid, pid) {
    try {
    } catch (error) {
      console.log(`Error agregando producto al carrito: ${error.message}`);
    }
  }
}
