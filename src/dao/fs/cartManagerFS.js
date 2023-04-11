import FileManager from "./fileManagerFS.js";

export default class CartManager {
  constructor() {
    this.archivo = "src/db/jsons/products.json";
    this._fileManager = new FileManager(this.archivo);
  }

  async createCart() {
    try {
      /* busco si el archivo no existe o si existe, si tiene datos*/
      if (!this._fileManager.exists(this.archivo)) {
        /* Si el archivo no existe, lo creo con el primer carrito agregado */
        console.log("Se crea archivo");
        let cartsArray = [];
        const cart = {
          id: this.#idGenerator(),
          products: [],
        };
        cartsArray.push(cart);
        console.log("Agregando carrito...");
        await this._fileManager.writeFile(this.archivo, cartsArray);
        console.log(`Se agrego el carrito con el id: ${cart.id}`);
        return cart.id;
      } else {
        /* si el archivo existe, primero verifico si esta vacio */
        if (this._fileManager.readFile(this.archivo)) {
          console.log("Leyendo archivo...");
          const cartsArray = await this._fileManager.readFile(this.archivo);
          if (cartsArray.length === 0 || !cartsArray) {
            /* si esta vacio no le paso parametro al idGenerator, por lo que le pondra id: 1 */
            const cart = {
              id: this.#idGenerator(),
              products: [],
            };
            cartsArray.push(cart);
          } else {
            /* si ya tiene algun producto, le paso el array de productos como parametro al idGenerator para que le ponga el id correspondiente */
            const cart = {
              id: this.#idGenerator(cartsArray),
              products: [],
            };
            cartsArray.push(cart);
          }
          console.log("Agregando carrito...");
          /* escribo el producto */
          this._fileManager.writeFile(this.archivo, cartsArray);
          console.log(`Se agrego el carrito con el id: ${cart.id}`);
          return cart.id;
        }
      }
    } catch (error) {
      console.log(`Error agregando producto: ${error.message}`);
    }
  }

  async getById(id) {
    try {
      /* chequeo si existe el documento */
      if (this._fileManager.exists(this.archivo)) {
        const cartsArray = await this._fileManager.readFile(this.archivo);
        /* uso find para buscar el carrito que coincida con el id solicitado */
        const cartId = cartsArray.find(item => item.id === id);
        if (!cartId) {
          throw new Error("No se encontro el carrito con el id solicitado");
        } else {
          console.log(`Carrito con el id ${id} encontrado:\n`, cartId);
          return cartId;
        }
      }
    } catch (error) {
      console.log(`Error al buscar carrito con el id ${id}: ${error.message}`);
    }
  }

  async addToCart(cid, pid) {
    try {
      /* chequeo si existe el documento */
      if (this._fileManager.exists(this.archivo)) {
        const cartsArray = await this._fileManager.readFile(this.archivo);
        const cart = await cartsArray.find(item => item.id === cid);
        if (cart) {
          const addProduct = await cart.products.find(
            item => item.product === pid
          );
          if (addProduct) {
            addProduct.quantity++;
          } else {
            cart.products.push({ product: pid, quantity: 1 });
          }
          await this._fileManager.writeFile(this.archivo, cartsArray);
          return cart;
        } else {
          throw new Error(`No se encontro el carrito con el id: ${cid}`);
        }
      }
    } catch (error) {
      console.log(`Error agregando producto al carrito: ${error.message}`);
    }
  }

  #idGenerator(productsArray = []) {
    const id =
      productsArray.length === 0
        ? 1
        : productsArray[productsArray.length - 1].id + 1;
    return id;
  }
}
