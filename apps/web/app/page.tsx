"use client"
import { useRouter } from "next/navigation";
import { useState } from "react";
export default function Home() {
  const router = useRouter()
  const [slug, setSlug] = useState("")
  return (
    <>
      <main className="h-screen w-full p-10 ">
        {/* Installed tailwind 4 */}
        <div className="flex font-semibold">
          <input className="border-2 px-2 rounded-lg" onChange={(e) => { setSlug(e.target.value) }} type="text" placeholder="Slug" />
          <button className="rounded-xl border border-slate-400 cursor-pointer ml-2 px-3" onClick={() => {
            router.push(`room/${slug}`)
          }}>Join Room</button>
        </div>
      </main>
    </>
  );
}
