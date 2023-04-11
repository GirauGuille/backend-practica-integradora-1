import { Router } from "express";
import ProductManager from "../../dao/fs/productManagerFS.js";
import ChatManager from "../../dao/mongo/chatManagerMongo.js";

const router = Router();
const productManager = new ProductManager();
const chatManager = new ChatManager();

/* home */
router.get("/", async (req, res) => {
  const products = await productManager.getAll();
  res.render("home", {
    style: "home.css",
    title: "Home",
    products: products,
  });
});

/* realTimeProducts */
router.get("/realtimeproducts", async (req, res) => {
  const products = await productManager.getAll();
  res.render("realTimeProducts", {
    style: "realTimeProducts.css",
    title: "Real Time Products",
    products: products,
  });
});

/* chat */
router.get("/chat", async (req, res) => {
  const messages = await chatManager.getAllMessages();
  res.render("chat", {
    style: "chat.css",
    title: "Chat",
    messages: messages,
  });
});

export default router;
