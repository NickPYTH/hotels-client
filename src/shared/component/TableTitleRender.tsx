import React from "react";

type propsType = {
    title: string
}
export const TableTitleRender = (props:propsType) => (<div style={{marginLeft: 10}}>{props.title}</div>)