import '../../index.scss';
import {Button, DatePicker, Flex, Popconfirm, Skeleton, Table} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {flatAPI} from "../../service/FlatService";
import {FlatModal} from "./FlatModal";
import {FlatModel} from "../../model/FlatModel";
import Search from "antd/lib/input/Search";
import {GuestModal} from "../dict/GuestModal";

const {RangePicker} = DatePicker;

interface DataType {
    section: string;
    room: string;
    bed: string;
    date: string;
    guest: string;
}

interface ModalPros {
    chessDateRange: Dayjs[],
    setChessDateRange: (chessDateRange: Dayjs[]) => void,
    selectedDate: Dayjs,
    hotelId: string,
}

const ChessComponent = ({columns, data, isFilialUEZS}) => {
    return (<Table<DataType>
        style={{width: window.innerWidth}}
        columns={columns}
        dataSource={data}
        bordered={true}
        pagination={{
            defaultPageSize: isFilialUEZS ? 100 : 20,
        }}
        scroll={{x: window.innerWidth, y: window.innerHeight - 330}}
    />)
}

const MemoizedChess = React.memo(ChessComponent);

export const CellsView = (props: ModalPros) => {

    // States
    const [filialId, setFilialId] = useState<number | null>(null);
    const [hotelId, setHotelId] = useState<number | null>(null);
    const [flatId, setFlatId] = useState<number | null>(null);
    const [roomId, setRoomId] = useState<number | null>(null);
    const [bedId, setBedId] = useState<number | null>(null);
    const searchInputRef = useRef<any>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
    const [data, setData] = useState<any[] | null>(null);
    const [columns, setColumns] = useState<any[] | null>(null);
    const [isFilialUEZS, setIsFilialUEZS] = useState(() => props.hotelId === '182' || props.hotelId === '183' || props.hotelId === '184' || props.hotelId === '327');
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    // -----

    // Web requests
    const [getAllFlats, {
        data: flatsData,
        isLoading: isFlatsLoading
    }] = flatAPI.useGetAllChessMutation();
    // -----

    // Effects
    useEffect(() => {
        if (props.hotelId)
            getAllFlats({hotelId: props.hotelId, dateStart: props.chessDateRange[0].format("DD-MM-YYYY"), dateFinish: props.chessDateRange[1].format("DD-MM-YYYY")});
    }, []);
    useEffect(() => {
        if (flatsData)
            setData(flatsData);
    }, [flatsData]);
    useEffect(() => {
        if (props.chessDateRange && data && columns && props.hotelId) {
            setColumns((prev: any) => {
                let dateStart = props.chessDateRange[0];
                let dateFinish = props.chessDateRange[1];
                let dateList = [];
                for (let d = dateStart; d.isBefore(dateFinish); d = d.add(1, 'days')) {
                    dateList.push(d.format("DD-MM-YYYY"));
                }
                return prev.concat(dateList.map((el: string) => ({
                    title: `${el}`,
                    dataIndex: `${el}`,
                    width: 80,
                    render: (val: any) => {
                        if (val) {
                            return (<div style={{cursor: 'pointer', background: '#337ab7', width: 80, height: 25, padding: 5}}>
                                {el}
                            </div>);
                        } else return <></>;
                    }
                })));
            });
            getAllFlats({hotelId: props.hotelId, dateStart: props.chessDateRange[0].format("DD-MM-YYYY"), dateFinish: props.chessDateRange[1].format("DD-MM-YYYY")});
        }
    }, [props.chessDateRange]);
    useEffect(() => {
        if (data) {
            setColumns(() => {
                let base: any = [
                    {
                        fixed: 'left',
                        title: 'Секция',
                        dataIndex: 'section',
                        width: 50,
                        onCell: (_: any, index: any) => {
                            let uniqSectionNames = data.reduce((acc, section: DataType) => {
                                if (!acc.includes(section.section))
                                    return acc.concat(section.section);
                                return acc;
                            }, [] as string[]);
                            let result;
                            uniqSectionNames.forEach((name: any) => {
                                let section = data.find((t: DataType) => t.section === name);
                                if (section) {
                                    let place = data.indexOf(section);
                                    let count = data.filter((t: DataType) => t.section === name).length;
                                    if (index === place) {
                                        result = {rowSpan: count};
                                    }
                                }
                            });
                            if (result) {
                                return result;
                            } else return {rowSpan: 0};
                        },
                    },
                    {
                        fixed: 'left',
                        title: 'Комната',
                        dataIndex: 'room',
                        width: 70,
                        render: (index: any, record: any) => {
                            return <div>{record.roomName}</div>
                        },
                        onCell: (_: any, index: any) => {
                            let uniqRoomNames = data.reduce((acc, room: DataType) => {
                                if (!acc.includes(room.room))
                                    return acc.concat(room.room);
                                return acc;
                            }, [] as string[]);
                            let result;
                            uniqRoomNames.forEach((name: any) => {
                                let room = data.find((t: DataType) => t.room === name);
                                if (room) {
                                    let place = data.indexOf(room);
                                    let count = data.filter((t: DataType) => t.room === name).length;
                                    if (index === place) {
                                        result = {rowSpan: count};
                                    }
                                }
                            });
                            if (result) {
                                return result;
                            } else return {rowSpan: 0};
                        }
                    },
                    {
                        fixed: 'left',
                        title: 'Место',
                        width: 50,
                        dataIndex: 'bed',
                    },
                ]
                let dateStart = props.chessDateRange[0];
                let dateFinish = props.chessDateRange[1];
                let dateList = [];
                for (let d = dateStart; d.isBefore(dateFinish); d = d.add(1, 'days')) {
                    dateList.push(d.format("DD-MM-YYYY"));
                }
                return base.concat(dateList.map((el: string) => ({
                    title: `${el}`,
                    dataIndex: `${el}`,
                    width: 143,
                    render: (val: any, record: any) => {
                        if (val) {
                            if (val.split('||').length === 1) {
                                let percent = val.split('#')[1]; // ТЕЛКОВ В. В. -. -.&02-02-2025 17:00-09-02-2025 09:00#29
                                let dateTime: string[] = val.split('#')[0]?.split('&')[1].split(' :: ');
                                return (<Flex vertical={false}>
                                    <div style={{
                                        cursor: 'pointer',
                                        background: '#1677ff',
                                        width: Math.abs(percent) + 43 == 143 ? '100%' : Math.abs(percent) + 43*(percent/100),
                                        height: 25,
                                        color: 'white',
                                        fontSize: 10,
                                        borderBottomRightRadius: percent < 0 ? 8 : 0,
                                        borderTopRightRadius: percent < 0 ? 8 : 0,
                                        borderBottomLeftRadius: percent > 0 && percent < 100 ? 8 : 0,
                                        borderTopLeftRadius: percent > 0 && percent < 100 ? 8 : 0,
                                        position: percent > 0 && percent < 100 ? 'absolute' : 'inherit',
                                        right: 0,
                                        top: 5
                                    }}>
                                        <Flex justify="center" align="center">
                                            <Popconfirm onConfirm={() => {
                                                setSelectedFlatId(record.sectionId);
                                                if (percent == 100)
                                                    setSelectedDate(dayjs(`${el} 12:00`, "DD-MM-YYYY HH:mm"));
                                                else
                                                    setSelectedDate(dayjs((percent > 0 && percent < 100) ? dateTime[0] : dateTime[1], "DD-MM-YYYY HH:mm"));
                                            }} cancelText={"Отмена"} okText={"Открыть"}
                                                        title={`${val.split('#')[0].split('&')[0]} ${record.post !== undefined ? `- ${record.post}` : ""}`}
                                                        description={`Даты проживания ${val.split('#')[0].split('&')[1]}`}>
                                                <div style={{paddingTop: 4, width: '100%', height: 25}}>
                                                    {Math.abs(percent) === 100 ? val.split('#')[0].split('&')[0] : ""}
                                                </div>
                                            </Popconfirm>
                                        </Flex>
                                    </div>
                                </Flex>)
                            } else {
                                let personLeft = val.split('||')[0];
                                let personRight = val.split('||')[1];
                                let personLeftPercent = Math.abs(personLeft.split('#')[1]);
                                let personRightPercent = Math.abs(personRight.split('#')[1]);
                                return (<Flex vertical={false}>
                                    <>
                                        <div style={{
                                            cursor: 'pointer',
                                            background: '#1677ff',
                                            height: 25,
                                            color: 'white',
                                            fontSize: 10,
                                            borderBottomRightRadius: 8,
                                            borderTopRightRadius: 8,
                                            width: Math.abs(personLeftPercent) + 43*(personLeftPercent/100),
                                        }}>
                                            <Flex justify="center" align="center">
                                                <Popconfirm onConfirm={() => {
                                                    setSelectedFlatId(record.sectionId);
                                                    setSelectedDate(dayjs(record.dates2.split(" - ")[0], "DD-MM-YYYY HH:mm"));
                                                }} cancelText={"Отмена"} okText={"Открыть"}
                                                            title={`${personLeft.split('#')[0]} ${record.post !== undefined ? `- ${record.post}` : ""}`}
                                                            description={`Даты проживания ${personLeft.split('#')[0].split('&')[1]}`}>
                                                    <div style={{paddingTop: 4, width: Math.abs(personLeftPercent) + 43*(personLeftPercent/100), height: 25}}>
                                                        {/*{`${personLeft.split('#')[0]}`}*/}
                                                    </div>
                                                </Popconfirm>
                                            </Flex>
                                        </div>
                                        <div style={{width: 3}}></div>
                                        <div style={{
                                            cursor: 'pointer', background: '#1677ff', height: 25, color: 'white', fontSize: 10,
                                            borderBottomLeftRadius: 8,
                                            borderTopLeftRadius: 8,
                                            width: Math.abs(personRightPercent) + 43*(personRightPercent/100),
                                            position: 'absolute', right: 0,
                                        }}>
                                            <Flex justify="center" align="center">
                                                <Popconfirm onConfirm={() => {
                                                    setSelectedFlatId(record.sectionId);
                                                    setSelectedDate(dayjs(el, "DD-MM-YYYY"));
                                                }} cancelText={"Отмена"} okText={"Открыть"}
                                                            title={`${personRight.split('#')[0].split('&')[0]} ${record.post2 !== undefined ? `- ${record.post2}` : ""}`}
                                                            description={`Даты проживания ${personRight.split('#')[0].split('&')[1]}`}>
                                                    <div style={{paddingTop: 4, width: Math.abs(personRightPercent) + 43*(personRightPercent/100), height: 25}}></div>
                                                </Popconfirm>
                                            </Flex>
                                        </div>
                                    </>

                                </Flex>)
                            }
                        } else return <Popconfirm title={'Добавить запись о проживании?'} okText={"Да"} cancelText={"Отмена"} onConfirm={() => {
                            setFilialId(record.filialId);
                            setHotelId(record.hotelId);
                            setFlatId(record.sectionId);
                            setRoomId(record.room);
                            setBedId(record.bedId);
                            setVisibleGuestModal(true);
                        }}>
                            <div style={{cursor: 'pointer', width: "100%", height: 25}}></div>
                        </Popconfirm>
                    }
                })));
            });
        }
    }, [data]);
    // -----

    // Handlers
    const searchGuestHandler = () => {
        if (searchInputRef) {
            setData((prev: any[]) => {
                return prev.filter((record: any) => {
                    if (JSON.stringify(record).toLowerCase().indexOf(searchInputRef.current.input.value.toLowerCase()) > 0) return true;
                });
            });
        }
    }
    // -----

    return (
        <>
            {visibleGuestModal &&
                <GuestModal
                    filialId={filialId}
                    hotelId={hotelId}
                    flatId={flatId}
                    roomId={roomId}
                    room={null} bedId={bedId} setGuests={() => {
                }} showSuccessMsg={() => {
                }} isAddressDisabled={false} selectedGuest={null} visible={visibleGuestModal} setVisible={setVisibleGuestModal}
                    refresh={() => {
                        if (props.hotelId)
                            getAllFlats({hotelId: props.hotelId, dateStart: props.chessDateRange[0].format("DD-MM-YYYY"), dateFinish: props.chessDateRange[1].format("DD-MM-YYYY")});
                    }}/>}
            {(selectedFlatId && selectedDate && data) &&
                <FlatModal date={selectedDate} flatId={selectedFlatId} visible={true} setVisible={() => {
                    setSelectedFlatId(null);
                    setSelectedDate(null);
                }}/>
            }
            <Flex vertical={false}>
                {/*//@ts-ignore*/}
                <RangePicker style={{margin: 15}} format={"DD-MM-YYYY"} value={props.chessDateRange} onChange={(e) => {
                    props.setChessDateRange(e as any)
                }}/>
                <Flex align={'center'} vertical={false}>
                    <Search ref={searchInputRef} style={{width: 300}} size={'middle'}
                            placeholder={'Поиск комнаты жильца'}
                            onSearch={searchGuestHandler}/>
                    <Button style={{marginLeft: 5, width: 170}} size={'middle'} type={'primary'} onClick={() => {
                        setData(flatsData ?? []);
                        if (searchInputRef) searchInputRef.current.input.value = "";
                    }}>Сбросить поиск</Button>
                </Flex>
            </Flex>
            {(data && columns && !isFlatsLoading) ?
                <MemoizedChess data={data} columns={columns} isFilialUEZS={isFilialUEZS}/> :
                <Skeleton active={true} style={{width: window.innerWidth}}/>
            }
        </>
    )
};
