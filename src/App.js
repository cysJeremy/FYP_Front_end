import React from "react"
import Header from "./components/Header"
import Camera from "./components/Camera"
import "./App.css"
import Advert from "./components/Advert"

export default function App() {
    const queryParams = new URLSearchParams(window.location.search)
    const cameraID = queryParams.get("cameraID")
    const slotID = queryParams.get("slotID")
    const APIPort = queryParams.get("APIPort") 
    let CameraField
    if(cameraID){
        CameraField = cameraID.split(",").map(id =>(
        <Camera className = "Camera" cameraID={id} port={APIPort} />))
    }else{
        CameraField = (<Camera className="Camera" cameraID={cameraID} port={APIPort} />)
    }
    return (
        <main>
            {slotID?
            <Advert slotID={slotID} cameraID={cameraID} port={APIPort}/>
            :
            <div>
                <Header />
                {CameraField}
            </div>}
        </main>
    );
}

