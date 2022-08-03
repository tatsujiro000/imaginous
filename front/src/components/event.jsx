import React from "react";

export default function Event({id, day, title,}) {

    // //追加
    // let date = day.toDate();
    // const formatDate = (date)=>{
    //     let formatted_date = date.getDate() + "/" + (date.getMonth() + 1) + "/" + date.getFullYear()
    //     return formatted_date;
    // }
    // // console.log(formatDate(date));
    // console.log(day);
    

    return (
        <div>
            <div>
                <div>{id}</div>
            </div>
            {/* <div>{day}</div> */}
            {/* 追加 */}
            {/* <div>{formatDate(date)}</div> */}
            <div>{title}</div>
        
        </div>
        
    );
}