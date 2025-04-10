import RoomCanvas from "../../../components/RoomCanvas";

const CanvasPage = async({ params }: { params: { roomId: number } }) => {
    const roomId = (await params).roomId
    console.log(roomId)
    if (!roomId) {
        return
    }
    return (
        <RoomCanvas roomId={roomId}/>
    )
};

export default CanvasPage;
