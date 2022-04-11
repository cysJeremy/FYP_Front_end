import React from "react"
import Header from "./components/Header"
import Camera from "./components/Camera"

export default function App() {
  const [mode, setMode] = React.useState(0)
    const [modeList, setModeList] = React.useState(["camera","video","picture"])
    
    const [type, setType] = React.useState("camera")
    
    
    function modeSelect(name){
        for(let i = 0; i < modeList.length ; ++i){
            if(name === modeList[i]){
                setMode(i);
                return;
            }
        }
    }
    //
    return (
        <main>
            <Header />
            <Camera className="Camera"/>
        </main>
    );
}

