import '../../index.scss';
import {Button, DatePicker, Flex, Popconfirm, Popover, Segmented, Skeleton, Table} from 'antd';
import dayjs, {Dayjs} from 'dayjs';
import React, {useEffect, useRef, useState} from 'react';
import {flatAPI} from "../../service/FlatService";
import {FlatModal} from "./FlatModal";
import Search from "antd/lib/input/Search";
import {GuestModal} from "../dict/GuestModal";
import {CellsViewSettingsModal} from "./CellsViewSettingsModal";
import {AppstoreAddOutlined, SettingOutlined, UserAddOutlined} from "@ant-design/icons";
//@ts-ignore
import Male from "../../assets/maleSVG.svg";
//@ts-ignore
import Female from "../../assets/femaleSVG.svg";

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

const ChessComponent = ({columns, data}) => {
    return (<Table<DataType>
        style={{width: window.innerWidth}}
        columns={columns}
        dataSource={data}
        bordered={true}
        pagination={{
            defaultPageSize: 400//isFilialUEZS ? 100 : 20,
        }}
        scroll={{x: window.innerWidth, y: window.innerHeight - 330}}
    />)
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

const MemoizedChess = React.memo(ChessComponent);

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
    const [isFilialUEZS] = useState(() => props.hotelId === '182' || props.hotelId === '183' || props.hotelId === '184' || props.hotelId === '327');
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [visibleCellsViewSettings, setVisibleCellsViewSettings] = useState(false);
    const [currentMonth, setCurrentMonth] = useState<string>(() => {
        switch (props.selectedDate.month()) {
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
    });
    const [cellsColor] = useState(() => {
        if (localStorage.getItem("cellsColor")) return localStorage.getItem('cellsColor');
        return "#75a5f2";
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
    // -----

    // Web requests
    const [getAllFlats, {
        data: flatsData,
        isLoading: isFlatsLoading
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
                        let datesRange = val.split('#')[0].split('&')[1];
                        let dateTime: string[] = val.split('#')[0].split('&')[1].split(' :: ');
                        let male = val.split('#')[0].split('&')[2];
                        let note = val.split('#')[0].split('&')[3] == 'null' ? "" : val.split('#')[0].split('&')[3];
                        let post = val.split('#')[0].split('&')[4];
                        let filial = val.split('#')[0].split('&')[5] == 'emptyF' ? "" : val.split('#')[0].split('&')[5];
                        let coloredWidth = Math.abs(percent) + addedPixel == columnWidth ? '100%' : Math.abs(percent) + addedPixel*(Math.abs(percent)/100);
                        return (<Flex key={record.id} vertical={false} style={{background: isWeekend ? cellBackgroundColor : 'inherit', height: 31}}>
                            <div style={{
                                marginTop: 3,
                                marginBottom: 3,
                                cursor: 'pointer',
                                background: cellsColor,
                                width: coloredWidth,
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
                                    <Popconfirm onConfirm={() => {
                                        setSelectedFlatId(record.sectionId);
                                        if (percent == 100)
                                            setSelectedDate(dayjs(`${el} 12:00`, "DD-MM-YYYY HH:mm"));
                                        else
                                            setSelectedDate(dayjs((percent > 0 && percent < 100) ? dateTime[0] : dateTime[1], "DD-MM-YYYY HH:mm"));
                                    }} cancelText={"Отмена"} okText={"Открыть"}
                                                title={`${fio} ${post} ${filial}`}
                                                description={`Даты проживания ${val.split('#')[0].split('&')[1]}`}>
                                        <Popover placement={'bottom'} title={`${fio}`} content={() => (<Flex vertical={true}>
                                            <div>{post} {filial}</div>
                                            <div>{datesRange}</div>
                                            <div>{note}</div>
                                        </Flex>)}>
                                            {Math.abs(percent) === 100 ?
                                                <div style={{paddingTop: 4, width: '100%', height: 25}}></div>
                                                :
                                                <div style={{position: 'absolute', width: columnWidth, top: 7, left: -((columnWidth - (coloredWidth as unknown as number)))}}>
                                                    {percent < 0 ?
                                                        <Flex vertical={false} align={'start'} justify={'center'}>
                                                            {male == 'true' ?
                                                                <img style={{marginRight: 3}} width={15} height={15} src={Male} alt={'man'}/>
                                                                :
                                                                <img style={{marginRight: 3}} width={15} height={15} src={Female} alt={'woman'}/>
                                                            }
                                                            {fio}
                                                        </Flex>
                                                        :
                                                        <div style={{position: 'absolute', right:0, width: coloredWidth, height: 25}}/>
                                                    }
                                                </div>
                                            }
                                        </Popover>
                                    </Popconfirm>
                                </Flex>
                            </div>
                        </Flex>)
                    }
                    else {  // Если ячейка с двумя жильцами

                        // Разбор данных по жильцу в левой ячейке
                        let personLeft = val.split('||')[0];
                        let fioPersonLeft = personLeft.split('#')[0].split('&')[0];
                        let personLeftDates = personLeft.split('#')[0].split('&')[1];
                        let personLeftMale = personLeft.split('#')[0].split('&')[2];
                        let personLeftNote = personLeft.split('#')[0].split('&')[3] == 'null' ? "" : personLeft.split('#')[0].split('&')[3];
                        let personLeftPost = personLeft.split('#')[0].split('&')[4];
                        let personLeftFilial = personLeft.split('#')[0].split('&')[5] == 'emptyF' ? "" : personLeft.split('#')[0].split('&')[5];
                        let personLeftPercent = Math.abs(personLeft.split('#')[1]);
                        let coloredLeftWidth = Math.abs(personLeftPercent) + addedPixel*(Math.abs(personLeftPercent)/100);
                        // -----

                        // Разбор данных по жильцу в левой ячейке
                        let personRight = val.split('||')[1];
                        let fioPersonRight = val.split('||')[1].split('#')[0].split('&')[0];
                        let personRightDates = personRight.split('#')[0].split('&')[1]
                        let personRightNote = personRight.split('#')[0].split('&')[3] == 'null' ? "" : personRight.split('#')[0].split('&')[3];
                        let personRightPost = personRight.split('#')[0].split('&')[4];
                        let personRightFilial = personRight.split('#')[0].split('&')[5] == 'emptyF' ? "" : personRight.split('#')[0].split('&')[5];
                        let personRightPercent = Math.abs(personRight.split('#')[1]);
                        let coloredRightWidth = Math.abs(personRightPercent) + addedPixel*(Math.abs(personRightPercent)/100);
                        // -----

                        return (<Flex key={record.id} vertical={false} style={{height: 31, background: isWeekend ? cellBackgroundColor : 'inherit'}}>
                            <>
                                <div style={{
                                    marginTop: 3,
                                    marginBottom: 3,
                                    cursor: 'pointer',
                                    background: cellsColor,
                                    height: 25,
                                    color: fontColor,
                                    fontSize,
                                    borderBottomRightRadius: 8,
                                    borderTopRightRadius: 8,
                                    width: coloredLeftWidth,
                                }}>
                                    <Flex justify="center" align="center">
                                        <Popconfirm onConfirm={() => {
                                            setSelectedFlatId(record.sectionId);
                                            setSelectedDate(dayjs(personLeftDates.split(" - ")[0], "DD-MM-YYYY HH:mm"));
                                        }} cancelText={"Отмена"} okText={"Открыть"}
                                                    title={`${fioPersonLeft} ${personLeftPost} ${personLeftFilial}`}
                                                    description={`Даты проживания ${personLeftDates}`}>
                                            <Popover placement={'bottom'} title={`${fioPersonLeft}`} content={() => (<Flex vertical={true}>
                                                <div>{personLeftPost} {personLeftFilial}</div>
                                                <div>{personLeftDates}</div>
                                                <div>{personLeftNote}</div>
                                            </Flex>)}>
                                                <div style={{paddingTop: 4, width: fioPersonLeft.length*1.5 + 15, height: 25}}>
                                                    <Flex style={{position: "absolute", top: 6, left: -((columnWidth - (coloredLeftWidth as unknown as number))), height: 25}}
                                                          vertical={false} align={'start'} justify={'center'}>
                                                        {personLeftMale == 'true' ?
                                                            <img style={{marginRight: 3}} width={15} height={15} src={Male} alt={'man'}/>
                                                            :
                                                            <img style={{marginRight: 3}} width={15} height={15} src={Female} alt={'woman'}/>
                                                        }
                                                        {fioPersonLeft}
                                                    </Flex>
                                                </div>
                                            </Popover>
                                        </Popconfirm>
                                    </Flex>
                                </div>
                                <div style={{width: 3}}></div>
                                <div style={{
                                    marginTop: 3,
                                    marginBottom: 3,
                                    cursor: 'pointer', background: cellsColor, height: 25, color: fontColor, fontSize,
                                    borderBottomLeftRadius: 8,
                                    borderTopLeftRadius: 8,
                                    width: coloredRightWidth,
                                    position: 'absolute', right: 0
                                }}>
                                    <Flex justify="center" align="center">
                                        <Popconfirm onConfirm={() => {
                                            setSelectedFlatId(record.sectionId);
                                            setSelectedDate(dayjs(personRightDates.split(" - ")[0], "DD-MM-YYYY HH:mm"));
                                        }} cancelText={"Отмена"} okText={"Открыть"}
                                                    title={`${fioPersonRight} ${personRightPost} ${personRightFilial}`}
                                                    description={`Даты проживания ${personRightDates}`}>
                                            <Popover placement={'bottom'} title={`${fioPersonRight}`} content={() => (<Flex vertical={true}>
                                                <div>{personRightPost} {personRightFilial}</div>
                                                <div>{personRightDates}</div>
                                                <div>{personRightNote}</div>
                                            </Flex>)}>
                                                <div style={{paddingTop: 6, width: Math.abs(personRightPercent) + addedPixel*(Math.abs(personRightPercent)/100), height: 25}}></div>
                                            </Popover>
                                        </Popconfirm>
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
                else return <Popconfirm title={'Добавить запись о проживании?'} okText={"Да"} cancelText={"Отмена"} onConfirm={() => {
                        setFilialId(record.filialId);
                        setHotelId(record.hotelId);
                        setFlatId(record.sectionId);
                        setRoomId(record.room);
                        setBedId(record.bedId);
                        setVisibleGuestModal(true);
                    }}>
                        <div style={{cursor: 'pointer', width: "100%", height: 31, background: isWeekend ? cellBackgroundColor : 'inherit'}}>
                        </div>
                    </Popconfirm>
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
                props.setChessDateRange([dayjs('01-01-2025', 'DD-MM-YYYY'), dayjs('31-01-2025', 'DD-MM-YYYY')])
                break;
            case "Февраль":
                props.setChessDateRange([dayjs('01-02-2025', 'DD-MM-YYYY'), dayjs('28-02-2025', 'DD-MM-YYYY')])
                break;
            case "Март":
                props.setChessDateRange([dayjs('01-03-2025', 'DD-MM-YYYY'), dayjs('31-03-2025', 'DD-MM-YYYY')])
                break;
            case "Апрель":
                props.setChessDateRange([dayjs('01-04-2025', 'DD-MM-YYYY'), dayjs('30-04-2025', 'DD-MM-YYYY')])
                break;
            case "Май":
                props.setChessDateRange([dayjs('01-05-2025', 'DD-MM-YYYY'), dayjs('31-05-2025', 'DD-MM-YYYY')])
                break;
            case "Июнь":
                props.setChessDateRange([dayjs('01-06-2025', 'DD-MM-YYYY'), dayjs('30-06-2025', 'DD-MM-YYYY')])
                break;
            case "Июль":
                props.setChessDateRange([dayjs('01-07-2025', 'DD-MM-YYYY'), dayjs('31-07-2025', 'DD-MM-YYYY')])
                break;
            case "Август":
                props.setChessDateRange([dayjs('01-08-2025', 'DD-MM-YYYY'), dayjs('31-08-2025', 'DD-MM-YYYY')])
                break;
            case "Сентябрь":
                props.setChessDateRange([dayjs('01-09-2025', 'DD-MM-YYYY'), dayjs('30-09-2025', 'DD-MM-YYYY')])
                break;
            case "Октябрь":
                props.setChessDateRange([dayjs('01-10-2025', 'DD-MM-YYYY'), dayjs('30-10-2025', 'DD-MM-YYYY')])
                break;
            case "Ноябрь":
                props.setChessDateRange([dayjs('01-11-2025', 'DD-MM-YYYY'), dayjs('30-11-2025', 'DD-MM-YYYY')])
                break;
            case "Декабрь":
                props.setChessDateRange([dayjs('01-12-2025', 'DD-MM-YYYY'), dayjs('31-11-2025', 'DD-MM-YYYY')])
                break;
        }
    };
    const selectCellHandler = (el:string, record:any) => {
        console.log(record)
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
        setInteractiveMode(false);
        setFilialId(startCell.filialId);
        setHotelId(startCell.hotelId);
        setFlatId(startCell.sectionId);
        setRoomId(startCell.roomId);
        setBedId(startCell.bedId);
        setDateStart(dayjs(startCell.date, 'DD-MM-YYYY'));
        setDateFinish(dayjs(finishCell.date, 'DD-MM-YYYY'));
        setVisibleGuestModal(true);
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
                            return (<div style={{cursor: 'pointer', background: cellsColor, width: 80, height: 25, padding: 5}}>
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
            setColumns(settingColumnsHandler(false));
        }
    }, [data]);
    useEffect(() => {
        if (!interactiveMode){
            if (localStorage.getItem('selectedCells')) localStorage.removeItem('selectedCells');
            [1,2,3,4].forEach(() => Array.prototype.forEach.call(document.getElementsByClassName('selectedCell'), function(el) {
                el.classList.remove('selectedCell');
            }));
        }
        if (data)
            setColumns(settingColumnsHandler(interactiveMode));
    }, [interactiveMode]);
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
            {(selectedFlatId && selectedDate && data) &&
                <FlatModal date={selectedDate} flatId={selectedFlatId} visible={true} setVisible={() => {
                    setSelectedFlatId(null);
                    setSelectedDate(null);
                }}/>
            }
            <Flex vertical={false} justify={'space-between'} style={{width: window.innerWidth}}>
                <Flex>
                    <Button icon={<AppstoreAddOutlined />} type={interactiveMode ? "primary" : "default"} style={{marginLeft: 10, marginRight: 5}} onClick={interactiveModeHandler}>Интерактивное заселение</Button>
                    {interactiveMode && <Button icon={<UserAddOutlined />} onClick={addGuestHandler}>Добавить</Button>}
                </Flex>
                <Flex vertical={false}>
                    {/*//@ts-ignore*/}
                    <RangePicker style={{marginRight: 15, width: 285}} format={"DD-MM-YYYY"} value={props.chessDateRange} onChange={(e) => {
                        props.setChessDateRange(e as any)
                    }}/>
                    <Flex align={'center'} vertical={false}>
                        <Search ref={searchInputRef} style={{width: 300}} size={'middle'}
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
                </Flex>
                <Button icon={<SettingOutlined />} style={{marginRight: 10}} onClick={() => setVisibleCellsViewSettings(true)}>Настройки</Button>
            </Flex>
            <Segmented<string>
                value={currentMonth}
                block={true}
                style={{width: window.innerWidth, margin: 0}}
                options={['Январь', 'Февраль', 'Март', 'Аперль', 'Май', 'Июнь', 'Июль', 'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь']}
                onChange={updateCurrentMonthHandler}
            />
            {(data && columns && !isFlatsLoading) ?
                <MemoizedChess data={data} columns={columns} /> :
                <Skeleton active={true} style={{width: window.innerWidth}}/>
            }
        </>
    )
};
