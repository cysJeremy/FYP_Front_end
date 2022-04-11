import React from "react"
export default function Field(props){
    return(
      <div>
        <fieldset disabled className = "field" >
            <legend>{props.name}</legend>
            <img src = {props.image} className = "field_image"/>
            <br />
            {props.brand && <div className = "describe">
                <img src = {props.brand} className = "field_brand"/>
                <h4>{props.des}</h4>
            </div>}
        </fieldset>
      </div>  
    )
}