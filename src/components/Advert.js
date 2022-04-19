import React,{ useEffect, useState, Fragment} from "react"
import io from 'socket.io-client'
import './Advert.css'

export default function Advert(props){
    const Ad = function(){
        const cloth = require("../ad/Clothing.jpg")
        const food = require("../ad/food.jpg")
        const shoes = require("../ad/shoes.jpg")
        const watch = require("../ad/watch.jpg")
        const ad = {
            audi: cloth,
            benz: watch,
            bmw: watch,
            honda: food,
            hyundai: food,
            infiniti: cloth,
            kia: cloth,
            landrover: shoes,
            lexus: cloth,
            mini: food,
            mazda: shoes,
            mitsubishi: cloth,
            nissan: shoes,
            porsche: watch,
            subaru: food,
            suzuki: cloth,
            tesla: watch,
            toyota: cloth,
            volkswagen: cloth,
            volvo: food
        };
        
        const getImage = function(name){
            let brand = name.toLowerCase();
            if(brand in ad)
                return ad[brand];
            return require("../logo/Not_result.png");
        };
        
        return {getImage};
        
    };

    const flask_url = 'http://localhost:4000/'
    let cameraID
    (props.cameraID? cameraID = props.cameraID:cameraID = "HKUST_001")
    const cameraUrl = flask_url + "getCameraImage?cameraID="+cameraID
    const [cropNum, setCropNum] = useState(0)
    const [ad, setAd] = useState(Ad().getImage("bmw"))
    const [adViewer, setAdViewer] = useState();

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
                    console.log(json);
                    setCropNum(json.number_of_slots);
                    if(json.number_of_slots > 0 && props.slot <= json.number_of_slots){
                        setAdViewer(flask_url + json.sub_image_path[props.slot-1])
                        console.log(flask_url + json.sub_image_path[props.slot-1])
                        UpdateImage(flask_url + json.sub_image_path[props.slot-1],json.number_of_slots)
                    }
                })
    }
   
    /*useEffect(()=>{
        UpdateImage(adViewer) //update Field Element using the image URL  
    },[])*/
    
    //Socket.IO listener for auto-updating
    useEffect( () => {
        const socket = io(flask_url);
        socket.on('connect', function(){});
        socket.on("CameraImageUpdated", (arg) => { 
            //console.log(image);
            if (arg === cameraID) //Message applies to all the fields of the same cameraID
            {
                UpdateImage(adViewer,cropNum);
                //console.log(image);
            }
        });
    }, []);
    const UpdateImage = (image,num) => {
        if(props.slot > num){
            return;
        }
        return new Promise(async (resolve, reject) => {
            var formdata = new FormData();
            let blob = await fetch(image).then(r => r.blob());
        formdata.append("image",blob);
        console.log(image)
        //set the image of field
        fetch(flask_url + "detectCarBrand", {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
        })
        .then(response => response.text())
        .then(response => {
            const json = JSON.parse(response)
            console.log(json)
            if (Array.isArray(json) && json.length > 0) {
                //console.log(json[0].name)
                setAd(Ad().getImage(json[0].name));
                
            }
            else{
                setAd(Ad().getImage(""))
            }
        })
        .catch(error => console.log('error', error));  
        
    })
    }
    return(
        <div>
        {(cropNum > 0 && props.slot<=cropNum)?
            <img src={ad} className="advertisement_page"/>
            :
        <h3>NO SLOT FOUND</h3>}
        </div>
    )
} 