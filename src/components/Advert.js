import React,{ useEffect, useState} from "react"
import io from 'socket.io-client'
import './Advert.css'

export default function Advert(props){
    const Ad = function(){
        /*const cloth = require("../ad/Clothing.jpg")
        const food = require("../ad/food.jpg")
        const shoes = require("../ad/shoes.jpg")
        const watch = require("../ad/watch.jpg")*/
        const ad = {
            audi: require("../ad/Audi_ad.jpg"),
            benz: require("../ad/Benz_ad.jpg"),
            bmw: require("../ad/Bmw_ad.jpg"),
            honda: require("../ad/Honda_ad.jpg"),
            hyundai: require("../ad/Hyundai_ad.jpg"),
            infiniti: require("../ad/Infiniti_ad.jpg"),
            kia: require("../ad/Kia_ad.jpg"),
            landrover: require("../ad/LandRover_ad.jpg"),
            lexus: require("../ad/Lexus_ad.jpg"),
            mini: require("../ad/Mini_ad.jpg"),
            mazda: require("../ad/Mazda_ad.jpg"),
            mitsubishi: require("../ad/Mitsubishi_ad.jpg"),
            nissan: require("../ad/Nissan_ad.jpg"),
            porsche: require("../ad/Porsche_ad.jpg"),
            subaru: require("../ad/Subaru_ad.jpg"),
            suzuki: require("../ad/Suzuki_ad.jpg"),
            tesla: require("../ad/Tesla_ad.jpg"),
            toyota: require("../ad/Toyota_ad.jpg"),
            volkswagen: require("../ad/Volkswagen_ad.jpg"),
            volvo: require("../ad/Volvo_ad.jpg")
        };
        
        const getImage = function(name){
            let brand = name.toLowerCase();
            if(brand in ad)
                return ad[brand];
            return require("../logo/Not_result.png");
        };
        
        return {getImage};
        
    };

    let port;
    (props.port)? port = props.port: port = "4000";
    const flask_url = 'http://localhost:' + port + "/";
    let cameraID
    (props.cameraID? cameraID = props.cameraID:cameraID = "HKUST_001")
    const cameraUrl = flask_url + "getCameraProperties?cameraID="+cameraID
    const [ad, setAd] = useState(Ad().getImage("bmw"))
    const adViewer = React.useRef("");
    const [LP, setLP] = useState(false);
    
    useEffect(() => {
        getSlot();
    },[])

    const getSlot = () =>{
        fetch(cameraUrl,{
            method: 'GET',
            headers: { "Content-Type": "application/json" },
            redirect: 'follow'
            })
                .then(res => res.json())
                .then((json) => {
                    //console.log(json);
                    const slotIds = [];
                    let name;
                    for(let i = 0; i < json.number_of_slots; i++){
                        name = json.sub_image_path[i].split("/")
                        name = name[name.length-1].replace(cameraID+"_", "").replace(".jpg","")
                        slotIds[name] = flask_url + json.sub_image_path[i]
                    }
                    if(props.slotID in slotIds){
                        adViewer.image = slotIds[props.slotID];
                        //console.log(adViewer.image);
                        UpdateImage(adViewer.image);
                    }
                })
    }
   
    //Socket.IO listener for auto-updating
    useEffect( () => {
        const socket = io(flask_url);
        socket.on('connect', function(){});
        socket.on("CameraImageUpdated", (arg) => { 
            //console.log(adViewer.image);
            if (arg === cameraID && adViewer.image) //Message applies to all the fields of the same cameraID
            {
                UpdateImage(adViewer.image);
                //console.log(adViewer.image);
            }
        });
    }, []);
    const UpdateImage = (image) => {
        if(!adViewer.image){
            console.log("not slot")
            return;
        }
        return new Promise(async (resolve, reject) => {
            var formdata = new FormData();
            let blob = await fetch(image).then(r => r.blob());
        formdata.append("image",blob);
        //console.log(image)
        //set the image of field
        fetch(flask_url + "detectMake", {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
        })
        .then(response => response.text())
        .then(response => {
            const json = JSON.parse(response)
            //console.log(json)
            if (Array.isArray(json) && json.length > 0) {
                //console.log(json[0].name)
                setAd(Ad().getImage(json[0].name));
                
            }
            else{
                setAd(Ad().getImage(""))
            }
        })
        .catch(error => console.log('error', error));  

        fetch(flask_url + "detectLP", {
            method: 'POST',
            body: formdata,
            redirect: 'follow'
          })
          .then(response => response.text())
          .then(response => {
                const json = JSON.parse(response)
                //console.log(json)
                if(json.licencePlate){
                  setLP(json.licencePlate)
                }else{
                  setLP("NO LP")
                }
    
          })
          .catch(error => console.log('error', error));
        
    })
    }
    return(
        <div>
        {(adViewer.image )?
            <div>
                <h3>Welcome! {(LP !== false && LP !== "NO LP") && ("The driver of " + LP)} </h3>
                <img src={ad} className="advertisement_page"/>
            </div>
            :
        <h3>NO SLOT FOUND</h3>}
        </div>
    )
} 