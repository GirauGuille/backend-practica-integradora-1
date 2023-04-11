import express from "express";
import handlebars from "express-handlebars";
import { Server } from "socket.io";
import routers from "./src/routers/index.routers.js";
import { __dirname } from "./src/utils.js";
import ProductManager from "./src/dao/fs/productManagerFS.js";
//import ProductManager from "./src/dao/mongo/productManagerMongo.js";
import ChatManager from "./src/dao/mongo/chatManagerMongo.js";
import "./src/db/dbConfig.js";

const app = express();
const PORT = 8080;
const productManager = new ProductManager();
const chatManager = new ChatManager();

/* middlewares */
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));

/* handlebars */
app.engine(
  "hbs",
  handlebars.engine({
    extname: "hbs",
    defaultLayout: "main.hbs",
    layoutsDir: __dirname + "/views/layouts",
  })
);
app.set("views", __dirname + "/views");
app.set("view engine", "hbs");

/* routers */
app.use("/", routers);
app.use("/api", routers);

/* server */
const httpServer = app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${httpServer.address().port}`);
  console.log(`http://localhost:${PORT}`);
});
httpServer.on("error", error =>
  console.log(`Error en servidor: ${error.message}`)
);

/* webSocket */
const socketServer = new Server(httpServer);
socketServer.on("connection", async socket => {
  const products = await productManager.getAll();
  const messages = await chatManager.getAllMessages();

  socket.emit("products", products);

  socket.on("newProduct", async data => {
    await productManager.addProduct(data);
    socket.emit("products", products);
  });

  socket.on("deleteProduct", async id => {
    const products = await productManager.deleteById(id);
    socket.emit("products", products);
  });

  socket.emit("messages", messages);

  socket.on("newMessage", async data => {
    await chatManager.addMessage(data);
    socket.emit("messages", messages);
  });
});
