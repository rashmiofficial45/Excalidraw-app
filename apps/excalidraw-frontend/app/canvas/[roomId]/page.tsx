import Canvas from "../../../components/Canvas";

const CanvasPage = async({ params }: { params: { roomId: number } }) => {
    const roomId = (await params).roomId
    console.log(roomId)
    if (!roomId) {
        return
    }
    return (
        <Canvas roomId={roomId}/>
    )
};

export default CanvasPage;
