import { WebSocketServer } from 'ws'

const wss = new WebSocketServer({ port: 8080 })

wss.on('connection', (ws) => {
    console.log('Client connected')
    ws.on('message', (message) => {
        // 广播收到的消息给所有连接的客户端
        wss.clients.forEach((client) => {
            if (client !== ws) {
                client.send(message)
            }
        })
    })

    ws.on('close', () => {
        console.log('Client disconnected')
    })
})

console.log('Signaling server running on ws://localhost:8080')
