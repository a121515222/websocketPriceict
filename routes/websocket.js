const WebSocket = require("ws");
const { v4: uuidv4 } = require("uuid");
const wss1 = new WebSocket.WebSocketServer({ noServer: true });

wss1.on("connection", function connection(ws) {
  ws.on("error", console.error);
  console.log("連線成功");
  const id = uuidv4();
  // 給client一個id
  ws.id = id;
  // 連線成功後，回傳給前端一個id 這兩個id必須一樣
  ws.send(JSON.stringify({ context: "connect", id }));
  // 接收前端訊息
  ws.on("message", function message(data) {
    const { context, message, id } = JSON.parse(data);
    const newMessage = {
      context,
      message,
      id,
    };
    // 如果是訊息，就廣播出去
    if(context === "message"){
      broadcast(newMessage);
    }
  });
});

const broadcast = (message) => {
  wss1.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.id !== message.id) {
      client.send(JSON.stringify(message));
    }
  });
};

module.exports = wss1;
