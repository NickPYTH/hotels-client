import {flatAPI} from "service/FlatService";
import React, {createContext, useEffect, useRef, useState} from "react";
import {useParams} from "react-router-dom";
import {FlatModel} from "entities/FlatModel";
import {Flat} from "pages/HotelPage/ui/chess/Flat";
import {Button, DatePicker, Flex, Segmented, Space, Spin} from "antd";
import dayjs, {Dayjs} from "dayjs";
import {BedModel} from "entities/BedModel";
import {CellsViewSettingsModal} from "shared/component/CellsViewSettingsModal";
import {GuestModal} from "shared/component/GuestModal";
import {ReservationModal} from "shared/component/ReservationModal";
import {FlatModal} from "shared/component/FlatModal";
import {AppstoreAddOutlined, SettingOutlined, TagOutlined, UserAddOutlined} from "@ant-design/icons";
import Search from "antd/lib/input/Search";
import {EventModel} from "entities/EventModel";
import {eventAPI} from "service/EventService";
import {EventCell} from "pages/HotelPage/ui/chess/EventCell";

const {RangePicker} = DatePicker;
type PropsType = {
    showWarningMsg: Function;
    selectedDate: Dayjs;
    hotelId: string;
}

const selectMonthByDate = (date: Dayjs) => {
    switch (date.month()) {
        case 0:
            return "Январь";
        case 1:
            return "Февраль";
        case 2:
            return "Март";
        case 3:
            return "Апрель";
        case 4:
            return "Май";
        case 5:
            return "Июнь";
        case 6:
            return "Июль";
        case 7:
            return "Август";
        case 8:
            return "Сентябрь";
        case 9:
            return "Октябрь";
        case 10:
            return "Ноябрь";
        case 11:
            return "Декабрь";
    }
}

export type ChessEvent = {
    date: string;
    events: EventModel[];
}

type ChessContextType = {
    setSelectedDate: Function,
    setSelectedFlatId: Function,
    dateStart: Dayjs,
    cellWidth: number,
    setSelectedRow: Function,
    selectedRow: BedModel | null,
    interactiveMode: boolean,
    selectCellHandler: Function
}

type SelectedCellType = {
    recordId: string;
    filialId: number;
    hotelId: number;
    sectionId: number;
    roomId: number;
    bedId: number;
    date: string;
}

const selectCellHandler = (date: string, bed: BedModel) => {
    let selectedCells = null;
    if (localStorage.getItem('selectedCells'))
        selectedCells = JSON.parse(localStorage.getItem('selectedCells') ?? "");
    let selectedCell: any = {
        recordId: `$$$${bed.id}${date}`,
        bedId: bed.id,
        date,
        filialId: bed.room.flat.hotel.filial.id,
        hotelId: bed.room.flat.hotel.id,
        roomId: bed.room.id,
        sectionId: bed.room.flat.id
    };
    if (selectedCells == null) {
        localStorage.setItem('selectedCells', `[${JSON.stringify(selectedCell)}]`);
        document.getElementById(`$$$${bed.id}${date}`)?.classList.add('selectedCell');
    } else {
        if (selectedCells.find((el: SelectedCellType) => el.recordId == selectedCell.recordId)) { // Если нажали на туже ячейку
            document.getElementById(`$$$${bed.id}${date}`)?.classList.remove('selectedCell');
            selectedCells = selectedCells.filter((el: SelectedCellType) => el.recordId != selectedCell.recordId);
            if (selectedCells.length == 0) localStorage.removeItem('selectedCells');
            else localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
        } else if (selectedCells[0].bedId != selectedCell.bedId) { // Выбрано другое место, нужно удалить предыдущие выделения
            [1, 2, 3, 4].forEach(() => Array.prototype.forEach.call(document.getElementsByClassName('selectedCell'), function (el: Element) {
                el.classList.remove('selectedCell');
            }));
            document.getElementById(`$$$${bed.id}${date}`)?.classList.add('selectedCell');
            localStorage.setItem('selectedCells', `[${JSON.stringify(selectedCell)}]`);
        } else {
            if (selectedCells.length == 1) { // Проверяем возможность заполнения расстояния между ячейками, если одна уже выбрана
                let firstCell: SelectedCellType = dayjs(selectedCells[0].date, 'DD-MM-YYYY HH:mm').isBefore(dayjs(selectedCell.date, 'DD-MM-YYYY HH:mm')) ? selectedCells[0] : selectedCell;
                let secondCell: SelectedCellType = dayjs(selectedCell.date, 'DD-MM-YYYY HH:mm').isAfter(dayjs(selectedCells[0].date, 'DD-MM-YYYY HH:mm')) ? selectedCell : selectedCells[0];
                let firstDate: Dayjs = dayjs(firstCell.date, 'DD-MM-YYYY HH:mm');
                let secondDate: Dayjs = dayjs(secondCell.date, 'DD-MM-YYYY HH:mm');
                console.log(firstCell, secondCell, firstDate, secondDate)
                if (!selectedCells.find((c: SelectedCellType) => c.date == firstCell.date)) {
                    selectedCells.push(firstCell);
                    document.getElementById(`$$$${firstCell.bedId}${firstCell.date}`)?.classList.add('selectedCell');
                }
                while (firstDate.isBefore(secondDate)) { // Проходим по диапазону дат, записываем их и выделяем
                    firstDate = firstDate.add(1, 'day');
                    selectedCells.push({...selectedCell, date: firstDate.format('DD-MM-YYYY HH:mm')});
                    document.getElementById(`$$$${bed.id}${firstDate.format('DD-MM-YYYY HH:mm')}`)?.classList.add('selectedCell');
                }
                localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
            } else {
                selectedCells.push(selectedCell);
                document.getElementById(`$$$${bed.id}${date}`)?.classList.add('selectedCell');
                localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
            }
        }
    }
};

export const ChessContext = createContext<ChessContextType | null>(null);

export const NewChess = (props: PropsType) => {

    // States
    let {id} = useParams();
    const [data, setData] = useState<FlatModel[] | null>(null);
    const [eventsData, setEventsData] = useState<ChessEvent[] | null>(null);
    const [dateStart, setDateStart] = useState<Dayjs>(dayjs());
    const [dateFinish, setDateFinish] = useState<Dayjs>(dayjs().add(30, 'day'));
    const [dateStartBook, setDateStartBook] = useState<Dayjs | null>(null);
    const [dateFinishBook, setDateFinishBook] = useState<Dayjs | null>(null);
    const [dates, setDates] = useState<Dayjs[]>([]);
    const [selectedRow, setSelectedRow] = useState<BedModel | null>(null);
    const [cellWidth] = useState<number>(window.innerWidth - 165);
    const [visibleCellsViewSettings, setVisibleCellsViewSettings] = useState(false);
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [visibleReservationModal, setVisibleReservationModal] = useState(false);
    const [filialId, setFilialId] = useState<number | null>(null);
    const [hotelId, setHotelId] = useState<number | null>(null);
    const [flatId, setFlatId] = useState<number | null>(null);
    const [roomId, setRoomId] = useState<number | null>(null);
    const [bedId, setBedId] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
    const [currentMonth, setCurrentMonth] = useState<string>(() => selectMonthByDate(props.selectedDate) ?? "Май");
    const [interactiveMode, setInteractiveMode] = useState(false);
    const [isFilialUEZS] = useState(() => props.hotelId === '182' || props.hotelId === '183' || props.hotelId === '184' || props.hotelId === '327');
    const searchInputRef = useRef<any>(null);
    const [context, setContext] = useState<ChessContextType>({
        cellWidth: cellWidth / dates.length,
        dateStart: dateStart,
        selectedRow: null,
        setSelectedDate,
        setSelectedFlatId,
        setSelectedRow,
        interactiveMode,
        selectCellHandler
    });
    // -----

    // Web requests
    const [getChessData, {
        data: chessData,
        isLoading: isChessDataLoading
    }] = flatAPI.useGetNewChessMutation();
    const [getEvents, {
        data: events,
    }] = eventAPI.useGetAllByDateRangeMutation();
    // -----

    // Effects
    useEffect(() => {
        localStorage.removeItem('selectedCells');
        getChessData({
            hotelId: id ?? "",
            dateStart: dayjs(dateStart.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
            dateFinish: dayjs(dateFinish.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
        });
        getEvents({
            dateStart: dayjs(dateStart.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
            dateFinish: dayjs(dateFinish.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
            hotelId: id ? id : "999"
        })
    }, []);
    useEffect(() => {
        let tmp: Dayjs[] = [];
        let ds = dateStart;
        while (dateFinish.isAfter(ds) || dateFinish.isSame(ds)) {
            tmp.push(ds);
            ds = ds.add(1, 'day');
        }
        setDates(tmp);
        getChessData({
            hotelId: id ?? "",
            dateStart: dayjs(dateStart.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
            dateFinish: dayjs(dateFinish.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
        });
        getEvents({
            dateStart: dayjs(dateStart.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
            dateFinish: dayjs(dateFinish.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
            hotelId: id ? id : "999"
        })
    }, [dateStart, dateFinish]);
    useEffect(() => {
        if (chessData) setData(chessData);
    }, []);
    useEffect(() => {
        if (isChessDataLoading) setData(null);
    }, [isChessDataLoading])
    useEffect(() => {
        if (chessData) setData(chessData);
    }, [chessData]);
    useEffect(() => {
        if (events) setEventsData(events)
    }, [events])
    useEffect(() => {
        setContext((prev: ChessContextType) => ({...prev, cellWidth: cellWidth / dates.length, interactiveMode}));
    }, [dates, interactiveMode]); // Для обновления контекста
    // -----

    // Handlers
    const updateCurrentMonthHandler = (value: string) => {
        setCurrentMonth(value);
        switch (value) {
            case "Январь":
                setDateStart(dayjs('01-01-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('31-01-2025', 'DD-MM-YYYY'));
                break;
            case "Февраль":
                setDateStart(dayjs('01-02-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('28-02-2025', 'DD-MM-YYYY'));
                break;
            case "Март":
                setDateStart(dayjs('01-03-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('31-03-2025', 'DD-MM-YYYY'));
                break;
            case "Апрель":
                setDateStart(dayjs('01-04-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('30-04-2025', 'DD-MM-YYYY'));
                break;
            case "Май":
                setDateStart(dayjs('01-05-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('31-05-2025', 'DD-MM-YYYY'));
                break;
            case "Июнь":
                setDateStart(dayjs('01-06-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('30-06-2025', 'DD-MM-YYYY'));
                break;
            case "Июль":
                setDateStart(dayjs('01-07-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('31-07-2025', 'DD-MM-YYYY'));
                break;
            case "Август":
                setDateStart(dayjs('01-08-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('31-08-2025', 'DD-MM-YYYY'));
                break;
            case "Сентябрь":
                setDateStart(dayjs('01-09-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('30-09-2025', 'DD-MM-YYYY'));
                break;
            case "Октябрь":
                setDateStart(dayjs('01-10-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('31-10-2025', 'DD-MM-YYYY'));
                break;
            case "Ноябрь":
                setDateStart(dayjs('01-11-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('30-11-2025', 'DD-MM-YYYY'));
                break;
            case "Декабрь":
                setDateStart(dayjs('01-12-2025', 'DD-MM-YYYY'));
                setDateFinish(dayjs('31-12-2025', 'DD-MM-YYYY'));
                break;
        }
    };
    const addGuestHandler = () => {
        if (localStorage.getItem('selectedCells') == null) {
            props.showWarningMsg('Вы не выбрали ни одного дня');
            return;
        }
        let selectedCells: SelectedCellType[] = JSON.parse(localStorage.getItem('selectedCells') ?? "");
        let sorted = selectedCells.sort((a, b) => dayjs(a.date, 'DD-MM-YYYY HH:mm').diff(dayjs(b.date, 'DD-MM-YYYY HH:mm')));
        let startCell = sorted[0];
        let finishCell = sorted[sorted.length - 1];
        setFilialId(startCell.filialId);
        setHotelId(startCell.hotelId);
        setFlatId(startCell.sectionId);
        setRoomId(startCell.roomId);
        setBedId(startCell.bedId);
        setDateStartBook(dayjs(startCell.date, 'DD-MM-YYYY'));
        setDateFinishBook(dayjs(finishCell.date, 'DD-MM-YYYY'));
        setVisibleGuestModal(true);
    };
    const addReservationHandler = () => {
        if (localStorage.getItem('selectedCells') == null) {
            props.showWarningMsg('Вы не выбрали ни одного дня');
            return;
        }
        let selectedCells: SelectedCellType[] = JSON.parse(localStorage.getItem('selectedCells') ?? "");
        let sorted = selectedCells.sort((a, b) => dayjs(a.date, 'DD-MM-YYYY HH:mm').diff(dayjs(b.date, 'DD-MM-YYYY HH:mm')));
        let startCell = sorted[0];
        let finishCell = sorted[sorted.length - 1];
        setFilialId(startCell.filialId);
        setHotelId(startCell.hotelId);
        setFlatId(startCell.sectionId);
        setRoomId(startCell.roomId);
        setBedId(startCell.bedId);
        setDateStartBook(dayjs(dateStart, 'DD-MM-YYYY'));
        setDateFinishBook(dayjs(dateFinish, 'DD-MM-YYYY'));
        setVisibleReservationModal(true);
    };
    const interactiveModeHandler = () => {
        localStorage.removeItem('selectedCells');
        [1, 2, 3, 4].forEach(() => Array.prototype.forEach.call(document.getElementsByClassName('selectedCell'), function (el: Element) {
            el.classList.remove('selectedCell');
        }));
        setInteractiveMode(prev => !prev);
    };
    const refreshHandler = () => {
        getChessData({
            hotelId: id ?? "",
            dateStart: dayjs(dateStart.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
            dateFinish: dayjs(dateFinish.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
        });
    };
    const searchGuestHandler = () => {
        if (searchInputRef) {
            setData((flatsOrig: FlatModel[]) => {
                let flats: FlatModel[] = JSON.parse(JSON.stringify(flatsOrig));
                return flats.filter((flat: FlatModel) => {
                    if (JSON.stringify(flat).toLowerCase().indexOf(searchInputRef.current.input.value.toLowerCase()) > 0) return true;
                    else return false;
                });
            })
        }
    };
    // -----

    return (<ChessContext.Provider value={context}>
            <CellsViewSettingsModal visible={visibleCellsViewSettings} setVisible={setVisibleCellsViewSettings}/>
            {(visibleGuestModal && dateStartBook && dateFinishBook && filialId && hotelId && flatId && roomId && bedId) &&
                <GuestModal
                    dateStart={dateStartBook}
                    dateFinish={dateFinishBook}
                    filialId={filialId}
                    hotelId={hotelId}
                    flatId={flatId}
                    roomId={roomId}
                    bedId={bedId} setGuests={() => {
                }} showSuccessMsg={() => {
                }} isAddressDisabled={false} selectedGuest={null} visible={visibleGuestModal} setVisible={setVisibleGuestModal}
                    refresh={() => {
                        if (props.hotelId)
                            getChessData({
                                hotelId: id ?? "",
                                dateStart: dayjs(dateStart.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
                                dateFinish: dayjs(dateFinish.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
                            });
                    }}/>}
            {(visibleReservationModal && dateStartBook && dateFinishBook && filialId && hotelId && flatId && roomId && bedId) &&
                <ReservationModal
                    dateStart={dateStartBook}
                    dateFinish={dateFinishBook}
                    filialId={filialId}
                    hotelId={hotelId}
                    flatId={flatId}
                    roomId={roomId}
                    bedId={bedId}
                    selectedReservation={null}
                    visible={visibleReservationModal}
                    setVisible={setVisibleReservationModal}
                    refresh={() => {
                        if (props.hotelId)
                            getChessData({
                                hotelId: id ?? "",
                                dateStart: dayjs(dateStart.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
                                dateFinish: dayjs(dateFinish.format("DD-MM-YYYY") + " 23:59", "DD-MM-YYYY HH:mm").unix(),
                            });
                    }}/>}
            {(selectedFlatId && selectedDate && data) &&
                <FlatModal hotelId={props.hotelId} date={selectedDate} flatId={selectedFlatId} visible={true} setVisible={() => {
                    setSelectedFlatId(null);
                    setSelectedDate(null);
                }}/>
            }
            <Flex vertical={false} justify={'space-between'} style={{width: window.innerWidth}}>
                <Flex>
                    <Button icon={<AppstoreAddOutlined/>} type={interactiveMode ? "primary" : "default"} style={{marginLeft: 10, marginRight: 5}} onClick={interactiveModeHandler}>Интерактивное
                        заселение</Button>
                    {interactiveMode && <Button icon={<UserAddOutlined/>} onClick={addGuestHandler}>Заселить</Button>}
                    {(interactiveMode && isFilialUEZS) && <Button icon={<TagOutlined/>} style={{marginLeft: 5}} onClick={addReservationHandler}>Забронировать</Button>}
                </Flex>
                <Flex vertical={false}>
                    {/*//@ts-ignore*/}
                    <RangePicker style={{width: 285, marginRight: 5}} format={"DD-MM-YYYY"} value={[dateStart, dateFinish]} onChange={(e) => {
                        const dr: any[] = e as any[];
                        setDateStart(dr[0]);
                        setDateFinish(dr[1]);
                    }}/>
                    <Button onClick={refreshHandler}>
                        Обновить
                    </Button>
                    <Search ref={searchInputRef} style={{width: 285, marginLeft: 5}} size={'middle'}
                            placeholder={'Общий поиск комнаты жильца'}
                            onSearch={searchGuestHandler}
                            allowClear={true}
                            onChange={(e) => {
                                if (e.target.value == "") {
                                    setData(chessData ?? []);
                                    if (searchInputRef) searchInputRef.current.input.value = "";
                                }
                            }}
                    />
                </Flex>
                <Flex style={{width: 232}} justify={'flex-end'}>
                    <Button icon={<SettingOutlined/>} style={{marginRight: 10}} onClick={() => setVisibleCellsViewSettings(true)}>Настройки</Button>
                </Flex>
            </Flex>
            <Segmented<string>
                value={currentMonth}
                block={true}
                style={{width: window.innerWidth, margin: 0}}
                options={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']}
                onChange={updateCurrentMonthHandler}
            />
            <Space id='chess' direction='vertical'>
                {isChessDataLoading ? <Spin size='large' style={{position: "absolute", left: window.innerWidth / 2 - 45, marginTop: 50}}/>
                    :
                    <>
                        <Flex>
                            <div style={{width: 165}}></div>
                            {dates.map((date: Dayjs) => {
                                return (
                                    <Flex justify='center' align='center' style={{width: cellWidth / dates.length, fontSize: 14}}>
                                        {(date.date() == dayjs().date() && date.month() == dayjs().month()) ?
                                            <strong>{date.format("DD-MM")}</strong>
                                            :
                                            date.format("DD-MM")
                                        }
                                    </Flex>)
                            })}
                        </Flex>
                        <Flex>
                            <div style={{width: 162, fontSize: 14, textAlign: 'end', paddingRight: 3, marginBottom: 3}}>Мероприятия</div>
                            {eventsData?.map((eventCell: ChessEvent) => {
                                return (
                                    <Flex justify='end' align='center' vertical style={{width: cellWidth / dates.length, fontSize: 12}}>
                                        {eventCell.events.map((event: EventModel) => <EventCell
                                            event={event}
                                            currentDate={eventCell.date}
                                            dateStart={dayjs(event.dateStart).format("DD-MM-YYYY")}
                                            dateFinish={dayjs(event.dateFinish).format("DD-MM-YYYY")}
                                        />)}
                                        {eventCell.events.length == 0 &&
                                            <div style={{width: cellWidth / dates.length, height: 5}}></div>
                                        }
                                    </Flex>)
                            })}
                        </Flex>
                        <Space direction='vertical' style={{height: window.innerHeight - 365, overflowY: 'scroll', overflowX: 'hidden'}}>
                            {data?.map((flat: FlatModel, flatIndex: number) => (
                                <Flat flat={{...flat, flatIndex}} key={flat.id}/>
                            ))}
                        </Space>
                    </>
                }
            </Space>
        </ChessContext.Provider>
    )
}