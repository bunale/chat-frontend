import { Server } from 'ws'

// 用户id和连接对象的映射
const userIdToClientMap = new Map()

// 创建 WebSocket 服务器，监听 8080 端口
const wss = new Server({ port: 8080 })

wss.on('connection', (ws, req) => {
    // 获取路径上的userId，并和连接对象绑定
    const userId = Number(req.url.substring(1))
    if (!userId) {
        ws.send('userId is required')
        return
    }
    userIdToClientMap.set(userId, ws)

    // 监听消息
    ws.on('message', (data) => {
        // 将二进制数据转换为字符串，然后解析为对象
        const message = JSON.parse(data.toString())
        console.log('message: ', message)

        let scene = message.scene
        switch (scene) {
            case 'videoCall':
                resolveVideoCallMessage(message)
                break
            default:
                console.log('unknown scene: ', scene)
                break
        }
    })

    // 监听连接关闭
    ws.on('close', () => {
        console.log('Client disconnected')
    })
})

// 处理视频通话消息
const resolveVideoCallMessage = (message) => {
    if (message.data.sign === 'offer') {
        let to = message.data.to
        let toWs = userIdToClientMap.get(to)
        if (!toWs) {
            console.log('toWs is null')
            return
        }

        toWs.send(
            JSON.stringify({
                scene: 'videoCall',
                data: {
                    sign: 'offer',
                    from: message.data.from,
                    to: message.data.to,
                    data: message.data.data,
                },
            })
        )
    } else if (message.data.sign === 'answer') {
        let to = message.data.to
        let toWs = userIdToClientMap.get(to)
        if (!toWs) {
            console.log('toWs is null')
            return
        }

        toWs.send(
            JSON.stringify({
                scene: 'videoCall',
                data: {
                    sign: 'answer',
                    from: message.data.from,
                    to: message.data.to,
                    data: message.data.data,
                },
            })
        )
    } else if (message.data.sign === 'candidate') {
        let to = message.data.to
        let toWs = userIdToClientMap.get(to)
        if (!toWs) {
            console.log('toWs is null')
            return
        }

        toWs.send(
            JSON.stringify({
                scene: 'videoCall',
                data: {
                    sign: 'candidate',
                    from: message.data.from,
                    to: message.data.to,
                    data: message.data.data,
                },
            })
        )
    } else {
        console.log('unknown sign: ', message.sign)
    }
}

console.log('Signaling server running on ws://localhost:8080')
