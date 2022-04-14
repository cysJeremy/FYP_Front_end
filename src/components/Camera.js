import React,{ useEffect, useState } from "react"
import "./Camera.css"
import Field from './Field'

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

    const socket_url = 'ws://localhost:4000/'
    const flask_url = 'http://localhost:4000/'
    const cameraID = "HKUST_001"
    const cameraUrl = flask_url + "getCameraImage?cameraID="+cameraID
    const [field, setField] = useState([])
    const [mainImage, setMainImage] = useState("")
    const [cropNum, setCropNum] = useState(0)



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
                    console.log(json)
                    setCropNum(json.number_of_slots);

                    setMainImage(flask_url+json.main_image_path)
                    const newfield = []
                    for(let i = 0; i < json.number_of_slots; i++){
                        newfield.push({
                            key:i+1,
                            name: "Camera" + cameraID + "-slot-" + (i+1),
                            image:flask_url+json.sub_image_path[i],
                            des:"detecting",
                        });
                    }
                    console.log(newfield)
                    setField(newfield)
                })
    }
    /*useEffect(() => {
        if(mainImage != "")
            CropImage()
    }, [mainImage])
    console.log(cropNum,mainImage)
    const CropImage = () => {
     
      return new Promise(async (resolve, reject) => {
        var formdata = new FormData();
        let blob = await fetch(mainImage).then(r => r.blob());
      formdata.append("image",blob);
  
    fetch("http://localhost:5000/updateCameraImage?cameraID=001", {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    })
      .then(response => response.text())
      .then(response => {
            const json = JSON.parse(response)
            console.log(json)
            if (Array.isArray(json) && json.length > 0) {
              setBrandID(json[0].class)
            }
            else{
              setBrandID("")
            }
      })
      .catch(error => console.log('error', error));
      })
    }*/
    //const [brand, setBrand] = useState("")
    
    /*useEffect(() => {
        if(cropNum != 0 && slotImage.length == cropNum)
            {const newfield = []
            for(let i = 0; i < cropNum; i++){
                console.log(slotImage[i])
                DetectImage(slotImage[i])
                
                newfield.push({
                    key:i+1,
                    name: "Camera" + cameraID + "-slot-" + (i+1),
                    image: slotImage[i],
                    des:brand,
                    brand:Logo().getImage(brand)
                })
            }
            setField(newfield)}
    }, [cropNum, slotImage.length])*/

  
    const fieldElements = field?field.map(field => (
        <Field
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
        <div>
        <Field image={mainImage} name="input"  class="field_main"/>
            <br/>
            {cropNum !== 0 && <div className="detection_container">
                {fieldElements}
            </div>}
        </div>
    )
}

/**/