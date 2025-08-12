const WebSocket = require('ws'); // load the 'ws' library
// create a WebSocket server that listens on port 8080
const wss = new WebSocket.Server({ port: 6002 }, () => {
    console.log('WebSocket server listening on ws://localhost:6002');
});
wss.on("connection", (ws, req) => {
    console.log("New Client Connected")
    ws.send("Welcome From Websocket Server!")
    ws.on("message",(msg)=>{
        console.log(`Message From Client: ${msg}`)
        ws.send('Hello from server! I got your message.');
    })
    ws.on("close",()=>{
        console.log("Client Is Disconnected")
    })
    ws.on("error",(err)=>{
        console.log(`Websocket Error: ${err}`)
    })
})