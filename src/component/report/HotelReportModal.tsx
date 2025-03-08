import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Divider, Flex, message, Modal, Select, Skeleton, Spin} from 'antd';
import {Dayjs} from "dayjs";
import {FilialModel} from "../../model/FilialModel";
import {filialAPI} from "../../service/FilialService";
import {Column} from '@ant-design/plots';
import {hotelAPI} from "../../service/HotelService";
import {HotelStatsReportModel} from "../../model/forReports/HotelStatsReportModel";
import {forEach, groupBy} from "lodash";
import {HotelModel} from "../../model/HotelModel";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}

export const HotelReportModal = (props: ModalProps) => {
    const [data, setData] = useState<HotelStatsReportModel[]>([]);
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg, 4);
    };
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    const [getReportData, {
        data: reportData,
        isLoading: isReportDataLoading
    }] = hotelAPI.useGetHotelsStatsMutation();
    const [getHotels, {
        data: hotels,
    }] = hotelAPI.useGetAllByFilialIdMutation();
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        if (selectedFilialId) getHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    useEffect(() => {
        if (reportData && hotels)
            setSelectedHotelId(hotels[0].id);
    }, [reportData, hotels]);
    useEffect(() => {
        if (selectedHotelId && reportData)
            setData(reportData.filter((r: HotelStatsReportModel) => r.hotelId === selectedHotelId).map((r1: HotelStatsReportModel) => ({...r1, type: r1.type == "busyBeds" ? "Занято" : "Свободно"})));
    }, [selectedHotelId])
    const confirmHandler = () => {
        if (selectedFilialId && dateRange) {
            showWarningMsg("Отчёт начал формироваться, примерное время ожидания ~40 секуднд.");
            getReportData({
                idFilial: selectedFilialId,
                dateStart: dateRange[0].format("DD-MM-YYYY"),
                dateFinish: dateRange[1].format("DD-MM-YYYY"),
            });
        }
    }

    const annotations: any = [];
    forEach(groupBy(data, 'date'), (values, k) => {
        const value = values.reduce((a, b) => a + b.value, 0);
        annotations.push({
            type: 'text',
            data: [k, value],
            style: {
                textAlign: 'center',
                fontSize: 14,
                fill: 'rgba(0,0,0,0.85)',
            },
            xField: 'date',
            yField: 'value',
            tooltip: false,
        });
    });

    const config = {
        data,
        xField: 'date',
        yField: 'value',
        stack: true,
        colorField: 'type',
        label: {
            text: 'value',
            textBaseline: 'bottom',
            position: 'inside',
        },
        annotations,
        interaction: {
            elementHighlightByColor: {
                link: true
            }
        },
        state: {
            active: { linkFill: 'rgba(0,0,0,0.25)', stroke: 'black', lineWidth: 0.5 },
            inactive: { opacity: 0.5 },
        }
    };
    return (
        <Modal title={"Загрузка общежитий"}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               width={window.innerWidth - 50}
               maskClosable={false}
               loading={isFilialsLoading}
               footer={<></>}
        >
            {messageContextHolder}
            <Flex align={"center"}>
                <div style={{width: 170}}>Выберите филиал</div>
                <Select
                    style={{width: 400, marginBottom: 10}}
                    value={selectedFilialId}
                    placeholder={"Выберите филиал"}
                    onChange={(e) => setSelectedFilialId(e)}
                    options={filials?.filter((filial:FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                />
            </Flex>
            <Flex gap={'small'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 170}}>Период формирования</div>
                    {/*//@ts-ignore*/}
                    <RangePicker style={{width: 400}} format={"DD-MM-YYYY"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }}/>
                </Flex>
            </Flex>
            <Flex gap={'small'} vertical={true}>
                <Button disabled={isReportDataLoading} style={{width: 170, marginTop: 5}} onClick={confirmHandler}>Сформировать отчет</Button>
            </Flex>
            <Divider style={{margin: 0, marginTop: 15}}/>
            {reportData ?
                <>
                    <Select
                        style={{width: 570, marginBottom: 10, marginTop: 15}}
                        value={selectedHotelId}
                        placeholder={"Выберите общежитие"}
                        onChange={(e) => setSelectedHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                    />
                    <Column {...config} />
                </> :
                <>
                    {isReportDataLoading ?
                        <Flex style={{marginTop: 50, marginBottom: 50}} justify={"center"} align={"center"}>
                            <Spin size={'large'}/>
                        </Flex>
                        : <Skeleton active={false}/>}
                </>
            }
        </Modal>
    );
};
