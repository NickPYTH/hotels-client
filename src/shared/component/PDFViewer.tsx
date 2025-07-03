import React, {ReactElement, useEffect, useState} from "react";
import {Button, Empty, Flex, Modal, Spin, Typography} from "antd";

const {Text} = Typography;

interface PDFViewerProps {
    visible: boolean,
    setVisible: Function,
    isLoading?: boolean,
    url: string,

    children: ReactElement[] | ReactElement,
    reportName?: string,
}

export const PDFViewer = (props: PDFViewerProps) => {

    // States
    const [urlObject, setUrlObject] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    // -----

    // Handlers
    const getSrcHandler = async () => {
        setIsLoading(true)
        fetch(props.url, {
            method: 'GET',
            headers: {
                "Content-Type": "application/x-pdf"
            }
        })
            .then(data => data.blob())
            .then(blob => {
                setUrlObject(URL.createObjectURL(blob));
                setIsLoading(false)
            })
    }
    // -----

    // Effects
    useEffect(() => {
        getSrcHandler();
    }, [props.url]);
    // -----

    return (
        <Modal
            open={props.visible}
            width={window.innerWidth - 50}
            closable={true}
            maskClosable={false}
            title={(
                <Flex vertical>
                    <Flex justify={'space-between'} vertical={false} gap={"large"}
                          style={{marginBottom: 20, marginRight: 25}}
                    >
                        <Text style={{fontSize: "18px"}}>{props.reportName}</Text>
                        <Flex>
                            <Button
                                disabled={props.url.length == 0 || isLoading}
                                style={{
                                    marginRight: "5px",
                                }}
                                onClick={() => {
                                    getSrcHandler();
                                }}
                            >
                                Сформировать заново
                            </Button>

                            <Button
                                disabled={props.url.length == 0 || isLoading}
                                style={{
                                    marginRight: "5px",
                                }}
                                onClick={() => {
                                    let tmpButton = document.createElement('a')
                                    tmpButton.href = props.url.replace('pdf', 'xlsx');
                                    tmpButton.click();
                                }}
                            >
                                Скачать Excel файл
                            </Button>
                            <Button
                                disabled={props.url.length == 0 || isLoading}
                                style={{
                                    marginRight: "5px",
                                }}
                                onClick={() => {
                                    window.open(urlObject, "_blank");
                                }}
                            >
                                Открыть в новой вкладке
                            </Button>
                        </Flex>
                    </Flex>
                    {props.children}
                </Flex>
            )}
            centered
            onCancel={() => props.setVisible(false)}
            footer={false}
        >
            <div
                style={{
                    height: "100vh",
                    border: "1px solid #ccc",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "rgba(250,250,250,0.9)",
                }}
            >
                {!(isLoading || props.url) &&
                    <Empty/>
                }
                {isLoading &&
                    <Spin/>
                }
                {(props.url && !isLoading) &&
                    <iframe
                        src={urlObject}
                        width="100%" height="100%"
                    >
                    </iframe>}

            </div>
        </Modal>
    )
}