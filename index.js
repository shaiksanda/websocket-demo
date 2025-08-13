const { v4: uuidv4 } = require("uuid");
const WebSocket = require('ws'); // load the 'ws' library
// create a WebSocket server that listens on port 8080
const wss = new WebSocket.Server({ port: 6002 }, () => {
    console.log('WebSocket server listening on ws://localhost:6002');
});

const broadcast = (senderId, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.id !== senderId) {
            client.send(`Client ${senderId}: ${message}`);
        }
    });
};


wss.on("connection", (ws) => {
    ws.id = uuidv4()
    console.log(`New Client Connected (ID: ${ws.id})  Total clients: ${wss.clients.size}`);

    ws.send(`Welcome! You are Client ${ws.id}`);

    ws.on("message", (msg) => {
        console.log(`Message From Client ${ws.id}: ${msg}`);
        
        ws.send(`Server Received: ${msg}`);

        broadcast(ws.id, msg)
    });

    ws.on("close", () => {
        console.log(`A Client ${ws.id} Disconnected,  Total clients: ${wss.clients.size}`);
        
    });

    ws.on("error", (err) => {
        console.log(`WebSocket Error from Client ${ws.id}: ${err}`);
    });
})