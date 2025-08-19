const { v4: uuidv4 } = require("uuid");
const WebSocket = require('ws');

// Create WebSocket server
const PORT = process.env.PORT || 6002;
const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});


const broadcast = (senderId, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.id !== senderId) {
            try {
                client.send(`Client Id: ${senderId}, message: ${message}`);
            } catch (err) {
                console.error(`Error sending message to Client ${client.id}: ${err.message}`);
            }
        }
    });
};


wss.on("connection", (ws) => {
    ws.id = uuidv4();
    console.log(`New Client Connected (ID: ${ws.id})  Total clients: ${wss.clients.size}`);
    
    ws.on("message", (msg) => {
        try {
            ws.send(`From Server: ${msg.toString()}`)
            broadcast(ws.id, msg.toString());
        } catch (err) {
            console.error(`Error processing message from Client ${ws.id}: ${err.message}`);
            ws.send(err.message);
        }
    });

    
    ws.on("close", () => {
        console.log(`Client ${ws.id} Disconnected  Total clients: ${wss.clients.size}`);
    });


    ws.on("error", (err) => {
        console.error(`WebSocket Error from Client ${ws.id}: ${err.message}`);
        ws.send(err.message);
    });
});


wss.on("error", (err) => {
    console.error(`WebSocket Server Error: ${err.message}`);
    ws.send(err.message);
});
