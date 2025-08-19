const { v4: uuidv4 } = require("uuid");
const WebSocket = require('ws');

// Create WebSocket server
const PORT = process.env.PORT || 6002;
const wss = new WebSocket.Server({ port: PORT }, () => {
    console.log(`WebSocket server listening on ws://localhost:${PORT}`);
});

// Broadcast message to all clients except sender
const broadcast = (senderId, message) => {
    wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN && client.id !== senderId) {
            try {
                client.send(JSON.stringify({
                    type: "broadcast",
                    from: senderId,
                    message
                }));
            } catch (err) {
                console.error(`Error sending message to Client ${client.id}: ${err.message}`);
            }
        }
    });
};

// Handle client connections
wss.on("connection", (ws) => {
    ws.id = uuidv4();
    console.log(`New Client Connected (ID: ${ws.id})  Total clients: ${wss.clients.size}`);

    // Welcome message
    ws.send(JSON.stringify({
        type: "welcome",
        message: `Welcome! You are Client ${ws.id}`
    }));

    // Handle incoming messages
    ws.on("message", (msg) => {
        try {
            console.log(`Message From Client ${ws.id}: ${msg}`);
            // Echo back to sender
            ws.send(JSON.stringify({
                type: "ack",
                message: `Server Received: ${msg}`
            }));
            // Broadcast to others
            broadcast(ws.id, msg);
        } catch (err) {
            console.error(`Error processing message from Client ${ws.id}: ${err.message}`);
            ws.send(JSON.stringify({
                type: "error",
                message: err.message
            }));
        }
    });

    // Handle client disconnect
    ws.on("close", () => {
        console.log(`Client ${ws.id} Disconnected  Total clients: ${wss.clients.size}`);
    });

    // Handle client errors
    ws.on("error", (err) => {
        console.error(`WebSocket Error from Client ${ws.id}: ${err.message}`);
        ws.send(JSON.stringify({
            type: "error",
            message: `Server Error: ${err.message}`
        }));
    });
});

// Handle server errors globally
wss.on("error", (err) => {
    console.error(`WebSocket Server Error: ${err.message}`);
});
