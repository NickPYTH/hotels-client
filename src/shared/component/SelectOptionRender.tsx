import {Tag} from "antd";
import React from "react";

export const SelectOptionRender = (props:any) => {
    let label: string = props.params.label as string;
    let status = label?.split(" ")[1] == 'true'?'Свободно' : 'Занято';
    let additionalInfo = label?.split(" ")[2] == 'flatLock' ? 'Секция закрыта':
                                label?.split(" ")[2] == 'roomLock' ? 'Комната закрыта':
                                label?.split(" ")[2] == 'flatOrg'  ? 'Секция выкуплена организацией':
                                label?.split(" ")[2] == 'roomOrg'  ? 'Комната выкуплена организацией':'';
    return(
        <div>{label?.split(" ")[0]}
            {label?.split(" ").length > 1 &&
                <>
                    <Tag style={{marginLeft: 5}} color={status == 'Свободно' ? 'success' : 'volcano'}>{status}</Tag>
                    {additionalInfo.length > 0 &&
                        <Tag color={'volcano'}>{additionalInfo}</Tag>
                    }
                </>
            }
        </div>
    )
}