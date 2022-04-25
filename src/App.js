import React from "react"
import Header from "./components/Header"
import Camera from "./components/Camera"
import "./App.css"
import Advert from "./components/Advert"

export default function App() {
  //const [mode, setMode] = React.useState(0)
  /*  const [modeList, setModeList] = React.useState(["camera","video","picture"])
    
    const [type, setType] = React.useState("camera")*/
    
    
   /* function modeSelect(name){
        for(let i = 0; i < modeList.length ; ++i){
            if(name === modeList[i]){
                setMode(i);
                return;
            }
        }
    }*/
    //
    
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
                {CameraField}
            </div>}
        </main>
    );
}

