import React from "react"
import Header from "./components/Header"
import Camera from "./components/Camera"
import "./App.css"
import Advert from "./components/Advert"

export default function App() {
    const queryParams = new URLSearchParams(window.location.search)
    const cameraID = queryParams.get("cameraID")
    const slotID = queryParams.get("slotID")
    let CameraField
    if(cameraID){
        CameraField = cameraID.split(",").map(id =>(<Camera className = "Camera" cameraID={id}/>))
    }else{
        CameraField = (<Camera className="Camera" cameraID={cameraID} />)
    }
    return (
        <main>
            {slotID?
            <Advert slotID={slotID} cameraID={cameraID} />
            :
            <div>
                <Header />
                <div className="CameraFields">
                    {CameraField}
                </div>
            </div>}
        </main>
    );
}

