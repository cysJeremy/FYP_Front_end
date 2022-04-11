import React from "react"
import Field from './Field'
import IMAGE from "../image/test.jpg"
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
            landRover: require("../logo/LandRover.png"),
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

    React.useEffect(() => {
        fetch("http://localhost:5000/detectCarBrand",{
        method: 'POST',
        headers: { "Content-Type": "application/json" },
        files:{image:IMAGE}
        })
            .then(res => res.json())
            .then((json) => {
                
            })
    },[])

    /*const [cropNum, setCropNum] = React.useState(0);
    React.useEffect(() => {
        fetch("http://localhost:5000/getCameraInfo?cameraID=001",{
        method: 'GET',
        headers: { "Content-Type": "application/json" },
        files:{image:IM}
        })
            .then(res => res.json())
            .then((json) => {
                setCropNum(json.number_of_slots);
            })
    },[])

   /* const [field, setField] = React.useState(updateField())
    const [mainImage, setMainImage] = React.useState()
    React.useEffect(() =>{
        fetch("http://localhost:5000/getCameraImage?cameraID=001",{
            method: 'GET',
            headers: { "Content-Type": "application/json" },
            })
                .then(res => res.json())
                .then((json) => {
                    console.log(json)
                    setMainImage("http://localhost:5000/"+json.main_image_path)
                    //let image = require("./image/test.jpg")
                   /* for (let i = 0; i < cropNum; i++) {
                        let name = json.sub_image_path[i].split("/")[4]
                        setField(oldFields => oldFields.map(field => 
                            {return field.key === i+1 ? 
                                {
                                    ...field,
                                    name:name,
                                    image:"http://localhost:5000/"+json.sub_image_path[i],
                                    des:name
                                }:field}));
                    }*/
     /*           })
    },[])*/

    
 /*  function generateNewField(key,name,image) {

        return {
            //Crop the image in props.path
            //fetch the image from api here
            key:key,
            name:name,
            image:require("../image/test.jpg"),
            logo:Logo().getImage("kia"),
            des:name
        }
    }   
    function updateField() {
        const newfield = []
        //let image = require("./image/test.jpg")
        for (let i = 0; i < cropNum; i++) {
            newfield.push(generateNewField(i,i+".jpg",));
        }
        return newfield;
    }
    
    
     const fieldElements = field.map(field => (
        <Field
            key={field.key}
            name={field.name}
            image={field.image}  
            des={field.des}
            brand={field.logo} 
        />
    ))*/
    //console.log(mainImage)
    return(
        <div>
        <Field image={IMAGE} name="input"/>
            <div className="detection_container">
                
            </div>
        </div>
    )
}

/**/