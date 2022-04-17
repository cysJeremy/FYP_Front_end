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
    const slot = queryParams.get("slot")
    return (
        <main>
            {slot?
            <Advert slot={slot}/>
            :
            <div>
                <Header />
                <Camera className="Camera"/>
            </div>}
        </main>
    );
}

