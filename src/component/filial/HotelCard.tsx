import {Button, Card, Flex, Progress, Spin, Tooltip} from "antd";
import React, {useState} from "react";
import {HotelModel} from "../../model/HotelModel";
import {useNavigate} from "react-router-dom";
import {HotelGuestReportModal} from "./HotelGuestReportModal";

type CardProps = {
    hotel: HotelModel;
    showWarningMsg: Function;
}

export const HotelCard = ({hotel, showWarningMsg}: CardProps) => {
    const navigate = useNavigate();
    const [reportModalVisible, setReportModalVisible] = useState(false);
    return (
        <Card style={{minWidth: 400, maxWidth: 450, cursor: 'pointer', boxShadow: "0px 0px 5px 3px rgba(34, 60, 80, 0.2)"}}>
            <HotelGuestReportModal hotel={hotel} visible={reportModalVisible} setVisible={setReportModalVisible}/>
            <Card.Meta
                title={(
                    <div style={{width: 300, height: 80, wordBreak: 'break-word', whiteSpace: 'normal'}}>
                        {hotel.name}
                    </div>
                )}
                description={
                    <>
                        <Flex align={'center'}>
                            <div style={{marginRight: 5, height: 50}}>{hotel.location}</div>
                        </Flex>
                        <Flex align={'center'}>
                            <div style={{marginRight: 5}}>Количество секций</div>
                            {hotel.flatsCount === null ? <Spin size={'small'}/> : hotel.flatsCount}
                        </Flex>
                        <Flex align={'center'}>
                            <div style={{marginRight: 5}}>Общее количество мест</div>
                            {hotel.bedsCount === null ? <Spin size={'small'}/> : hotel.bedsCount}
                        </Flex>
                        <Flex align={'center'}>
                            <div style={{marginRight: 5}}>Количество свободных мест</div>
                            {hotel.emptyBedsCount === null ? <Spin size={'small'}/> : hotel.emptyBedsCount}
                        </Flex>
                        <Tooltip title={"Процент загруженности"}>
                            {hotel.bedsCount === null ?
                                <Spin style={{position: 'absolute', top: 15, right: 15}} />
                                :
                                <Progress style={{position: 'absolute', top: 5, right: 5}}
                                          size={'small'}
                                          type="circle"
                                          percent={(hotel.emptyBedsCount && hotel.bedsCount) ? Number((100 - (hotel.emptyBedsCount / hotel.bedsCount) * 100).toFixed(1)) : 0}/>
                            }
                        </Tooltip>
                    </>
                }
            />
            <Flex style={{marginTop: 10}} justify={'space-between'}>
                <Button type={'primary'} onClick={() => {
                    navigate(`../hotels/hotels/${hotel.id}`)
                }}>Открыть</Button>
                <Button type={'primary'} onClick={() => setReportModalVisible(true)}>Скачать в виде отчета</Button>
            </Flex>
        </Card>
    )
}