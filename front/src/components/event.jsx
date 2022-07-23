import React from "react";

export default function Event({id, day, title,}) {

    return (
        <div>
            <div>
                <div>{id}</div>
            </div>
            {/* <div>{day}</div> */}
            <div>{title}</div>
        
        </div>
        
    );
}