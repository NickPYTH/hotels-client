import React, {useEffect, useState} from 'react';
import {Button, Divider, Flex, message, Switch, Table, TableProps} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {LeftOutlined} from "@ant-design/icons";
import dayjs from 'dayjs';
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";
import {HotelCard} from "shared/component/HotelCard";

const FilialPage: React.FC = () => {

    // States
    const [hotels, setHotels] = useState<HotelModel[] | null>(null);
    const [tableMode, setTableMode] = useState<boolean>(false);
    const [bedsCountSort, setBedsCountSort] = useState<boolean>(false);
    // -----

    // Web requests
    const [getAllHotelsWithStats, {
        data: hotelsDataWithStats,
    }] = hotelAPI.useGetAllByFilialIdWithStatsMutation();
    const [getAllHotels, {
        data: hotelsData,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation();
    // -----

    // Useful utils
    const navigate = useNavigate();
    let {id} = useParams();
    const [messageApi, messageContextHolder] = message.useMessage();
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const columns: TableProps<HotelModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            width: 60
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
            filters: hotels?.reduce((acc: { text: string, value: string }[], hotelModel: HotelModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === hotelModel.name) === undefined)
                    return acc.concat({text: hotelModel.name, value: hotelModel.name});
                return acc;
            }, []),
            onFilter: (value: any, record: HotelModel) => {
                return record.name.indexOf(value) === 0
            },
            filterSearch: true,
            width: 400
        },
        {
            title: 'Количество секций',
            dataIndex: 'flatsCount',
            key: 'flatsCount',
            sorter: (a, b) => (a.flatsCount && b.flatsCount) ? a.flatsCount - b.flatsCount : 0,
            sortDirections: ['descend', 'ascend'],
            width: 200
        },
        {
            title: 'Общее количество мест',
            dataIndex: 'bedsCount',
            key: 'bedsCount',
            sorter: (a, b) => (a.bedsCount && b.bedsCount) ? a.bedsCount - b.bedsCount : 0,
            sortDirections: ['descend', 'ascend'],
            width: 200
        },
        {
            title: 'Количество свободных мест',
            dataIndex: 'emptyBedsCount',
            key: 'emptyBedsCount',
            sorter: (a, b) => (a.emptyBedsCount && b.emptyBedsCount) ? a.emptyBedsCount - b.emptyBedsCount : 0,
            sortDirections: ['descend', 'ascend'],
            width: 250
        },
        {
            render: (value, record, index) => (<Button onClick={() => {
                navigate(`../hotels/hotels/${record.id}`)
            }}>Открыть</Button>)
        }
    ];
    // -----

    // Effects
    useEffect(() => {
        if (id) {
            getAllHotelsWithStats({filialId: id, date: dayjs().format('DD-MM-YYYY HH:mm')});
            getAllHotels({filialId: id});
            if (id === "911") setTableMode(true);
        }
    }, []);
    useEffect(() => {
        if (hotelsDataWithStats) setHotels(hotelsDataWithStats.filter((f: HotelModel) => (f.bedsCount ?? 0) > 0));
    }, [hotelsDataWithStats]);
    useEffect(() => {
        if (hotelsData) setHotels(hotelsData);
    }, [hotelsData]);
    useEffect(() => {
        if (hotelsDataWithStats)
            if (tableMode) {
                if (bedsCountSort) {
                    let deepCopy: HotelModel[] = JSON.parse(JSON.stringify(hotelsDataWithStats));
                    setHotels(deepCopy.sort((a, b) => (a.bedsCount ?? 0) - (b.bedsCount ?? 0)).reverse());
                } else
                    setHotels(hotelsDataWithStats);
            } else setHotels(hotelsDataWithStats.filter((f: HotelModel) => (f.bedsCount ?? 0) > 0));
    }, [tableMode]);
    useEffect(() => {
        if (hotelsDataWithStats) {
            let deepCopy: HotelModel[] = JSON.parse(JSON.stringify(hotels));
            if (bedsCountSort) setHotels(deepCopy.sort((a, b) => (a.bedsCount ?? 0) - (b.bedsCount ?? 0)).reverse());
            else {
                if (tableMode) setHotels(hotelsDataWithStats);
                else setHotels(hotelsDataWithStats.filter((f: HotelModel) => (f.bedsCount ?? 0) > 0));
            }
        }
    }, [bedsCountSort]);
    // -----

    return (
        <Flex gap="middle" align="start" vertical={true} wrap={'wrap'}>
            {messageContextHolder}
            <Flex style={{marginTop: 20, marginLeft: 15}} gap={'small'} align={'center'}>
                <Button icon={<LeftOutlined/>} type={'primary'} onClick={() => navigate(-1)}>Назад</Button>
                <div style={{marginLeft: 20, fontSize: 24, fontWeight: 600}}>{hotelsData ? hotelsData[0]?.filial.name : ""}</div>
                <Divider style={{height: 44}} type={'vertical'}/>
                <Flex align={'center'}>
                    <div>Табличный вид</div>
                    <div>
                        <Switch value={tableMode} onChange={(e) => setTableMode(e)} style={{marginLeft: 5}}/>
                    </div>
                </Flex>
                <Divider style={{height: 44}} type={'vertical'}/>
            </Flex>
            <Divider style={{marginTop: 5, marginBottom: 0}}/>
            {tableMode ?
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    loading={isHotelsLoading}
                    dataSource={hotels ?? []}
                    pagination={{
                        defaultPageSize: 100,
                    }}
                />
                :
                <Flex style={{marginRight: 15, marginLeft: 15}} gap="middle" align="start" vertical={false} wrap={'wrap'} justify="center">
                    {hotels?.map((hotel: HotelModel) => (
                        <HotelCard key={hotel.id} showWarningMsg={showWarningMsg} hotel={hotel}/>
                    ))}
                </Flex>
            }
        </Flex>
    );
};
export default FilialPage;