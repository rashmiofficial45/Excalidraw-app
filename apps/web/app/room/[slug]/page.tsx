// ChatRoomCall.js (Server Component)
import axios from 'axios'
import { BACKEND_URL } from '../../../config'
import { ChatRoom } from '../../../components/ChatRoom'

async function getRoomId(slug: string) {
  const result = await axios.get(`${BACKEND_URL}/room/${slug}`)
  const roomId:number = result.data.roomId
  return roomId
}

async function ChatRoomCall({ params }: {
  params: {
    slug: string
  }
}) {
  const {slug} = await params
  const roomId = await getRoomId(slug)
  console.log(roomId)
  return <ChatRoom id={roomId} />
}

export default ChatRoomCall