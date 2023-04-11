import { messagesModel } from "../models/messages.model.js";

export default class ChatManager {
  async getAllMessages() {
    try {
      const allMessages = await messagesModel.find();
      return allMessages;
    } catch (error) {
      console.log(`Error obteniendo todos los mensajes: ${error.message}`);
    }
  }

  async addMessage(objMessage) {
    try {
      const message = await messagesModel.create(objMessage);
      return message;
    } catch (error) {
      console.log(`Error agregando mensaje: ${error.message}`);
    }
  }

  async deleteMessage(id) {
    try {
      const message = await messagesModel.deleteOne({ _id: id });
      return message;
    } catch (error) {
      console.log(`Error eliminando mensaje: ${error.message}`);
    }
  }
}
