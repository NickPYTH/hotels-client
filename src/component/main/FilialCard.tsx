import {Button, Card, Dropdown, Flex, MenuProps, Progress, Skeleton, Spin, Tooltip} from "antd";
import React, {useEffect, useState} from "react";
import {FilialModel} from "../../model/FilialModel";
import {useNavigate} from "react-router-dom";
import {FilialGuestReportModal} from "./FilialGuestReportModal";
import {host} from "../../config/constants";
import {filialAPI} from "../../service/FilialService";

type CardProps = {
    showWarningMsg: Function;
    filial: FilialModel;
    date: string;
}

export const FilialCard = ({filial, showWarningMsg, date}: CardProps) => {
    const navigate = useNavigate();
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const onMenuClick: MenuProps['onClick'] = (e) => {
        if (e.key === '1') {
            showWarningMsg("Отчет начал формироваться.")
            let tmpButton = document.createElement('a')
            tmpButton.href = `${host}/hotels/api/report/getShortReport?filialId=${filial.id}`
            tmpButton.click();
        }
    };
    const items = [
        {
            key: '1',
            label: 'Краткий отчет',
        },
    ];
    const [getFilial, {
        data: filialWithStats,
    }] = filialAPI.useGetMutation();
    useEffect(() => {
        getFilial({date, filialId: filial.id});
    }, [])
    return (
        <Card style={{minWidth: 350, cursor: 'pointer', boxShadow: "0px 0px 5px 3px rgba(34, 60, 80, 0.2)"}}>
            <FilialGuestReportModal filial={filial} visible={reportModalVisible} setVisible={setReportModalVisible}/>
            <Card.Meta
                title={filial.name}
                description={
                    <div style={{marginBottom: 15}}>
                        <div>Количество общежитий {filialWithStats ? filialWithStats.hotels?.length : <Spin style={{marginLeft: 5}} size={'small'}/>}</div>
                        <div>Общее количество мест {filialWithStats ? filialWithStats.bedsCount : <Spin style={{marginLeft: 5}} size={'small'}/>}</div>
                        <div>Количество свободных мест {filialWithStats ? filialWithStats.emptyBedsCount : <Spin style={{marginLeft: 5}} size={'small'}/>}</div>
                        {filialWithStats ?
                            <Tooltip title={"Процент загруженности"}>
                                {filialWithStats.emptyBedsCount === filialWithStats.bedsCount ?
                                    <Progress style={{position: 'absolute', top: 5, right: 5}} size={'small'} type="circle" percent={0}/>
                                    :
                                    <Progress
                                        style={{position: 'absolute', top: 5, right: 5}}
                                        size={'small'}
                                        type="circle"
                                        percent={(filialWithStats.emptyBedsCount && filialWithStats.bedsCount) ? Number((100 - (filialWithStats.emptyBedsCount / filialWithStats.bedsCount) * 100).toFixed(1)) : 0}/>
                                }
                            </Tooltip>
                            :
                            <Spin style={{position: 'absolute', top: 15, right: 15}}/>
                        }
                    </div>
                }
            />
            <Flex justify={'space-between'}>
                <Button type={'primary'} onClick={() => navigate(`${filial.id}`)}>Открыть</Button>
                <Dropdown.Button style={{width: 150}} onClick={() => setReportModalVisible(true)} menu={{items, onClick: onMenuClick}}>Скачать отчет</Dropdown.Button>
            </Flex>
        </Card>
    );
}