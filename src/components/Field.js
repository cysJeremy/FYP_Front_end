import React from "react"
import { useState } from "react";
import { useEffect } from "react";
export default function Field(props){

  const [brand, setBrand] = useState("")
  const [icon, setIcon] = useState("")
  useEffect(()=>{
    DetectImage(props.image)  
  },[brand,icon])

  const DetectImage = (image) => {
    
    return new Promise(async (resolve, reject) => {
      var formdata = new FormData();
      let blob = await fetch(image).then(r => r.blob());
    formdata.append("image",blob);

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
          <img src = {props.image} className = "field_image"/>
          <br />
          {props.des && <div className = "describe">
              <img src = {icon} className = "field_brand"/>
              <h4>{brand}</h4>
          </div>}
      </fieldset>
    </div>  
  )
}