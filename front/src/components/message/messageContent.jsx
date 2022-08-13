import React from "react";

export const MessageContent = ({created_at, text}) => {
    return (
        <>
            <div>
                <p>{created_at}</p>
                <p>{text}</p>
            </div>
        </>
    )
}