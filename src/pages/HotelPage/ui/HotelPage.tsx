import React, {useEffect, useState} from 'react';
import {Button, DatePicker, Divider, Dropdown, Empty, Flex, MenuProps, message, Slider, SliderSingleProps, Spin, Switch} from 'antd';
import {useNavigate, useParams} from "react-router-dom";
import {flatAPI} from "service/FlatService";
import {FlatModel} from "entities/FlatModel";
import {LeftOutlined, UsergroupAddOutlined} from "@ant-design/icons";
import Search from 'antd/lib/input/Search';
import {RoomModel} from "entities/RoomModel";
import {GuestModel} from "entities/GuestModel";
import dayjs, {Dayjs} from 'dayjs';
import {host} from "shared/config/constants";
import {FlatModal} from "shared/component/FlatModal";
import {GuestModal} from "shared/component/GuestModal";

import {FlatCard} from "./FlatCard";
import {NotCheckoutedModal} from "./NotCheckoutedModal";
import {ThirdFloorPlanModal} from "./ThirdFloorPlanModal";
import {GroupGuestModal} from "./GroupGuestModal";
import {TableView} from "./TableView";
import {GroupReservationModal} from "shared/component/GroupReservationModal";
import {NewChess} from "pages/HotelPage/ui/chess/NewChess";
import {ChessView} from "pages/HotelPage/ui/ChessView";

const HotelPage: React.FC = () => {

    // Useful utils
    let {id} = useParams();
    const navigate = useNavigate();
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const showSuccessMsg = (msg: string) => {
        messageApi.success(msg);
    };
    const viewItemsButton = [
        {
            key: 0,
            label: 'Таблица',
        },
        {
            key: 1,
            label: 'Карточки',
        },
        {
            key: 2,
            label: 'Шахматка',
        },
        {
            key: 3,
            label: 'Шахматка NEW!',
        },
    ];
    // -----

    // States
    const [hotelName, setHotelName] = useState("");
    const [filialId, setFilialId] = useState<number | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [thirdFloorPlanModalVisible, setThirdFloorPlanModalVisible] = useState(false);
    const [flats, setFlats] = useState<FlatModel[] | null>(null);
    const [hideBusy, setHideBusy] = useState<boolean>(false);
    const [hideTech, setHideTech] = useState<boolean>(true);
    const [flatModalVisible, setFlatModalVisible] = useState(false);
    const [searchText, setSearchText] = useState('');
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs>(dayjs());
    const [notCheckoutModalVisible, setNotCheckoutModalVisible] = useState(false);
    const [dateMarks, setDateMarks] = useState<SliderSingleProps['marks']>({});
    const [dividerHeight, setDividerHeight] = useState(110);  // Высота меню в зависимости от режима отображения
    const [chessDateRange, setChessDateRange] = useState<Dayjs[]>(() => {
        if (id == "327")
            return [dayjs(), dayjs().add(30, 'days')]
        else
            return [dayjs(), dayjs().add(10, 'days')]
    });
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [visibleManyGuestModal, setVisibleManyGuestModal] = useState(false);
    const [visibleGroupReservationModal, setVisibleGroupReservationModal] = useState(false);
    const [selectedView, setSelectedView] = useState<string>(() => {
        if (localStorage.getItem("viewMode")) return localStorage.getItem('viewMode') ?? "1"; // 1 - Карточки, 2 - Шахматка, 3 - Таблица
        return "1";
    });
    // -----

    // Web requests
    const [getAllFlats, {
        data: flatsData,
        isLoading: isFlatsLoading
    }] = flatAPI.useGetAllMutation();
    const [getAllFlatsSilent, {
        data: flatsDataSilent,
        isLoading: isFlatsLoadingSilent,
        isSuccess: isFlatsSuccessSilent
    }] = flatAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        if (selectedView == "2") setDividerHeight(69);
        else setDividerHeight(110);
    }, [selectedView]);
    useEffect(() => {
        if (hideBusy) setFlats(prev => prev ? prev.filter((f: FlatModel) => {
            let all = f.bedsCount;
            let busy = f.rooms?.reduce((acc, room) => {
                return acc + (room.guests ? room.guests.length : 0);
            }, 0);
            return all !== busy;
        }) : null);
        else setFlats(flatsData ?? []);
    }, [hideBusy]);
    useEffect(() => {
        if (flatsData) {
            setHotelName(flatsData[0].hotel.name);
            setFilialId(flatsData[0].hotel.filial.id);
            setFlats(flatsData);
        }
    }, [flatsData]);
    useEffect(() => {
        if (!flatModalVisible) {
            setSelectedFlatId(null);
            if (id) getAllFlatsSilent({hotelId: id, date: selectedDate.format('DD-MM-YYYY HH:mm')});
        }
    }, [flatModalVisible]);
    useEffect(() => {
        if (isFlatsLoadingSilent) showWarningMsg("Идет синхронизация... Продолжайте работу.");
    }, [isFlatsLoadingSilent]);
    useEffect(() => {
        if (isFlatsSuccessSilent) showSuccessMsg("Данные синхронизированы.");
    }, [isFlatsSuccessSilent]);
    useEffect(() => {
        if (flatsDataSilent) {
            setFlats(flatsDataSilent);
        }
    }, [flatsDataSilent]);
    useEffect(() => {
        if (id) getAllFlats({hotelId: id, date: selectedDate.format('DD-MM-YYYY HH:mm')});
        let marks: SliderSingleProps['marks'] = {}
        let counter = 0;
        for (let i = 49; i > -1; i -= 7) {
            marks[i] = {
                date: counter === 0 ? selectedDate.add(counter * -1, 'day') : dayjs(`${selectedDate.add(counter * -1, 'day').format('DD-MM-YYYY')} 12:00`, 'DD-MM-YYYY HH:mm'),
                label: <div style={{width: 76}}>
                    <div>{selectedDate.add(counter * -1, 'day').format('DD-MM')}</div>
                </div>
            }
            counter++;
        }
        counter = 1;
        for (let i = 56; i < 100; i += 7) {
            marks[i] = {
                date: dayjs(`${selectedDate.add(counter, 'day').format('DD-MM-YYYY')} 12:00`, 'DD-MM-YYYY HH:mm'),
                label: <div style={{width: 76}}>
                    <div>{selectedDate.add(counter, 'day').format('DD-MM')}</div>
                </div>
            }
            counter++;
        }
        setDateMarks(marks);
    }, [selectedDate])
    // -----

    // Handlers
    const onViewButtonClick: MenuProps['onClick'] = (e) => {
        localStorage.setItem('viewMode', e.key);
        setSelectedView(e.key);
    };
    const searchGuestHandler = () => {
        if (flatsData) {
            if (searchText.length === 0) {
                setFlats(flatsData);
                return;
            }
            let res = flatsData.filter((flat: FlatModel) => {
                let flats = flat.rooms?.filter((room: RoomModel) => {
                    let res: GuestModel | undefined = room.guests?.find((guest: GuestModel) => guest.lastname?.toUpperCase().indexOf(searchText.toUpperCase()) !== -1 || guest.firstname?.toUpperCase().indexOf(searchText.toUpperCase()) !== -1 || guest.secondName?.toUpperCase().indexOf(searchText.toUpperCase()) !== -1);
                    return !!res;
                });
                if (flats && flats.length > 0) return true;
                else return false;
            });
            setFlats(res);
        }
    };
    const onSliderChange = (value: number) => {
        //@ts-ignore
        setSelectedDate(dateMarks[value].date);
    }
    // -----

    if (isFlatsLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    else
        return (
            <Flex gap="middle" align="start" vertical={true} wrap={'wrap'}>
                {(thirdFloorPlanModalVisible && flatsData && id) &&
                    <ThirdFloorPlanModal
                        setSelectedFlatId={setSelectedFlatId}
                        selectedFlatId={selectedFlatId}
                        flatsData={flatsData}
                        visible={thirdFloorPlanModalVisible}
                        setVisible={setThirdFloorPlanModalVisible}
                        showWarningMsg={showWarningMsg}
                        date={selectedDate}
                        visibleFlatModal={flatModalVisible}
                        setFlatModalVisible={setFlatModalVisible}
                        hotelId={id}
                    />
                }
                {(notCheckoutModalVisible && id) && <NotCheckoutedModal hotelId={id} visible={notCheckoutModalVisible} setVisible={setNotCheckoutModalVisible} selectedDate={selectedDate}/>}
                {messageContextHolder}
                {visibleGroupReservationModal &&
                    <GroupReservationModal visible={visibleGroupReservationModal} setVisible={setVisibleGroupReservationModal} refresh={() => {
                    }} showWarningMsg={showWarningMsg}/>}
                {(visibleManyGuestModal && filialId && id) &&
                    <GroupGuestModal
                        filialId={filialId}
                        hotelId={parseInt(id)}
                        hotelName={hotelName}
                        visible={visibleManyGuestModal}
                        setVisible={setVisibleManyGuestModal}
                        refresh={() => {
                            if (id) getAllFlatsSilent({hotelId: id, date: selectedDate.format('DD-MM-YYYY HH:mm')})
                        }}
                        showWarningMsg={showWarningMsg}
                    />
                }
                {visibleGuestModal &&
                    <GuestModal
                        setGuests={() => {
                        }}
                        showSuccessMsg={showSuccessMsg}
                        isAddressDisabled={false}
                        selectedGuest={null}
                        visible={visibleGuestModal}
                        setVisible={setVisibleGuestModal}
                        refresh={() => {
                            if (id) getAllFlatsSilent({hotelId: id, date: selectedDate.format('DD-MM-YYYY HH:mm')});
                        }}/>}
                {(selectedFlatId && id) &&
                    <FlatModal hotelId={id} date={selectedDate} flatId={selectedFlatId} visible={flatModalVisible} setVisible={setFlatModalVisible}/>
                }
                <Flex style={{marginTop: 15, marginLeft: 15}} gap={'small'} align={'center'}>
                    <Flex>
                        <Button style={{marginRight: 10, height: dividerHeight}} icon={<LeftOutlined/>} type={'primary'} onClick={() => navigate(-1)}></Button>
                        <Flex vertical style={{width: 260}}>
                            <Button style={{marginBottom: 5}} onClick={() => setNotCheckoutModalVisible(true)}>Список не выселенных</Button>
                            <Dropdown.Button menu={{items: viewItemsButton, onClick: onViewButtonClick}}>
                                <div style={{width: 197}}>
                                    Выбран режим:
                                    {selectedView === "0" && " Таблица"}
                                    {selectedView === "1" && " Карточки"}
                                    {selectedView === "2" && " Шахматка"}
                                    {selectedView === "3" && " Шахматка NEW!"}
                                </div>
                            </Dropdown.Button>
                            {selectedView != "2" &&
                                <Flex style={{marginTop: 5}}>
                                    <DatePicker
                                        value={selectedDate}
                                        allowClear={false}
                                        showTime
                                        format={"DD-MM-YYYY HH:mm"}
                                        showSecond={false}
                                        onOk={(value: any) => setSelectedDate(value)}
                                        onChange={(value: any) => setSelectedDate(value)}/>
                                    <Button style={{marginLeft: 5}} onClick={() => setSelectedDate(dayjs())}>Сейчас</Button>
                                </Flex>
                            }
                        </Flex>
                    </Flex>
                    <div style={{marginLeft: 20, fontSize: 20, fontWeight: 600, wordBreak: 'break-word', whiteSpace: 'normal', width: 370}}>{hotelName}</div>
                    <Divider style={{height: dividerHeight}} type={'vertical'}/>
                    <Flex vertical={true} justify={'center'}>
                        <Flex align={'center'} style={{marginBottom: 10}}>
                            <div style={{width: 240}}>Скрыть занятые секции</div>
                            <div>
                                <Switch value={hideBusy} onChange={(e) => setHideBusy(e)} style={{marginLeft: 5}}/>
                            </div>
                        </Flex>
                        <Flex align={'center'} style={{marginBottom: 10}}>
                            <div style={{width: 240, wordBreak: 'break-word', whiteSpace: 'normal'}}>Скрыть технические помещения</div>
                            <div>
                                <Switch value={hideTech} onChange={(e) => setHideTech(e)} style={{marginLeft: 5}}/>
                            </div>
                        </Flex>

                    </Flex>
                    <Divider style={{height: dividerHeight}} type={'vertical'}/>
                    <Flex vertical={true}>
                        <Button style={{width: '100%', marginBottom: 10}} icon={<UsergroupAddOutlined/>} type="primary" onClick={() => setVisibleManyGuestModal(true)}>
                            Групповая загрузка жильцов
                        </Button>
                        <Button style={{width: '100%', marginBottom: 10}} icon={<UsergroupAddOutlined/>} type="primary" onClick={() => setVisibleGroupReservationModal(true)}>
                            Групповое бронирование
                        </Button>
                    </Flex>
                    <Divider style={{height: dividerHeight}} type={'vertical'}/>
                    {selectedView !== "2" && <>
                        <Flex align={'center'} vertical={true}>
                            <Search style={{marginBottom: 10, width: 300}} size={'middle'} value={searchText} onChange={(e) => setSearchText(e.target.value)} placeholder={'Поиск комнаты жильца'}
                                    onSearch={searchGuestHandler}/>
                            <Button style={{width: 170}} size={'middle'} type={'primary'} onClick={() => {
                                setFlats(flatsData ?? []);
                                setSearchText("");
                            }}>Сбросить поиск</Button>
                        </Flex>
                        <Divider style={{height: dividerHeight}} type={'vertical'}/>
                    </>
                    }
                </Flex>
                {selectedView === "1" &&
                    <Flex justify={'center'} align={'center'} style={{width: window.innerWidth}}>
                        <Slider onChange={onSliderChange} defaultValue={49} step={7} style={{width: '93%'}} marks={dateMarks} min={0} max={98}/>
                    </Flex>
                }
                <Divider style={{marginTop: 0, marginBottom: 5}}/>
                {(selectedView == "1" && flats) &&
                    <>{[1, 2, 3, 4, 5, 6].map((floorNumber: number) => {
                        let flatCount = flats?.filter((f: FlatModel) => f.floor === floorNumber && !f.tech)?.length;
                        if (flatCount)
                            return (
                                <Flex style={{marginRight: 15, marginLeft: 15}} gap="middle" align="start" vertical={false} justify="center">
                                    <div style={{width: 200}}>
                                        <h2>{floorNumber} этаж</h2>
                                        <div>Всего комнат {flatCount}</div>
                                        <div>Всего мест {flats?.filter((f: FlatModel) => f.floor === floorNumber && !f.tech).reduce(function (acc, flat) {
                                            return acc + (flat.bedsCount ?? 0);
                                        }, 0)}</div>
                                        <div>Свободных мест {flats?.filter((f: FlatModel) => f.floor === floorNumber && !f.tech).reduce(function (acc, flat) {
                                            if (flat.status?.id == 4) { // Комната занята боряином не считаем
                                                return acc;
                                            } else {  // Расчет мест только в открытых комнатах
                                                return acc + (flat.rooms?.reduce((acc, room: RoomModel) => {
                                                    if (room.status?.id == 1) { // free
                                                        return acc + room.bedsCount - (room.guests ? room.guests.length : 0);
                                                    }
                                                    return acc;
                                                }, 0) ?? 0);
                                            }
                                        }, 0)}</div>
                                        <Button onClick={() => {
                                            if (flats) {
                                                showWarningMsg("Отчет начал формироваться.")
                                                let tmpButton = document.createElement('a')
                                                tmpButton.href = `${host}/hotels/api/report/getFloorReport?hotelId=${flats[0].hotel.id}&floor=${floorNumber}&date=${selectedDate.format('DD-MM-YYYY HH:mm')}`;
                                                tmpButton.click();
                                            }
                                        }} style={{marginTop: 36, marginBottom: 5, width: 180}}>Скачать отчет по этажу</Button>
                                        {(floorNumber === 3 && id == "182") && <Button onClick={() => setThirdFloorPlanModalVisible(true)} style={{width: 180}}>Открыть план этажа</Button>}
                                    </div>
                                    <Divider style={{margin: 0, height: 255}} type="vertical"/>
                                    <div style={{width: window.innerWidth - 251, overflowX: 'scroll'}}>
                                        <Flex>
                                            {flats?.filter((f: FlatModel) => f.floor === floorNumber).map((flat: FlatModel) => {
                                                    if (flat.tech === false) return (
                                                        <FlatCard key={flat.id} selectedDate={selectedDate} flat={flat} setVisible={setFlatModalVisible} setSelectedFlatId={setSelectedFlatId}/>);
                                                    if (hideTech === false) return (
                                                        <FlatCard key={flat.id} selectedDate={selectedDate} flat={flat} setVisible={setFlatModalVisible} setSelectedFlatId={setSelectedFlatId}/>);
                                                }
                                            )}
                                        </Flex>
                                    </div>
                                </Flex>
                            )
                    })}
                        {flats?.length === 0 &&
                            <Flex justify={'center'} align={'center'} style={{width: window.innerWidth, height: 500}}>
                                <Empty description={(
                                    <Flex style={{height: 60}} justify={'space-between'} align={'center'} vertical={true}>
                                        <Flex>Ничего не найдено</Flex>
                                        <Button type={'primary'} onClick={() => {
                                            setFlats(flatsData ?? []);
                                            setSearchText("");
                                        }}>Сбросить поиск</Button>
                                    </Flex>)}/>
                            </Flex>
                        }
                    </>
                }
                {(id && selectedView === '2') && <ChessView
                    showWarningMsg={showWarningMsg}
                    chessDateRange={chessDateRange}
                    setChessDateRange={setChessDateRange}
                    selectedDate={selectedDate}
                    hotelId={id}
                />
                }
                {(id && selectedView === '3') && <NewChess
                    showWarningMsg={showWarningMsg}
                    selectedDate={selectedDate}
                    hotelId={id}
                />}
                {(selectedView === '0' && id && flats) &&
                    <Flex>
                        <TableView
                            hotelId={id}
                            flatsData={flats}
                            selectedDate={selectedDate}
                            setVisibleGuestModal={setVisibleGuestModal}
                            visibleGuestModal={visibleGuestModal}
                        />
                    </Flex>
                }
            </Flex>
        );
};
export default HotelPage;