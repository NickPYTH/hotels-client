import React from "react";

export const LabelOptionRender = (props:any) => {
    let label: string = props.params.label as string;
    return(
        <div>{label?.split(" ")[0]}</div>
    )
}