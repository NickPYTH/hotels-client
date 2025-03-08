import {Tag} from "antd";
import React from "react";

export const SelectOptionRender = (props:any) => {
    let label: string = props.params.label as string;
    let status = label?.split(" ")[1] == 'true'?'Свободно':'Занято';
    return(
        <div>{label?.split(" ")[0]}
            {label?.split(" ").length > 1 &&
                <Tag style={{marginLeft: 5}} color={status == 'Свободно' ? 'success' : 'volcano'}>{status}</Tag>
            }
        </div>
    )
}