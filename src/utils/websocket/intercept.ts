type WsSend = (this: WebSocket, data: string | Blob | BufferSource) => void

interface PacketData {
  uid: number
  roomid: number
  protover: number
  buvid: string
  support_ack: boolean
  queue_uuid: string
  scene: string
  platform: string
  type: number
  key: string
}

/** 修改ws连接成功后的发送的第一个数据包以在直播页获取弹幕 */
export function useWsIntercept() {
  let wsOriginalSend: WsSend | null = null

  function modifyUidPacket(data: ArrayBuffer): ArrayBuffer {
    const jsonStart = 16
    const jsonBytes = new Uint8Array(data, jsonStart)
    const jsonString = new TextDecoder().decode(jsonBytes)
    const jsonObj: PacketData = JSON.parse(jsonString)

    jsonObj.uid = 0

    const newJsonBytes = new TextEncoder().encode(JSON.stringify(jsonObj))
    const newPacket = new ArrayBuffer(16 + newJsonBytes.length)
    const newView = new DataView(newPacket)
    const originalView = new DataView(data)

    for (let i = 0; i < 16; i++) {
      newView.setUint8(i, originalView.getUint8(i))
    }

    newView.setUint32(0, newJsonBytes.length + 16, false)
    new Uint8Array(newPacket, 16).set(newJsonBytes)

    return newPacket
  }

  function start(): void {
    if (wsOriginalSend) return

    wsOriginalSend = WebSocket.prototype.send

    WebSocket.prototype.send = function (data: string | Blob | BufferSource): unknown {
      if (data instanceof ArrayBuffer) {
        const view = new DataView(data)

        if (view.getUint32(8, false) === 7) {
          return wsOriginalSend!.call(this, modifyUidPacket(data))
        }
      }
      return wsOriginalSend!.call(this, data)
    }
  }

  function stop(): void {
    if (!wsOriginalSend) return

    WebSocket.prototype.send = wsOriginalSend
    wsOriginalSend = null
  }

  return { start, stop }
}

const { start, stop } = useWsIntercept()

export { start, stop }
