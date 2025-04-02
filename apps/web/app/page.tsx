"use client"
import { useRouter } from "next/navigation";
import styles from "./page.module.css"
import { useState } from "react";
export default function Home() {
  const router = useRouter()
  const [roomId, setRoomId] = useState("")
  return (
    <>
      <div className={styles.page}>
        <div className="bg-amber-500">
              heyyy there
        </div>
        <input onChange={(e) => { setRoomId(e.target.value) }} type="text" placeholder="roomId" />
        <button onClick={()=>{
          router.push(`room/${roomId}`)
        }}>Join Room</button>
      </div>
    </>
  );
}
