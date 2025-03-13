import React, {useEffect, useState} from 'react';
import {Alert, Button, Checkbox, DatePicker, Flex, Input, InputNumber, message, Modal, Select, TimePicker} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {hotelAPI} from "../../service/HotelService";
import {HotelModel} from "../../model/HotelModel";
import {flatAPI} from "../../service/FlatService";
import {FlatModel} from "../../model/FlatModel";
import {guestAPI} from "../../service/GuestService";
import {RoomModel} from "../../model/RoomModel";
import {roomAPI} from "../../service/RoomService";
import {historyAPI} from "../../service/HistoryService";
import {HistoryModal} from "./HistoryModal";
import {HistoryOutlined} from "@ant-design/icons";
import {BedModel} from "../../model/BedModel";
import {LabelOptionRender} from "../LabelOptionRender";
import {SelectOptionRender} from "../SelectOptionRender";
import {ReservationModel} from "../../model/ReservationModel";
import {reservationAPI} from "../../service/ReservationService";
import {eventAPI} from "../../service/EventService";
import {EventModel} from "../../model/EventModel";
import {GuestModel} from "../../model/GuestModel";

type ModalProps = {
    // Параметры для вызова из шахматки
    filialId?: number,
    hotelId?: number,
    flatId?: number,
    roomId?: number,
    bedId?: number;
    room?: RoomModel;
    dateStart?: Dayjs,
    dateFinish?: Dayjs,
    // -----
    semiAutoParams?: ReservationModel,
    selectedReservation: ReservationModel | null,
    setSelectedReservation?: Function,
    visible: boolean,
    setVisible: Function,
    refresh: Function,
}

export const ReservationModal = (props: ModalProps) => {

    // States
    const [messageApi, messageContextHolder] = message.useMessage(); // Контекст для всплывающих уведомлений
    const [findByFioMode, setFindByFioMode] = useState(false); // Поиск данных через ФИО
    const [fio, setFio] = useState<string | null>(null);  // ФИО для поиска данных
    const [tabnum, setTabnum] = useState<number | null>(null);  // Табельный номер
    const [lastname, setLastname] = useState(""); // Фамилия
    const [firstname, setFirstname] = useState(""); // Имя
    const [secondname, setSecondname] = useState(""); // Отчество
    const [male, setMale] = useState<boolean | null>(null); // Пол ДА - мужской, НЕТ - женский
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);  // ИД выбранного мероприятия
    const [selectedFromFilialId, setSelectedFromFilialId] = useState<number | null>(null); // ИД филиала отправителя заявки
    const [dateStart, setDateStart] = useState<Dayjs | null>(() => {
        if (props.selectedReservation?.dateStart) return dayjs(props.selectedReservation.dateStart, 'DD-MM-YYYY');
        else return null;
    }); // Дата заселения
    const [timeStart, setTimeStart] = useState<Dayjs>(() => {
        if (props.selectedReservation?.dateStart) return dayjs(props.selectedReservation.dateStart.split(" ")[1], 'HH:mm');
        else return dayjs('12:00', 'HH:mm');
    }); // Время заселения
    const [dateFinish, setDateFinish] = useState<Dayjs | null>(() => {
        if (props.selectedReservation?.dateFinish) return dayjs(props.selectedReservation.dateFinish, 'DD-MM-YYYY');
        else return null;
    }); // Дата выселения
    const [timeFinish, setTimeFinish] = useState<Dayjs>(() => {
        if (props.selectedReservation?.dateFinish) return dayjs(props.selectedReservation.dateFinish.split(" ")[1], 'HH:mm');
        else return dayjs('12:00', 'HH:mm');
    }); // Время выселения
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null); // ИД выбранного филиала
    const [filials, setFilials] = useState<FilialModel[]>([]); // Перечень доступных для выбора филиалов
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null); // ИД выбранного общежития
    const [hotels, setHotels] = useState<HotelModel[]>([]); // Перечень достпных для выбора отелей
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null); // ИД выбранной секции
    const [flats, setFlats] = useState<FlatModel[]>([]); // Перечень доступных для выбора секций
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null); // ИД выбранной комнаты
    const [rooms, setRooms] = useState<RoomModel[]>([]); // Перечень доступных для выбора комнат
    const [selectedBedId, setSelectedBedId] = useState<number | null>(null); // ИД выбранного места (койко-места)
    const [beds, setBeds] = useState<BedModel[]>([]); // Перечень доступных для выбора мест
    const [note, setNote] = useState("");
    const [visibleHistoryModal, setVisibleHistoryModal] = useState(false); // Видимость модального окна и историей изменений карточки
    // -----

    // Web requests
    const [getAllFilials, {
        data: filialsFromRequest,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation(); // Поулчение всех филиалов
    const [getAllHotels, {
        data: hotelsFromRequest,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation(); // Получение отелей по ИД филиала
    const [getAllFlats, {
        data: flatsFromRequest,
        isLoading: isFlatsLoading
    }] = flatAPI.useGetAllSimpleMutation(); // Получение секций по ИД отеля
    const [getAllRooms, {
        data: roomsFromRequest,
        isLoading: isRoomsLoading
    }] = roomAPI.useGetAllMutation(); // Получение комнат по ИД секции
    const [getAllBeds, {
        data: bedsFromRequest,
        isLoading: isBedsLoading
    }] = roomAPI.useGetAllBedsMutation(); // Получение койко-мест по ИД комнаты
    const [getFioByTabnum, {
        data: fioByTabnum,
        isLoading: isGetFioByTabnumLoading
    }] = guestAPI.useGetFioByTabnumMutation(); // Получение данных о жильце через табельный номер (ФИО + пол)
    const [getTabnumByFio, {
        data: tabnumByFio,
        isLoading: isGetTabnumByFioLoading
    }] = guestAPI.useGetTabnumByFioMutation(); // Получение данных о жильце через табельный номер (ФИО + пол)
    const [updateReservation, {
        data: updatedReservation,
        isLoading: isUpdateReservationLoading
    }] = reservationAPI.useUpdateMutation(); // Запрос на обновление записи о проживании
    const [getGuestHistory, {
        data: history,
    }] = historyAPI.useGetGuestHistoryMutation(); // Запрос на получение истории изменения карточки проживания по ИД гостя
    const [getAllEvents, {
        data: events,
    }] = eventAPI.useGetAllMutation(); // Получение списка мероприятий
    // -----

    // Effects
    useEffect(() => {
        getAllFilials();
        getAllEvents();

        // Заполнение параметрами переданным из шахматки
        if (props.filialId && props.hotelId && props.flatId && props.roomId && props.bedId) {
            setSelectedFilialId(parseInt(props.filialId.toString()));
            setSelectedHotelId(parseInt(props.hotelId.toString()));
            setSelectedFlatId(parseInt(props.flatId.toString()));
            setSelectedRoomId(parseInt(props.roomId.toString()));
            setSelectedBedId(parseInt(props.bedId.toString()));
            setDateStart(props?.dateStart);
            setDateFinish(props?.dateFinish);
        }
        // -----

        // Заполнение парамаетрами из массового заполнения
        if (props.semiAutoParams){
            if (props.semiAutoParams.tabnum) {
                setTabnum(props.semiAutoParams.tabnum);
                getFioByTabnum(props.semiAutoParams.tabnum);
            }
            if (props.semiAutoParams.dateStart) {
                setDateStart(dayjs(props.semiAutoParams.dateStart, 'DD-MM-YYYY'));
                setTimeStart(dayjs(props.semiAutoParams.dateStart.split(" ")[1], 'HH:mm'));
            }
            if (props.semiAutoParams.dateFinish) {
                setDateFinish(dayjs(props.semiAutoParams.dateFinish, 'DD-MM-YYYY'));
                setTimeFinish(dayjs(props.semiAutoParams.dateFinish.split(" ")[1], 'HH:mm'));
            }
            setSelectedEventId(props.semiAutoParams.event?.id);
            setSelectedFromFilialId(props.semiAutoParams.fromFilial?.id);
            // Поля совпадают, но мне лень переделывать их под ReservationModel
            let tmp: GuestModel = props.semiAutoParams as unknown as GuestModel;
            setSelectedFilialId(tmp.filialId);
            setSelectedHotelId(tmp.hotelId);
            setSelectedFlatId(tmp.flatId);
            setSelectedRoomId(tmp.roomId);
            setSelectedBedId(tmp.bedId);
            // -----
        }
        // -----
    }, []);
    useEffect(() => {
        if (props.room) {
            setSelectedFilialId(props.room.filialId);
            setSelectedHotelId(props.room.hotelId);
            setSelectedFlatId(props.room.flatId);
            setSelectedRoomId(props.room.id);
            setSelectedBedId(props.bedId);
        }
    }, [props.room]);
    useEffect(() => {
        if (fioByTabnum) {
            setFirstname(fioByTabnum.firstname);
            setLastname(fioByTabnum.lastname);
            setSecondname(fioByTabnum.secondName);
            setMale(fioByTabnum.male);
        }
    }, [fioByTabnum]);
    useEffect(() => {
        if (tabnumByFio) {
            setTabnum(tabnumByFio.tabnum);
            setFirstname(tabnumByFio.firstname);
            setLastname(tabnumByFio.lastname);
            setSecondname(tabnumByFio.secondName);
            setMale(tabnumByFio.male);
        }
    }, [tabnumByFio]);
    useEffect(() => {
        if (props.selectedReservation) {
            getGuestHistory(props.selectedReservation.id);
            getFioByTabnum(props.selectedReservation.tabnum);
            setLastname(props.selectedReservation.lastname);
            setFirstname(props.selectedReservation.firstname);
            setSecondname(props.selectedReservation.secondname);
            setMale(props.selectedReservation.male);
            setSelectedFilialId(props.selectedReservation.bed.room.flat.hotel.filial.id);
            setSelectedHotelId(props.selectedReservation.bed.room.flat.hotel.id);
            setSelectedFlatId(props.selectedReservation.bed.room.flat.id);
            setSelectedRoomId(props.selectedReservation.bed.room.id);
            setSelectedBedId(props.selectedReservation.bed.id);
            setSelectedEventId(props.selectedReservation.event.id);
            setSelectedFromFilialId(props.selectedReservation.fromFilial.id);
            getAllHotels({filialId: props.selectedReservation.bed.room.flat.hotel.filial.id.toString()});
            getAllFlats({hotelId: props.selectedReservation.bed.room.flat.hotel.id.toString(), dateStart: props.selectedReservation.dateStart, dateFinish: props.selectedReservation.dateFinish});
            getAllRooms({flatId: props.selectedReservation.bed.room.flat.id, dateStart: props.selectedReservation.dateStart, dateFinish: props.selectedReservation.dateFinish});
            getAllBeds({roomId: props.selectedReservation.bed.room.id, dateStart: props.selectedReservation.dateStart, dateFinish: props.selectedReservation.dateFinish});
            setTabnum(props.selectedReservation.tabnum);
            setNote(props.selectedReservation.note);
        }
    }, [props.selectedReservation]);
    useEffect(() => {
        if (selectedFilialId)
            getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedHotelId)
                getAllFlats({hotelId: selectedHotelId.toString(),
                dateStart: dateStart == null ? null : `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: dateFinish == null ? null : `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
    }, [selectedHotelId]);
    useEffect(() => {
        if (selectedFlatId)
            getAllRooms({flatId: selectedFlatId,
                dateStart: dateStart == null ? null : `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: dateFinish == null ? null : `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
    }, [selectedFlatId]);
    useEffect(() => {
        if (selectedRoomId)
            getAllBeds({roomId: selectedRoomId,
                dateStart: dateStart == null ? null : `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: dateFinish == null ? null : `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
    }, [selectedRoomId]);
    useEffect(() => {
        if (dateStart && dateFinish && selectedHotelId && selectedFlatId && selectedRoomId){
            getAllFlats({hotelId: selectedHotelId.toString(),
                dateStart: `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
            getAllRooms({flatId: selectedFlatId,
                dateStart: `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
            getAllBeds({roomId: selectedRoomId,
                dateStart: `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
        }
    }, [dateStart, dateFinish, selectedHotelId, selectedFlatId, selectedRoomId])
    useEffect(() => {
        if (filialsFromRequest) setFilials(filialsFromRequest);
    }, [filialsFromRequest]);
    useEffect(() => {
        if (hotelsFromRequest) setHotels(hotelsFromRequest);
    }, [hotelsFromRequest]);
    useEffect(() => {
        if (flatsFromRequest) setFlats(flatsFromRequest);
    }, [flatsFromRequest]);
    useEffect(() => {
        if (roomsFromRequest) setRooms(roomsFromRequest);
    }, [roomsFromRequest]);
    useEffect(() => {
        if (bedsFromRequest) setBeds(bedsFromRequest);
    }, [bedsFromRequest]);
    useEffect(() => {
        if (updatedReservation) {
            if (!updatedReservation.error) {
                props.setVisible(false);
                if (props.setSelectedReservation) props.setSelectedReservation(null);
                if (props.semiAutoParams){
                    props.refresh(updatedReservation);
                } else props.refresh();
            }
        }
    }, [updatedReservation]);
    // -----

    // Useful utils
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Handlers
    const selectHotelHandler = (id: number | undefined = undefined) => {
        setSelectedFlatId(null);
        setFlats([]);
        setRooms([]);
        setBeds([]);
        setSelectedRoomId(null);
        setSelectedBedId(null);
        if (id !== undefined) setSelectedHotelId(id);
        else setSelectedHotelId(null);
    };
    const selectFlatHandler = (id: number | undefined = undefined) => {
        setSelectedRoomId(null);
        setSelectedBedId(null);
        setRooms([]);
        setBeds([]);
        if (id !== undefined) setSelectedFlatId(id);
        else setSelectedFlatId(null);
    };
    const selectRoomHandler = (id: number | undefined = undefined) => {
        setSelectedBedId(null);
        setBeds([]);
        if (id !== undefined) setSelectedRoomId(id);
        else setSelectedRoomId(null);
    };
    const selectBedHandler = (id: number | undefined = undefined) => {
        if (id !== undefined) setSelectedBedId(id);
        else setSelectedBedId(null);
    };

    const confirmHandler = () => {
        if (dateStart && dateFinish && selectedFlatId && selectedRoomId && male !== null && selectedEventId && selectedFromFilialId) {
            if (dateStart.isAfter(dateFinish)) return;
            let ds = `${dateStart.format("DD-MM-YYYY")} ${timeStart.format("HH:mm")}`;
            let df = `${dateFinish.format("DD-MM-YYYY")} ${timeFinish.format("HH:mm")}`;
            if (ds.includes("00:00")) ds = ds.replace("00:00", "12:00");
            if (df.includes("00:00")) df = df.replace("00:00", "12:00");
            let event:EventModel|undefined = events?.find((e:EventModel) => e.id == selectedEventId);
            let fromFilial:FilialModel|undefined = filials?.find((f:FilialModel) => f.id == selectedFromFilialId);
            if (event && fromFilial) {
                let reservation: ReservationModel = {
                    id: null,
                    firstname,
                    lastname,
                    secondname,
                    male,
                    bed: {id: selectedBedId, name: ''},
                    dateStart: ds,
                    dateFinish: df,
                    event,
                    fromFilial,
                    guest: null,
                    note,
                    status: {id: 1, name: ''},
                    tabnum
                }
                if (props.selectedReservation)
                    updateReservation({
                        ...reservation,
                        id: props.selectedReservation.id,
                        status: props.selectedReservation.status
                    })
                else
                    updateReservation(reservation);
            }

        } else showWarningMsg("Некоторые поля остались не заполнены");
    };
    const closeModalHandler = () => {
        props.setVisible(false);
        if (props.setSelectedReservation) props.setSelectedReservation(null);
    };
    const selectStartDateHandler = (date: Dayjs) => {
        setDateStart(date);
    }
    const selectStartTimeHandler = (time: Dayjs) => {
        setTimeStart(time);
    }
    const selectFinishDateHandler = (date: Dayjs) => {
        setDateFinish(date);
    }
    const selectFinishTimeHandler = (time: Dayjs) => {
        setTimeFinish(time);
    }
    // ------

    return (
        <Modal title={props.selectedReservation ? "Редактирование брони" : "Создание брони"}
               open={props.visible}
               onCancel={closeModalHandler}
               loading={(isFilialsLoading)}
               width={'600px'}
               maskClosable={false}
               footer={() => (
                   <Flex justify={'end'} align={'center'}>
                       <Flex>
                           <Button style={{marginLeft: 5}} onClick={closeModalHandler}>Отмена</Button>
                           <Button disabled={isUpdateReservationLoading} style={{marginLeft: 5}} type={'primary'}
                                   onClick={confirmHandler}>{props.selectedReservation ? "Сохранить" : "Создать"}</Button>
                       </Flex>
                   </Flex>
               )}
        >
            <Button onClick={() => setVisibleHistoryModal(true)} type={'text'} style={{fontSize: 16, position: 'absolute', top: 13, right: 47}} icon={<HistoryOutlined/>}></Button>
            {messageContextHolder}
            {(visibleHistoryModal && history) && <HistoryModal visible={visibleHistoryModal} setVisible={setVisibleHistoryModal} history={history}/>}
            <Flex gap={'middle'} vertical={true}>
                        <Flex align={"center"}>
                            <div style={{width: 220}}>Табельный</div>
                            <InputNumber disabled={isGetFioByTabnumLoading || findByFioMode} style={{width: 450}} value={tabnum} onChange={(e) => setTabnum(e)}/>
                            <Button disabled={isGetFioByTabnumLoading || findByFioMode} style={{marginLeft: 5}} onClick={() => {
                                if (tabnum) getFioByTabnum(tabnum);
                            }}>Найти</Button>
                        </Flex>
                        {findByFioMode &&
                            <Flex align={"center"}>
                                <div style={{width: 220}}>ФИО</div>
                                <Input disabled={isGetFioByTabnumLoading}
                                       style={{width: 450}}
                                       value={fio}
                                       onChange={(e) => setFio(e.target.value)}/>
                                <Button placeholder={"Введите полностью ФИО через пробел"} disabled={isGetTabnumByFioLoading} style={{marginLeft: 5}}
                                        onClick={() => {
                                            if (fio) {
                                                {
                                                    let fioTmp = fio.trim();
                                                    if (fioTmp.split(" ").length === 3)
                                                        getTabnumByFio({lastname: fioTmp.split(" ")[0], firstname: fioTmp.split(" ")[1], secondName: fioTmp.split(" ")[2]});
                                                }
                                            }
                                        }}>Найти</Button>

                            </Flex>
                        }
                        <Flex align={"center"}>
                            <div style={{width: 555}}>Я не знаю табельный, но знаю что это работник ООО "Газпром трансгаз Сургут". Вводите ФИО в формате "Иванов Иван Иванович".</div>
                            <Checkbox checked={findByFioMode} onChange={(e) => setFindByFioMode(e.target.checked)}/>
                        </Flex>

                <Flex align={"center"}>
                    <div style={{width: 220}}>Фамилия</div>
                    <Input value={lastname} onChange={(e) => setLastname(e.target.value.trim())}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Имя</div>
                    <Input value={firstname} onChange={(e) => setFirstname(e.target.value.trim())}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Отчество</div>
                    <Input value={secondname} onChange={(e) => setSecondname(e.target.value.trim())}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 155}}>Пол</div>
                    <Select
                        value={male}
                        placeholder={"Выберите пол"}
                        style={{width: 400}}
                        onChange={(e) => setMale(e)}
                        options={[{value: true, label: "Мужской"}, {value: false, label: "Женский"}]}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 155}}>Мероприятие</div>
                    <Select
                        value={selectedEventId}
                        placeholder={"Выберите мероприятие"}
                        style={{width: 400}}
                        onChange={(e) => setSelectedEventId(e)}
                        options={events?.map((eve:EventModel) => ({value: eve.id, label: eve.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 155}}>Филиал заказчик</div>
                    <Select
                        value={selectedFromFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: 400}}
                        onChange={(e) => setSelectedFromFilialId(e)}
                        options={filials?.map((f:FilialModel) => ({value: f.id, label: f.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Дата и время заселения</div>
                    <DatePicker format={'DD.MM.YYYY'} value={dateStart} onChange={selectStartDateHandler} style={{width: 170, marginRight: 5}} allowClear={false}/>
                    <TimePicker needConfirm={false} value={timeStart} style={{width: 170}} onChange={selectStartTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false} />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Дата и время выселения</div>
                    <DatePicker format={'DD.MM.YYYY'} value={dateFinish} onChange={selectFinishDateHandler} style={{width: 170, marginRight: 5}} allowClear={false}/>
                    <TimePicker needConfirm={false} value={timeFinish} style={{width: 170}} onChange={selectFinishTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false} />
                </Flex>
                <Flex vertical={true} align={"center"}>
                    {updatedReservation?.error &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`Указанные даты пересекают существующий период проживания работника ${updatedReservation.fio} (с ${updatedReservation.dateStart} по ${updatedReservation.dateFinish}) 
                        в филиале: "${updatedReservation.bed.room.flat.hotel.filial.name}", общежитии: "${updatedReservation.bed.room.flat.hotel.name}", секции: "${updatedReservation.bed.room.flat.name}", комнате  "${updatedReservation.bed.room.name}", месте  "${updatedReservation.bed.name}"`}
                               showIcon/>
                    }
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Филиал</div>
                    <Select
                        loading={isFilialsLoading}
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Общежитие</div>
                    <Select
                        allowClear={true}
                        value={selectedHotelId}
                        loading={isHotelsLoading}
                        placeholder={"Выберите общежитие"}
                        style={{minWidth: 395, maxWidth: 395}}
                        onChange={(id) => selectHotelHandler(id)}
                        onClear={() => selectHotelHandler()}
                        options={hotels.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Секция</div>
                    <Select
                        allowClear={true}
                        value={selectedFlatId}
                        loading={isFlatsLoading}
                        placeholder={"Выберите секцию"}
                        style={{width: '100%'}}
                        onChange={(e) => selectFlatHandler(e)}
                        onClear={() => selectFlatHandler()}
                        options={flats.map((flat: FlatModel) => ({value: flat.id, label: flat.name}))}
                        labelRender={(params) => (<LabelOptionRender params={params}/>)}
                        optionRender={(params) => (<SelectOptionRender params={params}/>)}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Комната</div>
                    <Select
                        allowClear={true}
                        value={selectedRoomId}
                        loading={isRoomsLoading}
                        placeholder={"Выберите комнату"}
                        style={{width: '100%'}}
                        onChange={(e) => selectRoomHandler(e)}
                        onClear={() => selectRoomHandler()}
                        options={rooms.map((room: RoomModel) => ({value: room.id, label: room.name}))}
                        labelRender={(params) => (<LabelOptionRender params={params}/>)}
                        optionRender={(params) => (<SelectOptionRender params={params}/>)}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Место</div>
                    <Select
                        allowClear={true}
                        value={selectedBedId}
                        loading={isBedsLoading}
                        placeholder={"Выберите койко-место"}
                        style={{width: '100%'}}
                        onChange={(e) => selectBedHandler(e)}
                        onClear={() => selectBedHandler()}
                        options={beds.map((bed: BedModel) => ({value: bed.id, label: bed.name}))}
                        labelRender={(params) => (<LabelOptionRender params={params}/>)}
                        optionRender={(params) => (<SelectOptionRender params={params}/>)}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Примечание</div>
                    <Input value={note} onChange={(e) => setNote(e.target.value)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
