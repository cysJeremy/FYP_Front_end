import React from "react"
import { useState } from "react";
import { useEffect } from "react";
import io from 'socket.io-client'
import "./Field.css"
export default function Field(props){

  const [brand, setBrand] = useState("")
  const [icon, setIcon] = useState("")
  const [image, setImage] = useState((props.image))

  useEffect(()=>{
    if(props.des){
      UpdateField(props.image) //update Field Element using the image URL
    }
  },[])

  const [updateCount, setUpdateCount] = useState(0)
  const socket = io(props.url);
  useEffect( () => {
      socket.on('connect', function(){});
      socket.on("CameraImageUpdated", (arg) => { 
        //setImage(image);
        console.log(image);
        UpdateField(props.image);
          if (arg === props.cameraID)
          {
              console.print('haha');
              UpdateField(props.image);
              console.log(image)
          }
      });
  }, []);

  const UpdateField = (image) => {
    
    return new Promise(async (resolve, reject) => {
      var formdata = new FormData();
      let blob = await fetch(image).then(r => r.blob());
    formdata.append("image",blob);

    setImage(URL.createObjectURL(blob));

    console.log(image);
    fetch(props.url+"detectCarBrand", {
        method: 'POST',
        body: formdata,
        redirect: 'follow'
    })
      .then(response => response.text())
      .then(response => {
            const json = JSON.parse(response)
            console.log(json)
            if (Array.isArray(json) && json.length > 0) {
                console.log(json[0].name)
                setBrand(json[0].name);
                setIcon(props.logo.getImage(json[0].name))
            }
            else{
                setBrand("");
                setIcon(props.logo.getImage(""));
            }
      })
      .catch(error => console.log('error', error));
    })
  }
  

  return(
    <div>
      <fieldset disabled className = "field" >
          <legend>{props.name}</legend>
          <img src = {image} className = "field_image" alt= {props.name+"image"}/>
          {props.des && <div className = "describe">
              <img src = {icon} className = "field_brand"/>
              <h4>{brand}</h4>
          </div>}
      </fieldset>
    </div>  
  )
}