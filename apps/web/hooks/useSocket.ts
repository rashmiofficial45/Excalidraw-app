import { useEffect, useState } from "react";
import { WS_URL } from "../config";

export function useSocket() {
    const [loading, setLoading] = useState<boolean>(true);
    const [socket, setSocket] = useState<WebSocket>();
    useEffect(() => {
      const ws = new WebSocket(
        `${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiIwY2RkZTkyNC1jNDBlLTQ1YjAtYTYyNi02M2JjODBjMzRlMmYiLCJpYXQiOjE3NDMxNzIyMTJ9.oiWedS615XRp_RgWl8d3bInCwxRqRphbMDzZI6Joj40`
      );
      ws.onopen = () => {
        setLoading(false)
        setSocket(ws)
      }
    }, [])
    return {socket,loading}
}
