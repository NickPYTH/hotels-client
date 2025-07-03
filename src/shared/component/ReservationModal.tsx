import React, {useEffect, useState} from 'react';
import {Alert, Button, Checkbox, CheckboxChangeEvent, DatePicker, Flex, Input, InputNumber, message, Modal, Select, TimePicker} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {filialAPI} from "service/FilialService";
import {FilialModel} from "entities/FilialModel";
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";
import {flatAPI} from "service/FlatService";
import {FlatModel} from "entities/FlatModel";
import {guestAPI} from "service/GuestService";
import {RoomModel} from "entities/RoomModel";
import {roomAPI} from "service/RoomService";
import {historyAPI} from "service/HistoryService";
import {HistoryModal} from "shared/component/HistoryModal";
import {HistoryOutlined} from "@ant-design/icons";
import {BedModel} from "entities/BedModel";
import {LabelOptionRender} from "shared/component/LabelOptionRender";
import {SelectOptionRender} from "shared/component/SelectOptionRender";
import {ReservationModel} from "entities/ReservationModel";
import {reservationAPI} from "service/ReservationService";
import {eventKindAPI} from "service/EventKindService";
import {EventKindModel} from "entities/EventKindModel";
import {GuestModel} from "entities/GuestModel";
import {contractAPI} from "service/ContractService";
import {ContractModel} from "entities/ContractModel";
import {ReasonModel} from "entities/ReasonModel";

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
    const [findByFioMode, setFindByFioMode] = useState(false); // Поиск данных через ФИО
    const [fio, setFio] = useState<string | null>(null);  // ФИО для поиска данных
    const [tabnum, setTabnum] = useState<number | null>(null);  // Табельный номер
    const [familyTabnum, setFamilyTabnum] = useState<number | null>(null);  // Табельный номер члена семьи
    const [lastname, setLastname] = useState<string | null>(null); // Фамилия
    const [firstname, setFirstname] = useState<string | null>(null); // Имя
    const [secondname, setSecondname] = useState<string | null>(null); // Отчество
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
    const [contracts, setContracts] = useState<ContractModel[]>([]);
    const [contractsStep2, setContractsStep2] = useState<ContractModel[]>([]);  // Список доступных договоров (осторожно фильтруется после получения с сервера) а тут по причине и оплате
    const [reason, setReason] = useState<ReasonModel | null>(null); // Выбранное основание
    const [reasons, setReasons] = useState<ReasonModel[]>([]); // Список оснований
    const [billing, setBilling] = useState<string | null>(null); // Выбранный вид оплаты
    const [selectedContract, setSelectedContract] = useState<ContractModel | null>(null); // Выбранный договор
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
    const [note, setNote] = useState(""); // Примечание
    const [visibleHistoryModal, setVisibleHistoryModal] = useState(false); // Видимость модального окна и историей изменений карточки
    const [isEmployee, setIsEmployee] = useState(false);
    const [isFamilyMemberOfEmployee, setIsFamilyMemberOfEmployee] = useState(false);
    const [isExtraReservation, setIsExtraReservation] = useState(false);
    // -----

    // Web requests
    const [getContracts, {
        data: contractsFromRequest,
        isLoading: isContractsLoading
    }] = contractAPI.useGetAllMutation(); // Получение всех договоров
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
    const [getFioByFamilyTabnum, {
        data: fioByFamilyTabnum,
        isLoading: isGetFioByFamilyTabnumLoading
    }] = guestAPI.useGetFioByTabnumMutation(); // Получение данных о жильце через табельный номер (ФИО + пол) отдельный запрос для члена семьи
    const [updateReservation, {
        data: updatedReservation,
        isLoading: isUpdateReservationLoading
    }] = reservationAPI.useUpdateMutation(); // Запрос на обновление брони
    const [getGuestHistory, {
        data: history,
    }] = historyAPI.useGetGuestHistoryMutation(); // Запрос на получение истории изменения брони по ИД гостя
    const [getAllEvents, {
        data: events,
    }] = eventKindAPI.useGetAllMutation(); // Получение списка видов мероприятий
    // -----

    // Useful utils
    const [messageApi, messageContextHolder] = message.useMessage(); // Контекст для всплывающих уведомлений
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const showSuccessMsg = (msg: string) => {
        messageApi.success(msg);
    };
    // -----

    // Effects
    useEffect(() => {
        if (contractsFromRequest && selectedHotelId) {
            setContracts(contractsFromRequest.filter((c: ContractModel) => c.hotel.id == selectedHotelId));
        }
    }, [contractsFromRequest, selectedHotelId]);
    useEffect(() => {
        setContractsStep2(contracts);
    }, [contracts])
    useEffect(() => {
        getContracts();
        getAllFilials();
        getAllEvents();

        // Заполнение параметрами переданным из шахматки
        if (props.filialId && props.hotelId && props.flatId && props.roomId && props.bedId) {
            setSelectedFilialId(parseInt(props.filialId.toString()));
            setSelectedHotelId(parseInt(props.hotelId.toString()));
            setSelectedFlatId(parseInt(props.flatId.toString()));
            setSelectedRoomId(parseInt(props.roomId.toString()));
            setSelectedBedId(parseInt(props.bedId.toString()));
            if (props.dateStart) setDateStart(props.dateStart);
            if (props.dateFinish) setDateFinish(props.dateFinish);
        }
        // -----

        // Заполнение парамаетрами из массового заполнения
        if (props.semiAutoParams) {
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
            setSelectedFilialId(tmp.bed.room.flat.hotel.filial.id);
            setSelectedHotelId(tmp.bed.room.flat.hotel.id);
            setSelectedFlatId(tmp.bed.room.flat.id);
            setSelectedRoomId(tmp.bed.room.id);
            setSelectedBedId(tmp.bed.id);
            // -----
        }
        // -----
    }, []);
    useEffect(() => {
        if (props.room) {
            setSelectedFilialId(props.room.flat.hotel.filial.id);
            setSelectedHotelId(props.room.flat.hotel.id);
            setSelectedFlatId(props.room.flat.id);
            setSelectedRoomId(props.room.id);
            if (props.bedId) setSelectedBedId(props.bedId);
            else setIsExtraReservation(true);
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
            setTabnum(props.selectedReservation.tabnum);
            setLastname(props.selectedReservation.lastname);
            setFirstname(props.selectedReservation.firstname);
            setSecondname(props.selectedReservation.secondName);
            setMale(props.selectedReservation.male);
            setSelectedFilialId(props.selectedReservation.bed.room.flat.hotel.filial.id);
            setSelectedHotelId(props.selectedReservation.bed.room.flat.hotel.id);
            setSelectedFlatId(props.selectedReservation.bed.room.flat.id);
            setSelectedRoomId(props.selectedReservation.bed.room.id);
            setSelectedBedId(props.selectedReservation.bed.id);
            setSelectedEventId(props.selectedReservation.event.id);
            setSelectedFromFilialId(props.selectedReservation.fromFilial.id);
            setNote(props.selectedReservation.note);
            getAllHotels({filialId: props.selectedReservation.bed.room.flat.hotel.filial.id.toString()});
            getAllFlats({hotelId: props.selectedReservation.bed.room.flat.hotel.id.toString(), dateStart: props.selectedReservation.dateStart, dateFinish: props.selectedReservation.dateFinish});
            getAllRooms({flatId: props.selectedReservation.bed.room.flat.id, dateStart: props.selectedReservation.dateStart, dateFinish: props.selectedReservation.dateFinish});
            getAllBeds({roomId: props.selectedReservation.bed.room.id, dateStart: props.selectedReservation.dateStart, dateFinish: props.selectedReservation.dateFinish});
            if (props.selectedReservation.tabnum) {
                setIsEmployee(true);
                getFioByTabnum(props.selectedReservation.tabnum);
            }
            if (props.selectedReservation.id) {
                getGuestHistory(props.selectedReservation.id);
            }
            if (props.selectedReservation.familyMemberOfEmployee != null) {
                setIsFamilyMemberOfEmployee(true);
                setIsEmployee(false);
                setFamilyTabnum(props.selectedReservation.familyMemberOfEmployee);
            }
            if (props.selectedReservation.contract) {
                setSelectedContract(props.selectedReservation.contract);
                setReason(props.selectedReservation.contract.reason);
                setBilling(props.selectedReservation.contract.billing);
            }
        }
    }, [props.selectedReservation]);
    useEffect(() => {
        if (selectedFilialId)
            getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedHotelId)
            getAllFlats({
                hotelId: selectedHotelId.toString(),
                dateStart: dateStart == null ? "null" : `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: dateFinish == null ? "null" : `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
    }, [selectedHotelId]);
    useEffect(() => {
        if (selectedFlatId)
            getAllRooms({
                flatId: selectedFlatId,
                dateStart: dateStart == null ? "null" : `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: dateFinish == null ? "null" : `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
    }, [selectedFlatId]);
    useEffect(() => {
        if (selectedRoomId)
            getAllBeds({
                roomId: selectedRoomId,
                dateStart: dateStart == null ? "null" : `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: dateFinish == null ? "null" : `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
    }, [selectedRoomId]);
    useEffect(() => {
        if (dateStart && dateFinish && selectedHotelId && selectedFlatId && selectedRoomId) {
            getAllFlats({
                hotelId: selectedHotelId.toString(),
                dateStart: `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
            getAllRooms({
                flatId: selectedFlatId,
                dateStart: `${dateStart.format('DD-MM-YYYY')} ${timeStart.format('HH:mm')}`,
                dateFinish: `${dateFinish.format('DD-MM-YYYY')} ${timeFinish.format('HH:mm')}`,
            });
            getAllBeds({
                roomId: selectedRoomId,
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
                if (props.semiAutoParams) {
                    props.refresh(updatedReservation);
                } else props.refresh();
            }
        }
    }, [updatedReservation]);
    useEffect(() => {
        if (fioByFamilyTabnum) {
            if (fioByFamilyTabnum.firstname != null) {
                showSuccessMsg("Работник найден!");
            } else {
                setFamilyTabnum(null);
                showWarningMsg("Работник не найден!");
            }
        }
    }, [fioByFamilyTabnum]);
    useEffect(() => {
        if (contractsFromRequest && selectedHotelId) {
            if (isEmployee) {
                let filteredContracts: ContractModel[] = contractsFromRequest.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id === 11 && c.hotel.id === selectedHotelId && c.year == 2025);
                setContracts(filteredContracts);
                setReasons(filteredContracts.reduce((acc: ReasonModel[], contract: ContractModel) => {
                    if (!acc.find((reason: ReasonModel) => reason.id == contract.reason.id))
                        return acc.concat([contract.reason]);
                    return acc;
                }, []));
            } else {
                let filteredContracts: ContractModel[] = contractsFromRequest.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id !== 11 && c.hotel.id === selectedHotelId && c.year == 2025);
                setContracts(filteredContracts);
                setReasons(filteredContracts.reduce((acc: ReasonModel[], contract: ContractModel) => {
                    if (!acc.find((reason: ReasonModel) => reason.id == contract.reason.id))
                        return acc.concat([contract.reason]);
                    return acc;
                }, []));
            }
        }
    }, [contractsFromRequest, selectedHotelId, isEmployee]);
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
            let event: EventKindModel | undefined = events?.find((e: EventKindModel) => e.id == selectedEventId);
            let fromFilial: FilialModel | undefined = filials?.find((f: FilialModel) => f.id == selectedFromFilialId);
            if (event && fromFilial && selectedRoomId) {
                let reservation: ReservationModel = {
                    id: null,
                    firstname: firstname ?? "",
                    lastname: lastname ?? "",
                    secondName: secondname ?? "",
                    male,
                    bed: {id: selectedBedId, name: ''} as unknown as BedModel,
                    dateStart: ds,
                    dateFinish: df,
                    event,
                    fromFilial,
                    guest: null,
                    note,
                    status: {id: 1, name: ''},
                    tabnum,
                    familyMemberOfEmployee: familyTabnum,
                    roomId: selectedRoomId,
                    contract: selectedContract
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
    };
    const selectStartTimeHandler = (time: Dayjs) => {
        setTimeStart(time);
    };
    const selectFinishDateHandler = (date: Dayjs) => {
        setDateFinish(date);
    };
    const selectFinishTimeHandler = (time: Dayjs) => {
        setTimeFinish(time);
    };
    const switchIsEmployerHandler = (e: CheckboxChangeEvent) => {
        setIsEmployee(e.target.checked);
    }
    const switchIsFamilyMemberOfEmployeeHandler = (e: CheckboxChangeEvent) => {
        setIsEmployee(false);
        setIsFamilyMemberOfEmployee(e.target.checked);
    }
    const selectReasonHandler = (reasonId: number | null) => {
        let reason = reasons.find((r: ReasonModel) => r.id == reasonId);
        if (reason) setReason(reason);
        else setReason(null);
        setContractsStep2(() => contracts.filter((c: ContractModel) => (billing ? c.billing == billing : true) && (reason ? c.reason.id == reason.id : true)));
        setSelectedContract(null);
    }
    const selectBillingHandler = (billing: string) => {
        setBilling(billing);
        setContractsStep2(() => contracts.filter((c: ContractModel) => (reason ? c.reason == reason : true) && (billing ? c.billing == billing : true)));
        setSelectedContract(null);
    }
    const selectContractHandler = (contractId: number) => {
        let contract = contracts.find((c: ContractModel) => c.id == contractId);
        if (contract) {
            setSelectedContract(contract);
            setBilling(contract.billing);
            setReason(contract.reason);
        } else {
            setSelectedContract(null);
            setBilling("");
            setReason(null);
        }
    }
    // ------

    return (
        <Modal title={props.selectedReservation ? "Редактирование брони" : isExtraReservation ? "Создание брони на дополнительное место" : "Создание брони"}
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
                    <div style={{width: 155}}>Работник</div>
                    <Checkbox checked={isEmployee} onChange={switchIsEmployerHandler}
                    />
                </Flex>
                {isEmployee ?
                    <>
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
                                       value={fio ?? ""}
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
                    </>
                    :
                    <>
                        <Flex align={"center"}>
                            <div style={{width: 155}}>Член семьи работника</div>
                            <Checkbox checked={isFamilyMemberOfEmployee} onChange={switchIsFamilyMemberOfEmployeeHandler}
                            />
                        </Flex>
                        {isFamilyMemberOfEmployee &&
                            <Flex align={"center"}>
                                <div style={{width: 155}}>Табельный члена семьи</div>
                                <InputNumber style={{width: 300}} value={familyTabnum} onChange={(e) => setFamilyTabnum(e)}/>
                                <Button disabled={isGetFioByFamilyTabnumLoading} style={{marginLeft: 5, width: 92}} onClick={() => {
                                    if (familyTabnum) getFioByFamilyTabnum(familyTabnum);
                                }}>Проверить</Button>
                            </Flex>
                        }
                    </>
                }
                <Flex align={"center"}>
                    <div style={{width: 220}}>Фамилия</div>
                    <Input value={lastname ?? ""} onChange={(e) => setLastname(e.target.value.trim())}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Имя</div>
                    <Input value={firstname ?? ""} onChange={(e) => setFirstname(e.target.value.trim())}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Отчество</div>
                    <Input value={secondname ?? ""} onChange={(e) => setSecondname(e.target.value.trim())}/>
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
                        options={events?.map((eve: EventKindModel) => ({value: eve.id, label: eve.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 155}}>Филиал заказчик</div>
                    <Select
                        value={selectedFromFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: 400}}
                        onChange={(e) => setSelectedFromFilialId(e)}
                        options={filials?.map((f: FilialModel) => ({value: f.id, label: f.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Дата и время заселения</div>
                    <DatePicker format={'DD.MM.YYYY'} value={dateStart} onChange={selectStartDateHandler} style={{width: 170, marginRight: 5}} allowClear={false}/>
                    <TimePicker needConfirm={false} value={timeStart} style={{width: 170}} onChange={selectStartTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Дата и время выселения</div>
                    <DatePicker format={'DD.MM.YYYY'} value={dateFinish} onChange={selectFinishDateHandler} style={{width: 170, marginRight: 5}} allowClear={false}/>
                    <TimePicker needConfirm={false} value={timeFinish} style={{width: 170}} onChange={selectFinishTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false}/>
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
                    <div style={{width: 220}}>Основание</div>
                    <Flex vertical={true}>
                        <Select
                            loading={isContractsLoading}
                            value={reason ? reason.id : null}
                            placeholder={"Необязательно"}
                            style={{width: 397}}
                            onChange={selectReasonHandler}
                            options={reasons?.map((r: ReasonModel) => ({value: r.id, label: r.name}))}
                            allowClear={true}
                            showSearch
                            filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        />
                    </Flex>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Вид оплаты</div>
                    <Select
                        value={billing}
                        placeholder={"Необязательно"}
                        style={{width: 560}}
                        onChange={selectBillingHandler}
                        options={[{value: "наличный расчет", label: "наличный расчет"}, {value: "безналичный расчет", label: "безналичный расчет"}]}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Договор</div>
                    <Flex vertical={true}>
                        <Select
                            loading={isContractsLoading}
                            value={selectedContract ? selectedContract.id : null}
                            placeholder={"Необязательно"}
                            style={{width: 397}}
                            onChange={selectContractHandler}
                            options={contractsStep2?.map((contractModel: ContractModel) => ({value: contractModel.id, label: `Год: ${contractModel.year} №: ${contractModel.docnum}`}))}
                            allowClear={true}
                            showSearch
                            filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        />
                    </Flex>
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
                        disabled={isExtraReservation}
                        allowClear={true}
                        value={selectedBedId}
                        loading={isBedsLoading}
                        placeholder={isExtraReservation ? "Выбор произойдет автоматически" : "Выберите койко-место"}
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
