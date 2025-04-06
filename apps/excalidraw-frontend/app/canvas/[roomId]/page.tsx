"use client"
import React, { useEffect, useRef } from 'react'

type Props = {}

const Canvas = (props: Props) => {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    useEffect(()=>{
        const canvas = canvasRef.current
        if (canvas){
            const ctx = canvas.getContext("2d")
            if(!ctx){
                return
            }
            ctx.strokeRect(50,50,100,100)
            let isClicked = false
            let startX = 0
            let startY = 0
            canvas.addEventListener("mousedown",(e)=>{
                isClicked = true
                startX = e.clientX
                startY = e.clientY
                console.log(e.clientX, e.clientY)
            })
            canvas.addEventListener("mouseup",(e)=>{
                isClicked = false
                console.log(e.clientX, e.clientY)
            })
            canvas.addEventListener("mousemove",(e)=>{
                if(isClicked){
                    const width = e.clientX - startX
                    const height = e.clientY - startY
                    // ctx.lineTo(e.clientX, e.clientY)
                    // ctx.stroke()
                    ctx.clearRect(0,0,canvas.width,canvas.height)
                    ctx.strokeRect(startX,startY,width,height)
                }
                console.log(e.clientX, e.clientY)
            })
        }
    },[canvasRef])
  return (
    <canvas ref={canvasRef} className='bg-white' height={1000} width={1000}>Canvas</canvas>
  )
}

export default Canvas