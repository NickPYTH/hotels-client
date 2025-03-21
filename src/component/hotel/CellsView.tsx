import '../../index.scss';
import {Button, DatePicker, Flex, Popover, Segmented, Table} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {flatAPI} from "../../service/FlatService";
import {FlatModal} from "./FlatModal";
import Search from "antd/lib/input/Search";
import {GuestModal} from "../dict/GuestModal";
import {CellsViewSettingsModal} from "./CellsViewSettingsModal";
import {AppstoreAddOutlined, SettingOutlined, TagOutlined, UserAddOutlined} from "@ant-design/icons";
import {ReservationModal} from "../dict/ReservationModal";

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
    showWarningMsg: Function
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

// Table component
const ChessComponent = ({columns, data}) => {
    return (<Table<DataType>
        style={{width: window.innerWidth}}
        loading={data == null}
        columns={columns}
        dataSource={data}
        bordered={true}
        pagination={{
            defaultPageSize: 400//isFilialUEZS ? 100 : 20,
        }}
        scroll={{x: window.innerWidth, y: window.innerHeight - 330}}
    />)
}
const MemoizedChess = React.memo(ChessComponent);
// -----

export const CellsView = (props: ModalPros) => {

    // States
    // Для интерактивного заселения
    const [filialId, setFilialId] = useState<number | null>(null);
    const [hotelId, setHotelId] = useState<number | null>(null);
    const [flatId, setFlatId] = useState<number | null>(null);
    const [roomId, setRoomId] = useState<number | null>(null);
    const [bedId, setBedId] = useState<number | null>(null);
    const [dateStart, setDateStart] = useState<Dayjs | null>(null);
    const [dateFinish, setDateFinish] = useState<Dayjs | null>(null);
    // -----
    const searchInputRef = useRef<any>(null);
    const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
    const [data, setData] = useState<any[] | null>(null);
    const [columns, setColumns] = useState<any[] | null>(null);
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [visibleReservationModal, setVisibleReservationModal] = useState(false);
    const [visibleCellsViewSettings, setVisibleCellsViewSettings] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<string>(() => selectMonthByDate(props.selectedDate));
    const [cellsMaleColor] = useState(() => {
        if (localStorage.getItem("cellsMaleColor")) return localStorage.getItem('cellsMaleColor');
        return "#75a5f2";
    });
    const [cellsFemaleColor] = useState(() => {
        if (localStorage.getItem("cellsFemaleColor")) return localStorage.getItem('cellsFemaleColor');
        return "#f1259b";
    });
    const [fontColor] = useState(() => {
        if (localStorage.getItem("fontColor")) return localStorage.getItem('fontColor');
        return "#000";
    });
    const [columnWidth] = useState(() => {
        if (localStorage.getItem("columnWidth")) return parseInt(localStorage.getItem('columnWidth'));
        return 120;
    });
    const [fontSize] = useState(() => {
        if (localStorage.getItem("fontSize")) return parseInt(localStorage.getItem('fontSize'));
        return 10;
    });
    const [cellBackgroundColor] = useState(() => {
        if (localStorage.getItem("cellBackgroundColor")) return localStorage.getItem('cellBackgroundColor');
        return '#e1e1e1';
    });
    const [interactiveMode, setInteractiveMode] = useState(false);
    const [isFilialUEZS] = useState(() => props.hotelId === '182' || props.hotelId === '183' || props.hotelId === '184' || props.hotelId === '327');
    // -----

    // Web requests
    const [getAllFlats, {
        data: flatsData,
    }] = flatAPI.useGetAllChessMutation();
    // -----

    // Handlers
    const settingColumnsHandler = (mode: boolean) => {
        let base: any = [
            {
                fixed: 'left',
                title: 'Секция',
                dataIndex: 'section',
                width: 60,
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
            title: `${dayjs(el, 'DD-MM-YYYY').format('DD.MM')}`,
            dataIndex: `${el}`,
            width: columnWidth,
            render: (val: any, record: any) => {
                let dayOfWeek = dayjs(el, "DD-MM-YYYY").day();
                let isWeekend = false;
                if (dayOfWeek == 6 || dayOfWeek == 0) isWeekend = true;
                if (val) {
                    let addedPixel = Math.abs(columnWidth-100);
                    if (val.split('||').length === 1) { // Если ячейка с одним жильцом
                        let percent = val.split('#')[1]; // Формат строки можно подсмотреть в запросах браузера
                        let fio = val.split('#')[0].split('&')[0];
                        let startCell = !data.find(d => {
                            if (d.bedId == record.bedId){
                                let prevDay = dayjs(el, "DD-MM-YYYY").subtract(1, 'day').format("DD-MM-YYYY");
                                if (record[prevDay]) {
                                    if (record[prevDay].toLowerCase().indexOf(fio.toLowerCase()) > -1) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });
                        let datesRange = val.split('#')[0].split('&')[1];
                        let dateTime: string[] = val.split('#')[0].split('&')[1].split(' :: ');
                        let male = val.split('#')[0].split('&')[2] == 'true';
                        let note = val.split('#')[0].split('&')[3] == 'null' ? "" : val.split('#')[0].split('&')[3];
                        let post = val.split('#')[0].split('&')[4];
                        let filial = val.split('#')[0].split('&')[5] == 'emptyF' ? "" : val.split('#')[0].split('&')[5];
                        let isReservation = val.split('#')[0].split('&')[6];
                        let coloredWidth = columnWidth * (Math.abs(percent)/100);
                        return (<Flex key={record.id} vertical={false} style={{background: isWeekend ? cellBackgroundColor : 'inherit', height: 31}}>
                            <div onClick={() => {
                                setSelectedFlatId(record.sectionId);
                                if (percent == 100)
                                    setSelectedDate(dayjs(`${el} 12:00`, "DD-MM-YYYY HH:mm"));
                                else
                                    setSelectedDate(dayjs((percent > 0 && percent < 100) ? dateTime[0] : dateTime[1], "DD-MM-YYYY HH:mm"));
                            }} style={{
                                marginTop: 3,
                                marginBottom: 3,
                                cursor: 'pointer',
                                background: male ? cellsMaleColor: cellsFemaleColor,
                                width: percent == 100 ? '100%' : coloredWidth,
                                backgroundImage: isReservation == 'true' ? "radial-gradient(white 1px, transparent 0)" : "inherit",
                                backgroundSize: isReservation == 'true' ? "8px 8px" : 'inherit',
                                fontWeight: isReservation == 'true' ? 600 : 'inherit',
                                height: 25,
                                color: fontColor,
                                fontSize,
                                // Если это крайний день, то откругляем сосиску
                                borderBottomRightRadius: percent < 0 ? 8 : 0,
                                borderTopRightRadius: percent < 0 ? 8 : 0,
                                borderBottomLeftRadius: percent > 0 && percent < 100 ? 8 : 0,
                                borderTopLeftRadius: percent > 0 && percent < 100 ? 8 : 0,
                                // -----
                                // Если это крайний день справа в ячейке, то конец сосиски абсолютно цепляем к краю
                                position: percent > 0 && percent < 100 ? 'absolute' : 'inherit',
                                right: 0,
                                top: 0
                                // -----
                            }}>
                                <Flex justify="center" align="center">
                                        <Popover placement={'bottom'} title={`${fio}`} content={() => (<Flex vertical={true}>
                                            <div>{post} {filial}</div>
                                            <div>{datesRange}</div>
                                            <div>{note}</div>
                                        </Flex>)}>
                                            {Math.abs(percent) === 100 ? // Для обычных ячеек
                                                <div style={{position: 'absolute', width: columnWidth, top: 7, left: 0, height: 25}}>
                                                    <Flex vertical={false}>
                                                        {startCell && <div style={{position: "absolute", width: 100, zIndex: 100, height: 25}}>
                                                            <div style={{zIndex: 1000}}>{fio}</div>
                                                        </div>}
                                                    </Flex>
                                                </div>
                                                :
                                                <div style={{paddingTop: 4, width: '100%', height: 25}}>
                                                    <Flex vertical={false}>
                                                        {startCell &&
                                                            <div style={{position: "absolute", width: 100, zIndex: 100, height: 25}}>
                                                            <div>{fio}</div>
                                                        </div>}
                                                    </Flex>
                                                </div>
                                            }
                                        </Popover>
                                </Flex>
                            </div>
                        </Flex>)
                    }
                    else {  // Если ячейка с двумя жильцами

                        // Проверка если перевернуты жильцы в ячейке (запрос может достать не в том порядке) -> swap
                        let personLeft:any = "";
                        let personRight:any = "";
                        let personLeftFinishDate = dayjs(val.split('||')[0].split('#')[0].split('&')[1].split(" :: ")[1], "DD-MM-YYYY HH:mm");
                        let personRightFinishDate = dayjs(val.split('||')[1].split('#')[0].split('&')[1].split(" :: ")[0], "DD-MM-YYYY HH:mm");
                        if (personLeftFinishDate.isAfter(personRightFinishDate)){
                            personLeft = val.split('||')[1];
                            personRight = val.split('||')[0];
                        }
                        else {
                            personLeft = val.split('||')[0];
                            personRight = val.split('||')[1];
                        }
                        // -----

                        // Разбор данных по жильцу в левой ячейке
                        let fioPersonLeft = personLeft.split('#')[0].split('&')[0];
                        let personLeftDates = personLeft.split('#')[0].split('&')[1];
                        let personLeftMale = personLeft.split('#')[0].split('&')[2] == 'true';
                        let personLeftNote = personLeft.split('#')[0].split('&')[3] == 'null' ? "" : personLeft.split('#')[0].split('&')[3];
                        let personLeftPost = personLeft.split('#')[0].split('&')[4];
                        let personLeftFilial = personLeft.split('#')[0].split('&')[5] == 'emptyF' ? "" : personLeft.split('#')[0].split('&')[5];
                        let personLeftIsReservation = personLeft.split('#')[0].split('&')[6];
                        let personLeftPercent = Math.abs(personLeft.split('#')[1]);
                        let coloredLeftWidth = columnWidth * (personLeftPercent/100);
                        // -----

                        // Разбор данных по жильцу в левой ячейке
                        let fioPersonRight = personRight.split('#')[0].split('&')[0];
                        let startCell = !data.find(d => {
                            if (d.bedId == record.bedId){
                                let prevDay = dayjs(el, "DD-MM-YYYY").subtract(1, 'day').format("DD-MM-YYYY");
                                if (record[prevDay]) {
                                    if (record[prevDay].toLowerCase().indexOf(fioPersonRight.toLowerCase()) > -1) {
                                        return true;
                                    }
                                }
                            }
                            return false;
                        });
                        let personRightDates = personRight.split('#')[0].split('&')[1]
                        let personRightMale = personRight.split('#')[0].split('&')[2] == 'true';
                        let personRightNote = personRight.split('#')[0].split('&')[3] == 'null' ? "" : personRight.split('#')[0].split('&')[3];
                        let personRightPost = personRight.split('#')[0].split('&')[4];
                        let personRightFilial = personRight.split('#')[0].split('&')[5] == 'emptyF' ? "" : personRight.split('#')[0].split('&')[5];
                        let personRightIsReservation = personRight.split('#')[0].split('&')[6];
                        let personRightPercent = Math.abs(personRight.split('#')[1]);
                        let coloredRightWidth = columnWidth * (personRightPercent/100);
                        // -----

                        return (<Flex key={record.id} vertical={false} style={{height: 31, background: isWeekend ? cellBackgroundColor : 'inherit'}}>
                            <>
                                <div onClick={() => {
                                    setSelectedFlatId(record.sectionId);
                                    setSelectedDate(dayjs(personLeftDates.split(" :: ")[1].replace("12:00", "11:59"), "DD-MM-YYYY HH:mm"));
                                }}
                                    style={{
                                    marginTop: 3,
                                    marginBottom: 3,
                                    cursor: 'pointer',
                                    background: personLeftMale ? cellsMaleColor: cellsFemaleColor,
                                    backgroundImage: personLeftIsReservation == 'true' ? "radial-gradient(white 1px, transparent 0)" : "inherit",
                                    backgroundSize: personLeftIsReservation == 'true' ? "8px 8px" : 'inherit',
                                    fontWeight: personLeftIsReservation == 'true' ? 600 : 'inherit',
                                    height: 25,
                                    color: fontColor,
                                    fontSize,
                                    borderBottomRightRadius: 8,
                                    borderTopRightRadius: 8,
                                    width: coloredLeftWidth,
                                }}>
                                    <Flex justify="center" align="center">
                                            <Popover placement={'bottom'} title={`${fioPersonLeft}`} content={() => (<Flex vertical={true}>
                                                <div>{personLeftPost} {personLeftFilial}</div>
                                                <div>{personLeftDates}</div>
                                                <div>{personLeftNote}</div>
                                            </Flex>)}>
                                                <div style={{paddingTop: 4, width: fioPersonLeft.length*1.5 + 15, height: 25}}>
                                                </div>
                                            </Popover>
                                    </Flex>
                                </div>
                                <div style={{width: 3}}></div>
                                <div
                                    onClick={() => {
                                        setSelectedFlatId(record.sectionId);
                                        setSelectedDate(dayjs(personRightDates.split(" :: ")[0].replace("12:00", "12:01"), "DD-MM-YYYY HH:mm"));
                                    }}
                                    style={{
                                    marginTop: 3,
                                    marginBottom: 3,
                                    cursor: 'pointer',
                                    background: personRightMale ? cellsMaleColor: cellsFemaleColor, height: 25, color: fontColor, fontSize,
                                    backgroundImage: personRightIsReservation == 'true' ? "radial-gradient(white 1px, transparent 0)" : "inherit",
                                    backgroundSize: personRightIsReservation == 'true' ? "8px 8px" : 'inherit',
                                    fontWeight: personRightIsReservation == 'true' ? 600 : 'inherit',
                                    borderBottomLeftRadius: 8,
                                    borderTopLeftRadius: 8,
                                    width: coloredRightWidth,
                                    position: 'absolute', right: 0
                                }}>
                                    <Flex justify="center" align="center">
                                            <Popover placement={'bottom'} title={`${fioPersonRight}`} content={() => (<Flex vertical={true}>
                                                <div>{personRightPost} {personRightFilial}</div>
                                                <div>{personRightDates}</div>
                                                <div>{personRightNote}</div>
                                            </Flex>)}>
                                                <div style={{paddingTop: 4, width: Math.abs(personRightPercent) + addedPixel*(Math.abs(personRightPercent)/100), height: 25}}>
                                                    {startCell &&
                                                        <div style={{left: 0, position: "absolute", width: 100, zIndex: 100, height: 25}}>
                                                            <Flex vertical={false} align={'center'}>
                                                                {fioPersonRight}
                                                            </Flex>
                                                        </div>
                                                    }
                                                </div>
                                            </Popover>
                                    </Flex>
                                </div>
                            </>
                        </Flex>)
                    }
                }
                else if (mode)
                    return <div id={"$$$"+record.bedId.toString() + el} onClick={() => selectCellHandler(el, record)}
                                style={{cursor: 'pointer', width: "100%", height: 31, background: isWeekend ? cellBackgroundColor : 'inherit'}}>
                    </div>
                else return <div style={{cursor: 'pointer', width: "100%", height: 31, background: isWeekend ? cellBackgroundColor : 'inherit'}}>
                        </div>

            }
        })));
    }
    const searchGuestHandler = () => {
        if (searchInputRef) {
            setData((prev: any[]) => {
                return prev.filter((record: any) => {
                    if (JSON.stringify(record).toLowerCase().indexOf(searchInputRef.current.input.value.toLowerCase()) > 0) return true;
                });
            });
        }
    };
    const updateCurrentMonthHandler = (value: string) => {
         setCurrentMonth(value);
        switch (value) {
            case "Январь":
                props.setChessDateRange([dayjs('01-01-2025', 'DD-MM-YYYY'), dayjs('14-01-2025', 'DD-MM-YYYY')])
                break;
            case "Февраль":
                props.setChessDateRange([dayjs('01-02-2025', 'DD-MM-YYYY'), dayjs('14-02-2025', 'DD-MM-YYYY')])
                break;
            case "Март":
                props.setChessDateRange([dayjs('01-03-2025', 'DD-MM-YYYY'), dayjs('14-03-2025', 'DD-MM-YYYY')])
                break;
            case "Апрель":
                props.setChessDateRange([dayjs('01-04-2025', 'DD-MM-YYYY'), dayjs('14-04-2025', 'DD-MM-YYYY')])
                break;
            case "Май":
                props.setChessDateRange([dayjs('01-05-2025', 'DD-MM-YYYY'), dayjs('14-05-2025', 'DD-MM-YYYY')])
                break;
            case "Июнь":
                props.setChessDateRange([dayjs('01-06-2025', 'DD-MM-YYYY'), dayjs('14-06-2025', 'DD-MM-YYYY')])
                break;
            case "Июль":
                props.setChessDateRange([dayjs('01-07-2025', 'DD-MM-YYYY'), dayjs('14-07-2025', 'DD-MM-YYYY')])
                break;
            case "Август":
                props.setChessDateRange([dayjs('01-08-2025', 'DD-MM-YYYY'), dayjs('14-08-2025', 'DD-MM-YYYY')])
                break;
            case "Сентябрь":
                props.setChessDateRange([dayjs('01-09-2025', 'DD-MM-YYYY'), dayjs('14-09-2025', 'DD-MM-YYYY')])
                break;
            case "Октябрь":
                props.setChessDateRange([dayjs('01-10-2025', 'DD-MM-YYYY'), dayjs('14-10-2025', 'DD-MM-YYYY')])
                break;
            case "Ноябрь":
                props.setChessDateRange([dayjs('01-11-2025', 'DD-MM-YYYY'), dayjs('14-11-2025', 'DD-MM-YYYY')])
                break;
            case "Декабрь":
                props.setChessDateRange([dayjs('01-12-2025', 'DD-MM-YYYY'), dayjs('14-11-2025', 'DD-MM-YYYY')])
                break;
        }
    };
    const selectCellHandler = (el:string, record:any) => {
        let selectedCells = null;
        if (localStorage.getItem('selectedCells'))
            selectedCells = JSON.parse(localStorage.getItem('selectedCells'));
        let selectedCell: SelectedCellType = {
            recordId: `$$$${record.bedId}${el}`,
            bedId: record.bedId,
            date: el,
            filialId: record.filialId,
            hotelId: record.hotelId,
            roomId: record.room,
            sectionId: record.sectionId
        };
        if (selectedCells == null) {
            localStorage.setItem('selectedCells', `[${JSON.stringify(selectedCell)}]`);
            document.getElementById(`$$$${record.bedId}${el}`).classList.add('selectedCell');
        }
        else{
            if (selectedCells.find((el:SelectedCellType) => el.recordId == selectedCell.recordId)) { // Если нажали на туже ячейку
                document.getElementById(`$$$${record.bedId}${el}`).classList.remove('selectedCell');
                selectedCells = selectedCells.filter((el:SelectedCellType) => el.recordId != selectedCell.recordId);
                if (selectedCells.length == 0) localStorage.removeItem('selectedCells');
                else localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
            }
            else if (selectedCells[0].bedId != selectedCell.bedId) { // Выбрано другое место, нужно удалить предыдущие выделения
                [1,2,3,4].forEach(() => Array.prototype.forEach.call(document.getElementsByClassName('selectedCell'), function(el) {
                    el.classList.remove('selectedCell');
                }));
                document.getElementById(`$$$${record.bedId}${el}`).classList.add('selectedCell');
                localStorage.setItem('selectedCells', `[${JSON.stringify(selectedCell)}]`);
            } else {
                if (selectedCells.length == 1){ // Проверяем возможность заполнения расстояния между ячейками, если одна уже выбрана
                    let firstCell: SelectedCellType = dayjs(selectedCells[0].date, 'DD-MM-YYYY').isBefore(dayjs(selectedCell.date, 'DD-MM-YYYY')) ? selectedCells[0] : selectedCell;
                    let secondCell: SelectedCellType = dayjs(selectedCell.date, 'DD-MM-YYYY').isAfter(dayjs(selectedCells[0].date, 'DD-MM-YYYY')) ? selectedCell : selectedCells[0];
                    let firstDate: Dayjs = dayjs(firstCell.date, 'DD-MM-YYYY');
                    let secondDate: Dayjs = dayjs(secondCell.date, 'DD-MM-YYYY');
                    if (!selectedCells.find((c:SelectedCellType) => c.date == firstCell.date)){
                        selectedCells.push(firstCell);
                        document.getElementById(`$$$${firstCell.bedId}${firstCell.date}`).classList.add('selectedCell');
                    }
                    while (firstDate.isBefore(secondDate)) { // Проходим по диапазону дат, записываем их и выделяем
                        firstDate = firstDate.add(1, 'day');
                        selectedCells.push({...selectedCell, date: firstDate.format('DD-MM-YYYY')});
                        document.getElementById(`$$$${record.bedId}${firstDate.format('DD-MM-YYYY')}`).classList.add('selectedCell');
                    }
                    localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
                } else {
                    selectedCells.push(selectedCell);
                    document.getElementById(`$$$${record.bedId}${el}`).classList.add('selectedCell');
                    localStorage.setItem('selectedCells', JSON.stringify(selectedCells));
                }
            }
        }
    };
    const interactiveModeHandler = () => {
        setInteractiveMode(prev => !prev);
    };
    const addGuestHandler = () => {
        if (localStorage.getItem('selectedCells') == null){
            props.showWarningMsg('Вы не выбрали ни одного дня');
            return;
        }
        let selectedCells: SelectedCellType[] = JSON.parse(localStorage.getItem('selectedCells'));
        let sorted = selectedCells.sort((a,b) => dayjs(a.date, 'DD-MM-YYYY').diff(dayjs(b.date, 'DD-MM-YYYY')));
        let startCell = sorted[0];
        let finishCell = sorted[sorted.length-1];
        setFilialId(startCell.filialId);
        setHotelId(startCell.hotelId);
        setFlatId(startCell.sectionId);
        setRoomId(startCell.roomId);
        setBedId(startCell.bedId);
        setDateStart(dayjs(startCell.date, 'DD-MM-YYYY'));
        setDateFinish(dayjs(finishCell.date, 'DD-MM-YYYY'));
        setVisibleGuestModal(true);
    };
    const addReservationHandler = () => {
        if (localStorage.getItem('selectedCells') == null){
            props.showWarningMsg('Вы не выбрали ни одного дня');
            return;
        }
        let selectedCells: SelectedCellType[] = JSON.parse(localStorage.getItem('selectedCells'));
        let sorted = selectedCells.sort((a,b) => dayjs(a.date, 'DD-MM-YYYY').diff(dayjs(b.date, 'DD-MM-YYYY')));
        let startCell = sorted[0];
        let finishCell = sorted[sorted.length-1];
        setFilialId(startCell.filialId);
        setHotelId(startCell.hotelId);
        setFlatId(startCell.sectionId);
        setRoomId(startCell.roomId);
        setBedId(startCell.bedId);
        setDateStart(dayjs(startCell.date, 'DD-MM-YYYY'));
        setDateFinish(dayjs(finishCell.date, 'DD-MM-YYYY'));
        setVisibleReservationModal(true);
    };
    const refreshHandler = () => {
        if (props.hotelId) getAllFlats({hotelId: props.hotelId, dateStart: props.chessDateRange[0].format("DD-MM-YYYY"), dateFinish: props.chessDateRange[1].format("DD-MM-YYYY")});
    };
    // -----

    // Effects
    useEffect(() => {
        localStorage.removeItem('selectedCells');
        if (props.hotelId) getAllFlats({hotelId: props.hotelId, dateStart: props.chessDateRange[0].format("DD-MM-YYYY"), dateFinish: props.chessDateRange[1].format("DD-MM-YYYY")});
    }, []);
    useEffect(() => {
        if (flatsData)
            setData(flatsData);
    }, [flatsData]);
    useEffect(() => {
        if (props.chessDateRange && data && columns && props.hotelId) {
            getAllFlats({hotelId: props.hotelId, dateStart: props.chessDateRange[0].format("DD-MM-YYYY"), dateFinish: props.chessDateRange[1].format("DD-MM-YYYY")});
        }
        setData(null);
    }, [props.chessDateRange]);
    useEffect(() => {
        if (data)
            setColumns(settingColumnsHandler(false));
    }, [data]);
    useEffect(() => {
        if (!interactiveMode){
            if (localStorage.getItem('selectedCells')) localStorage.removeItem('selectedCells');
            [1,2,3,4].forEach(() => Array.prototype.forEach.call(document.getElementsByClassName('selectedCell'), function(el) {
                el.classList.remove('selectedCell');
            }));
        }
        if (data) setColumns(settingColumnsHandler(interactiveMode));
    }, [interactiveMode]);
    useEffect(() => {
        if (!visibleGuestModal) setInteractiveMode(false);
    }, [visibleGuestModal]);
    useEffect(() => {
        if (!visibleReservationModal) setInteractiveMode(false);
    }, [visibleReservationModal]);
    // -----

    return (
        <>
            <CellsViewSettingsModal visible={visibleCellsViewSettings} setVisible={setVisibleCellsViewSettings}/>
            {visibleGuestModal &&
                <GuestModal
                    dateStart={dateStart}
                    dateFinish={dateFinish}
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
            {visibleReservationModal &&
                <ReservationModal
                    dateStart={dateStart}
                    dateFinish={dateFinish}
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
                        getAllFlats({hotelId: props.hotelId, dateStart: props.chessDateRange[0].format("DD-MM-YYYY"), dateFinish: props.chessDateRange[1].format("DD-MM-YYYY")});
                }}/>}
            {(selectedFlatId && selectedDate && data) &&
                <FlatModal hotelId={props.hotelId} date={selectedDate} flatId={selectedFlatId} visible={true} setVisible={() => {
                    setSelectedFlatId(null);
                    setSelectedDate(null);
                }}/>
            }
            <Flex vertical={false} justify={'space-between'} style={{width: window.innerWidth}}>
                <Flex>
                    <Button icon={<AppstoreAddOutlined />} type={interactiveMode ? "primary" : "default"} style={{marginLeft: 10, marginRight: 5}} onClick={interactiveModeHandler}>Интерактивное заселение</Button>
                    {interactiveMode && <Button icon={<UserAddOutlined />} onClick={addGuestHandler}>Заселить</Button>}
                    {(interactiveMode && isFilialUEZS) && <Button icon={<TagOutlined />} style={{marginLeft: 5}} onClick={addReservationHandler}>Забронировать</Button>}
                </Flex>
                <Flex vertical={false}>
                    {/*//@ts-ignore*/}
                    <RangePicker style={{width: 285, marginRight: 5}} format={"DD-MM-YYYY"} value={props.chessDateRange} onChange={(e) => {
                        props.setChessDateRange(e as any)
                    }}/>
                    <Button onClick={refreshHandler}>
                        Обновить
                    </Button>
                    <Search ref={searchInputRef} style={{width: 285, marginLeft: 5}} size={'middle'}
                            placeholder={'Общий поиск комнаты жильца'}
                            onSearch={searchGuestHandler}
                            allowClear={true}
                            onChange={(e) => {
                                if (e.target.value == ""){
                                    setData(flatsData ?? []);
                                    if (searchInputRef) searchInputRef.current.input.value = "";
                                }
                            }}
                    />
                </Flex>
                <Flex style={{width: 232}} justify={'flex-end'}>
                    <Button icon={<SettingOutlined />} style={{marginRight: 10}} onClick={() => setVisibleCellsViewSettings(true)}>Настройки</Button>
                </Flex>
            </Flex>
            <Segmented<string>
                value={currentMonth}
                block={true}
                style={{width: window.innerWidth, margin: 0}}
                options={['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']}
                onChange={updateCurrentMonthHandler}
            />
            <MemoizedChess columns={columns} data={data}/>
        </>
    )
};
