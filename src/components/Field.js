import React from "react"
import { useState } from "react";
import { useEffect } from "react";
import io from 'socket.io-client'
import "./Field.css"
export default function Field(props){

  const [brand, setBrand] = useState("")
  const [icon, setIcon] = useState("")
  const [image, setImage] = useState((props.image))
  const [LP , setLP] = useState("")
  //Load Field Details upon initial rendering
  useEffect(()=>{
      UpdateField(props.image) //update Field Element using the image URL  
  },[])

  //Socket.IO listener for auto-updating
  useEffect( () => {
      //console.log('add camera ', props.cameraID);
      //console.log('add socket ', props.url);
      //console.log('add image ', props.image);
      const socket = io(props.url);
      socket.on('connect', function(){});
      socket.on("CameraImageUpdated", (arg) => { 
        //console.log(image);
          if (arg === props.cameraID) //Message applies to all the fields of the same cameraID
          {
              UpdateField(props.image);
              //console.log(image);
          }
      });
  }, []);

  const UpdateField = (image) => {
    return new Promise(async (resolve, reject) => {
      var formdata = new FormData();
      let blob = await fetch(image).then(r => r.blob());
    formdata.append("image",blob);

    //set the image of field
    setImage(URL.createObjectURL(blob));
    if(props.des)
    {
        fetch(props.url + "detectCarBrand", {
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
                setBrand(json[0].name);
                setIcon(props.logo.getImage(json[0].name))
                if(props.AdViewer === props.name){
                  props.SetAd(props.Ad.getImage(json[0].name));
                }
            }
            else{
                setBrand("");
                setIcon(props.logo.getImage(""));
            }
      })
      .catch(error => console.log('error', error));  

      fetch(props.url + "detectLP", {
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
              setLP("can not recognite")
            }

      })
      .catch(error => console.log('error', error));
    }
    })
  }
  
  function changeAd(){
    props.SetAd(props.Ad.getImage(brand));
    props.SetAdViewer(props.name)
  }

  return(
    <div>
      <fieldset disabled className = {props.className} >
          <legend>{props.name}</legend>
          <img src = {image} className = "field_image" alt= {props.name+"-image"} onClick={changeAd}/>
          {props.des && <div className = "information">
              <div className = "brand_detect">
                <img src = {icon} className = "field_brand"/>
                <h4>{brand}</h4>
              </div>
              <h4 className="field_LP">License Plate:{LP}</h4>
          </div>
          }
      </fieldset>
    </div>  
  )
}