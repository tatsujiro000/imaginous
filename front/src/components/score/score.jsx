import React from "react";

export default function Score({condition_score, sleep_score}) {

    return (
        <div style={{display:'flex',verticalAlign:'middle'}}>
            <p style={{fontSize:'24px'}}>{condition_score}</p>
            <div>{sleep_score}</div>
        </div>
    );
}