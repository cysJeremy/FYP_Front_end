import React,{ useEffect, useState, Fragment} from "react"
import io from 'socket.io-client'
import "./Camera.css"
import Slot from './slot'

export default function Camera(props) {
    const Logo = function(){
        const logo = {
            audi: require("../logo/Audi.png"),
            benz: require("../logo/Benz.png"),
            bmw: require("../logo/BMW.png"),
            honda: require("../logo/Honda.png"),
            hyundai: require("../logo/Hyundai.jpg"),
            infiniti: require("../logo/Infiniti.png"),
            kia: require("../logo/Kia.png"),
            landrover: require("../logo/LandRover.png"),
            lexus: require("../logo/Lexus.png"),
            mini: require("../logo/Mini.png"),
            mazda: require("../logo/Mazda.png"),
            mitsubishi: require("../logo/Mitsubishi.png"),
            nissan: require("../logo/Nissan.png"),
            porsche: require("../logo/Porsche.png"),
            subaru: require("../logo/Subaru.png"),
            suzuki: require("../logo/Suzuki.png"),
            tesla: require("../logo/Tesla.png"),
            toyota: require("../logo/Toyota.png"),
            volkswagen: require("../logo/Volkswagen.png"),
            volvo: require("../logo/Volvo.png")
        };
        
        const getImage = function(name){
            let brand = name.toLowerCase();
            if(brand in logo)
                return logo[brand];
            return require("../logo/Not_result.png");
        };
        
        return {getImage};
    };

    
    let port;
    (props.port)? port = props.port: port = "4000";
    const flask_url = 'http://localhost:' + port + "/";
    //const socket_url = 'ws://localhost:4000/'
    let cameraID
    (props.cameraID? cameraID = props.cameraID:cameraID = "HKUST_001")
    const cameraUrl = flask_url + "getCameraProperties?cameraID="+cameraID
    const [field, setField] = useState([])
    const [cropNum, setCropNum] = useState(0)
    const [mainField, setMainField] = useState()
    const [lastUpdateTime, setLastUpdateTime] = useState(Date().toLocaleString())

    useEffect( () => {
      const socket = io(flask_url);
      socket.on('connect', function(){});
      socket.on("CameraImageUpdated", (arg) => { 
        //console.log(image);
          if (arg === cameraID) //Message applies to all the fields of the same cameraID
          {
              setLastUpdateTime(Date().toLocaleString());
              //console.log(image);
          }
      });
    }, []);

    useEffect(() => {
        getImage();
    },[])


    const getImage = () =>{
        fetch(cameraUrl,{
            method: 'GET',
            headers: { "Content-Type": "application/json" },
            redirect: 'follow'
            })
                .then(res => res.json())
                .then((json) => {
                    //console.log(json);
                    setCropNum(json.number_of_slots);

                    setMainField(<Slot 
                        cameraID={cameraID} 
                        name="Original Camera Input" 
                        image={flask_url + json.main_image_path} 
                        url={flask_url} 
                        className="field_main"
                        />);
                        let name;
                    const newfield = [];
                    for(let i = 0; i < json.number_of_slots; i++){
                        name = json.sub_image_path[i].split("/")
                        name = name[name.length-1].replace(cameraID+"_", "").replace(".jpg","")
                        newfield.push({
                            cameraID:cameraID,
                            key:i+1,
                            name: "Camera-" + cameraID +"-slot-"+ name,
                            image:flask_url + json.sub_image_path[i],
                            des:"detecting",
                        });
                    }
                    //console.log(newfield);
                    setField(newfield);
                })
    }

    const fieldElements = field?field.map(field => (
        <Slot
            cameraID={field.cameraID}
            key={field.key}
            name={field.name}
            image={field.image}  
            des={field.des}
            logo={Logo()}
            url= {flask_url}
            class = "field_slot"
        />
    )):<br/>
          //brand={field.brand} 
    return(
        <div className="Camera">
            {mainField}
            <br/>
            {cropNum !== 0 && <div className="detection_container">
                {fieldElements}
                <br/>
            </div>
            }
            
            <br/>
            
            
            <Fragment>Last Updated: {lastUpdateTime}</Fragment>
        </div>

    )
}

/*<div>
            <img src={ad} className="advertisement_sample"></img>
            </div>*/