import axios from 'axios'
import { BACKEND_URL } from '../../../config'

async function getRoomId(slug:string) {
  const result = await axios.get(`${BACKEND_URL}/room/${slug}`)
  return result.data.id
}
async  function ChatRoom({ params }: {
  params: {
    slug: string
  }
}) {
  const slug = params.slug
  const roomId = await getRoomId(slug)
}

export default ChatRoom