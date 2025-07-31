import React, {useEffect, useState} from 'react';
import {Alert, Badge, Button, Checkbox, CheckboxChangeEvent, DatePicker, Flex, Input, InputNumber, message, Modal, Select, TimePicker} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {filialAPI} from "service/FilialService";
import {FilialModel} from "entities/FilialModel";
import {hotelAPI} from "service/HotelService";
import {HotelModel} from "entities/HotelModel";
import {flatAPI} from "service/FlatService";
import {FlatModel} from "entities/FlatModel";
import {GuestModel} from "entities/GuestModel";
import {guestAPI} from "service/GuestService";
import {RoomModel} from "entities/RoomModel";
import {roomAPI} from "service/RoomService";
import {contractAPI} from "service/ContractService";
import {OrganizationModel} from "entities/OrganizationModel";
import {ReasonModel} from "entities/ReasonModel";
import {RootStateType} from "store/store";
import {useSelector} from 'react-redux';
import {ContractModel} from "entities/ContractModel";
import {historyAPI} from "service/HistoryService";
import {HistoryModal} from "shared/component/HistoryModal";
import {HistoryOutlined} from "@ant-design/icons";
import {extraAPI} from "service/ExtraService";
import {GuestExtrasModal} from "shared/component/GuestExtrasModal";
import {BedModel} from "entities/BedModel";
import {SelectGuestFromOrgModal} from "shared/component/SelectGuestFromOrgModal";
import {LabelOptionRender} from "shared/component/LabelOptionRender";
import {SelectOptionRender} from "shared/component/SelectOptionRender";
import {organizationAPI} from "service/OrganizationService";

type ModalProps = {
    semiAutoParams?: GuestModel, // Перечень параметров для полу автоматичского заполнения
    filialId?: number,
    hotelId?: number,
    flatId?: number,
    roomId?: number,
    bedId?: number;
    room?: RoomModel;
    dateStart?: Dayjs,
    dateFinish?: Dayjs,
    selectedGuest: GuestModel | null,
    setSelectedGuest?: Function,
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    isAddressDisabled: boolean,
    showSuccessMsg: Function,
    setGuests?: Function,
    flatName?: string,
}

export const GuestModal = (props: ModalProps) => {

    // States
    const [isEmployee, setIsEmployee] = useState(true); // Является ли жилец работник Газпрома
    const [isFamilyMemberOfEmployee, setIsFamilyMemberOfEmployee] = useState(false); // Является ли жилец членом семьи работника
    const [findByFioMode, setFindByFioMode] = useState(false); // Поиск данных через ФИО
    const [fio, setFio] = useState<string | null>(null);  // ФИО для поиска данных
    const [tabnum, setTabnum] = useState<number | null>(null);  // Табельный номер
    const [familyTabnum, setFamilyTabnum] = useState<number | null>(null);  // Табельный номер члена семьи
    const [selectedOrganization, setSelectedOrganization] = useState<OrganizationModel | null>(null); // Выбранная организация
    const [lastname, setLastname] = useState<string | null>(null); // Фамилия
    const [firstname, setFirstname] = useState<string | null>(null); // Имя
    const [secondName, setSecondName] = useState<string | null>(null); // Отчество
    const [male, setMale] = useState<boolean | null>(null); // Пол ДА - мужской, НЕТ - женский
    const [memo, setMemo] = useState(""); // Номер маршрутного листа или служебного задания
    const [reason, setReason] = useState<ReasonModel | null>(null); // Выбранное основание
    const [reasons, setReasons] = useState<ReasonModel[]>([]); // Список оснований
    const [billing, setBilling] = useState<string | null>(null); // Выбранный вид оплаты
    const [billings, setBillings] = useState<string[]>([]); // Виды оплаты
    const [isCreditCard, setIsCreditCard] = useState<boolean | null>(null); // Оплата по карте, возможна при выборе вида оплаты "Наличными"
    const [selectedContract, setSelectedContract] = useState<ContractModel | null>(null); // Выбранный договор
    const [contracts, setContracts] = useState<ContractModel[]>([]);  // Список доступных договоров (осторожно фильтруется после получения с сервера) фильтр по оргам и году и отелю
    const [contractsStep2, setContractsStep2] = useState<ContractModel[]>([]);  // Список доступных договоров (осторожно фильтруется после получения с сервера) а тут по причине и оплате
    const [regPoMestu, setRegPoMestu] = useState(false); // Регистрация по месту пребывания
    const [dateStart, setDateStart] = useState<Dayjs | null>(() => {
        if (props.selectedGuest?.dateStart) return dayjs(props.selectedGuest.dateStart, 'DD-MM-YYYY');
        else return null;
    }); // Дата заселения
    const [timeStart, setTimeStart] = useState<Dayjs>(() => {
        if (props.selectedGuest?.dateStart) return dayjs(props.selectedGuest.dateStart.split(" ")[1], 'HH:mm');
        else return dayjs('12:00', 'HH:mm');
    }); // Время заселения
    const [dateFinish, setDateFinish] = useState<Dayjs | null>(() => {
        if (props.selectedGuest?.dateFinish) return dayjs(props.selectedGuest.dateFinish, 'DD-MM-YYYY');
        else return null;
    }); // Дата выселения
    const [timeFinish, setTimeFinish] = useState<Dayjs>(() => {
        if (props.selectedGuest?.dateFinish) return dayjs(props.selectedGuest.dateFinish.split(" ")[1], 'HH:mm');
        else return dayjs('12:00', 'HH:mm');
    }); // Время выселения
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(props.selectedGuest ? props.selectedGuest.bed.room.flat.hotel.filial.id : null); // ИД выбранного филиала
    const [filials, setFilials] = useState<FilialModel[]>([]); // Перечень доступных для выбора филиалов
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(props.selectedGuest ? props.selectedGuest.bed.room.flat.hotel.id : null); // ИД выбранного общежития
    const [hotels, setHotels] = useState<HotelModel[]>([]); // Перечень достпных для выбора отелей
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(props.selectedGuest ? props.selectedGuest.bed.room.flat.id : null); // ИД выбранной секции
    const [flats, setFlats] = useState<FlatModel[]>([]); // Перечень доступных для выбора секций
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(props.selectedGuest ? props.selectedGuest.bed.room.id : null); // ИД выбранной комнаты
    const [rooms, setRooms] = useState<RoomModel[]>([]); // Перечень доступных для выбора комнат
    const [selectedBedId, setSelectedBedId] = useState<number | null>(props.selectedGuest ? props.selectedGuest.bed.id : null); // ИД выбранного места (койко-места)
    const [beds, setBeds] = useState<BedModel[]>([]); // Перечень доступных для выбора мест
    const [note, setNote] = useState(""); // Примечание
    const [visibleSelectGuestModal, setVisibleSelectGuestModal] = useState(false);  // Окно выбора проживающего из ранее заселенных жильцов для авто аполнения данных
    const [visibleHistoryModal, setVisibleHistoryModal] = useState(false); // Видимость модального окна и историей изменений карточки
    const [visibleExtrasModal, setVisibleExtrasModal] = useState(false); // Видимость модального окна с доп. услугами (только для Ермака)
    const [errorCode, setErrorCode] = useState<number | null>(null); // Код ошибки с сервера, для вывода нужного сообщения
    const [isExtra, setIsExtra] = useState(false); // Параметр отвечающий за заселение жильца на доп. место, место с свойством isExtra=true
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
    const [getAllOrganizations, {
        data: organizations,
        isLoading: isOrganizationsLoading
    }] = organizationAPI.useGetAllMutation(); // Получение всех организаций
    const [getFioByTabnum, {
        data: fioByTabnum,
        isLoading: isGetFioByTabnumLoading
    }] = guestAPI.useGetFioByTabnumMutation(); // Получение данных о жильце через табельный номер (ФИО + пол)
    const [getFioByFamilyTabnum, {
        data: fioByFamilyTabnum,
        isLoading: isGetFioByFamilyTabnumLoading
    }] = guestAPI.useGetFioByTabnumMutation(); // Получение данных о жильце через табельный номер (ФИО + пол) отдельный запрос для члена семьи
    const [getTabnumByFio, {
        data: tabnumByFio,
        isLoading: isGetTabnumByFioLoading
    }] = guestAPI.useGetTabnumByFioMutation(); // Получение данных о жильце через табельный номер (ФИО + пол)
    const [createGuest, {
        data: createdGuest,
        isLoading: isCreateGuestLoading
    }] = guestAPI.useCreateMutation(); // Запрос на создание записи о проживании
    const [updateGuest, {
        data: updatedGuest,
        isLoading: isUpdateGuestLoading
    }] = guestAPI.useUpdateMutation(); // Запрос на обновление записи о проживании
    const [getEntityHistory, {
        data: history,
    }] = historyAPI.useGetEntityHistoryMutation(); // Запрос на получение истории изменения карточки проживания по ИД гостя
    const [getAllExtras, {
        data: extras,
    }] = extraAPI.useGetAllByGuestMutation(); // Запрос на получение информации о доп. услугах по ИД гостя (только для Ермака)
    // -----

    // Effects
    useEffect(() => {
        // Получаем справочники
        getAllOrganizations();
        getAllFilials();
        getContracts();
        // -----

        // Параметры для частичного пред-заполнения карточки, если нужно заполнить куда селить и даты проживания
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
    }, []);
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
                setBillings(filteredContracts.reduce((acc: string[], contract: ContractModel) => {
                    if (!acc.find((r: string) => r == contract.billing))
                        return acc.concat([contract.billing]);
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

    useEffect(() => {
        setContractsStep2(contracts);
        if (contracts.length === 1) setSelectedContract(contracts[0]);
        // При выборе орг член семьи авто-выбор договора для члена семей
        if (selectedOrganization) {
            if (selectedOrganization.name.indexOf("член") > 0) {
                let familyContract = contracts.find((c: ContractModel) => c.id == 1885);
                if (familyContract) setSelectedContract(familyContract);
            }
        }
    }, [contracts])
    useEffect(() => {
        if (contractsStep2) {
            setReasons(contractsStep2.reduce((acc: ReasonModel[], contract: ContractModel) => {
                if (!acc.find((reason: ReasonModel) => reason.id == contract.reason.id))
                    return acc.concat([contract.reason]);
                return acc;
            }, []));
            setBillings(contractsStep2.reduce((acc: string[], contract: ContractModel) => {
                if (!acc.find((r: string) => r == contract.billing))
                    return acc.concat([contract.billing]);
                return acc;
            }, []));
        }
    }, [contractsStep2]);  // Фильтрация нужных видов оплат и оснований, при последней фильтрации списка договоров
    useEffect(() => {
        if (fioByTabnum) {
            setFirstname(fioByTabnum.firstname);
            setLastname(fioByTabnum.lastname);
            setSecondName(fioByTabnum.secondName);
            setMale(fioByTabnum.male);
        }
    }, [fioByTabnum]);
    useEffect(() => {
        if (tabnumByFio) {
            setTabnum(tabnumByFio.tabnum);
            setFirstname(tabnumByFio.firstname);
            setLastname(tabnumByFio.lastname);
            setSecondName(tabnumByFio.secondName);
            setMale(tabnumByFio.male);
        }
    }, [tabnumByFio]);
    useEffect(() => {
        if (props.selectedGuest) {
            setTabnum(props.selectedGuest.tabnum);
            setIsEmployee(!!props.selectedGuest.tabnum);
            setSelectedOrganization(props.selectedGuest.organization);
            setFirstname(props.selectedGuest.firstname);
            setLastname(props.selectedGuest.lastname);
            setSecondName(props.selectedGuest.secondName);
            setMemo(props.selectedGuest.memo);
            if (props.selectedGuest.contract) {
                setReason(props.selectedGuest.contract.reason);
                setBilling(props.selectedGuest.contract.billing);
                setIsCreditCard(props.selectedGuest.creditCard);
                setSelectedContract(props.selectedGuest.contract);
            }
            setRegPoMestu(props.selectedGuest.regPoMestu);
            setMale(props.selectedGuest.male);
            if (props.selectedGuest.familyMemberOfEmployee) {
                setIsFamilyMemberOfEmployee(true);
                setFamilyTabnum(props.selectedGuest.familyMemberOfEmployee);
            }
            setNote(props.selectedGuest.note);
            if (props.selectedGuest.id) {
                getAllExtras(props.selectedGuest.id);
                getEntityHistory({entityId: props.selectedGuest.id, entityType: "guest"}); // В фоне загружаем историю изменений
            }
            getAllHotels({filialId: props.selectedGuest.bed.room.flat.hotel.filial.id.toString()});
            getAllFlats({hotelId: props.selectedGuest.bed.room.flat.hotel.id.toString(), dateStart: props.selectedGuest.dateStart, dateFinish: props.selectedGuest.dateFinish});
            getAllRooms({flatId: props.selectedGuest.bed.room.flat.id, dateStart: props.selectedGuest.dateStart, dateFinish: props.selectedGuest.dateFinish});
            getAllBeds({roomId: props.selectedGuest.bed.room.id, dateStart: props.selectedGuest.dateStart, dateFinish: props.selectedGuest.dateFinish});
        }
    }, [props.selectedGuest]);
    useEffect(() => {
        // Так передаются параметры из модалок массового создания, передаю так т.к. через selectedGuest срабатывает эффект на редактирование существующей записи
        if (props.semiAutoParams) {
            setTabnum(props.semiAutoParams.tabnum);
            if (props.semiAutoParams.contract) {
                setReason(props.semiAutoParams.contract.reason);
                setBilling(props.semiAutoParams.contract.billing);
            }
            setSelectedContract(props.semiAutoParams.contract);
            if (props.semiAutoParams.dateStart) {
                setDateStart(dayjs(props.semiAutoParams.dateStart, 'DD-MM-YYYY'));
                setTimeStart(dayjs(props.semiAutoParams.dateStart.split(" ")[1], 'HH:mm'));
            }
            if (props.semiAutoParams.dateFinish) {
                setDateFinish(dayjs(props.semiAutoParams.dateFinish, 'DD-MM-YYYY'));
                setTimeFinish(dayjs(props.semiAutoParams.dateFinish.split(" ")[1], 'HH:mm'));
            }
            if (props.semiAutoParams.tabnum) getFioByTabnum(props.semiAutoParams.tabnum);
            setMemo("-");
            setSelectedFilialId(props.semiAutoParams.bed.room.flat.hotel.filial.id);
            setSelectedHotelId(props.semiAutoParams.bed.room.flat.hotel.id);
            setSelectedFlatId(props.semiAutoParams.bed.room.flat.id);
            setSelectedRoomId(props.semiAutoParams.bed.room.id);
            setSelectedBedId(props.semiAutoParams.bed.id);
        }
        // -----
    }, [props.semiAutoParams]);
    useEffect(() => {
        if (props.room) {
            setSelectedFilialId(props.room.flat.hotel.filial.id);
            setSelectedHotelId(props.room.flat.hotel.id);
            setSelectedFlatId(props.room.flat.id);
            setSelectedRoomId(props.room.id);
            setSelectedRoomId(props.room.id);
            setSelectedBedId(props.bedId ?? null);
            if (!props.bedId) setIsExtra(true);
        }
    }, [props.room]);
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
    }, [dateStart, dateFinish])
    useEffect(() => {
        if (selectedContract) {
            let contract: ContractModel | undefined = contracts.find((c: ContractModel) => c.id === selectedContract.id);
            if (contract) {
                setBilling(contract.billing);
                setReason(contract.reason);
            }
        }
    }, [selectedContract]);
    useEffect(() => {
        if (organizations && !props.selectedGuest) {
            let GTS = organizations.find((o: OrganizationModel) => o.id == 11);
            if (GTS) setSelectedOrganization(GTS);
        }
    }, [organizations]);
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
        if (updatedGuest) {
            if (!updatedGuest.error) {
                props.setVisible(false);
                if (props.setSelectedGuest) props.setSelectedGuest(null);
                props.refresh();
                if (props.setGuests) {
                    props.setGuests((prev: GuestModel[]) => prev.map((p: GuestModel) => p.id === updatedGuest.id ?
                        {
                            ...p,
                            tabnum: updatedGuest.tabnum,
                            organization: updatedGuest.organization,
                            lastname: updatedGuest.lastname,
                            firstname: updatedGuest.firstname,
                            secondName: updatedGuest.secondName,
                            male: updatedGuest.male,
                            memo: updatedGuest.memo,
                            contract: updatedGuest.contract,
                            regPoMestu: updatedGuest.regPoMestu,
                            dateStart: updatedGuest.dateStart,
                            dateFinish: updatedGuest.dateFinish,
                            bed: updatedGuest.bed,
                            note: updatedGuest.note,
                        }
                        : p));
                }
            } else {
                if (updatedGuest.error == 'datesError') setErrorCode(1);
                if (updatedGuest.error == 'roomLock') setErrorCode(2);
                if (updatedGuest.error == 'flatLock') setErrorCode(3);
                if (updatedGuest.error == 'roomOrg') setErrorCode(4);
                if (updatedGuest.error == 'flatOrg') setErrorCode(5);
            }
        }
    }, [updatedGuest]);
    useEffect(() => {
        if (createdGuest) {
            if (!createdGuest.error) {
                if (props.semiAutoParams) {
                    props.refresh(createdGuest);
                }
                props.setVisible(false);
                if (props.setSelectedGuest) props.setSelectedGuest(null);
                props.refresh();
                if (props.setGuests) {
                    props.setGuests((prev: GuestModel[]) => prev.map((p: GuestModel) => p.id === createdGuest.id ?
                        {
                            ...p,
                            tabnum: createdGuest.tabnum,
                            organization: createdGuest.organization,
                            lastname: createdGuest.lastname,
                            firstname: createdGuest.firstname,
                            secondName: createdGuest.secondName,
                            male: createdGuest.male,
                            memo: createdGuest.memo,
                            contract: createdGuest.contract,
                            regPoMestu: createdGuest.regPoMestu,
                            dateStart: createdGuest.dateStart,
                            dateFinish: createdGuest.dateFinish,
                            note: createdGuest.note,
                        }
                        : p));
                }
            } else {
                if (createdGuest.error == 'datesError') setErrorCode(1);
                if (createdGuest.error == 'roomLock') setErrorCode(2);
                if (createdGuest.error == 'flatLock') setErrorCode(3);
                if (createdGuest.error == 'roomOrg') setErrorCode(4);
                if (createdGuest.error == 'flatOrg') setErrorCode(5);
            }
        }
    }, [createdGuest]);
    useEffect(() => {
        if (fioByFamilyTabnum) {
            if (fioByFamilyTabnum.firstname != null) {
                props.showSuccessMsg("Работник найден!");
            } else {
                setFamilyTabnum(null);
                showWarningMsg("Работник не найден!");
            }
        }
    }, [fioByFamilyTabnum])
    // -----

    // Useful utils
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user); // Текущий пользователь системы
    const [messageApi, messageContextHolder] = message.useMessage(); // Контекст для всплывающих уведомлений
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
    const closeModalHandler = () => {
        props.setVisible(false);
        if (props.setSelectedGuest) props.setSelectedGuest(null);
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
    const switchIsEmployerHandler = (e: CheckboxChangeEvent) => {
        setIsEmployee(e.target.checked);
        setReason(null);
        setBilling(null);
        setSelectedContract(null);
        if (!e.target.checked) {
            setSelectedOrganization(null);
            setLastname("");
            setFirstname("");
            setSecondName("");
        } else {
            let GTS = organizations?.find((o: OrganizationModel) => o.id == 11);
            if (GTS) setSelectedOrganization(GTS);
        }
    }
    const switchIsFamilyMemberOfEmployeeHandler = (e: CheckboxChangeEvent) => {
        setIsEmployee(false);
        setIsFamilyMemberOfEmployee(e.target.checked);
        if (e.target.checked) {
            // Устанавливаем организацию
            let familyOrg = organizations?.find((org: OrganizationModel) => org.name.toLowerCase().indexOf("семьи") !== -1);
            if (familyOrg) setSelectedOrganization(familyOrg);
            // -----

            // Устанавливаем договор
            let familyContract = contracts?.find((c: ContractModel) => c.reason.name.indexOf("семьи") !== -1);
            if (familyContract) {
                setSelectedContract(familyContract);
            } else {
                setSelectedContract(null);
                setReason(null);
                setBilling(null);
            }
            // -----

            setMemo("-");
        } else {
            setSelectedOrganization(null);
            setFamilyTabnum(null);
            setIsFamilyMemberOfEmployee(false);
        }
        setLastname("");
        setFirstname("");
        setSecondName("");
    }
    const selectOrganizationHandler = (organizationId: number) => {
        let organization = organizations?.find((o: OrganizationModel) => o.id == organizationId);
        setFamilyTabnum(null);
        if (organization) setSelectedOrganization(organization);
        if (contractsFromRequest) setContracts(contractsFromRequest.filter((c: ContractModel) => c.organization.id == organization?.id && c.hotel.id === selectedHotelId && c.year == 2025));
    }
    const selectReasonHandler = (reasonId: number) => {
        let reason = reasons.find((r: ReasonModel) => r.id == reasonId);
        if (reason) setReason(reason);
        else setReason(null);
        setContractsStep2(() => contracts.filter((c: ContractModel) => (billing ? c.billing == billing : true) && (reason ? c.reason.id == reason.id : true)));
        setSelectedContract(null);
        setBilling(null);
    }
    const selectBillingHandler = (billing: string) => {
        setIsCreditCard(null);
        setBilling(billing);
        setContractsStep2(() => contracts.filter((c: ContractModel) => (reason ? c.reason == reason : true) && (billing ? c.billing == billing : true)));
        setSelectedContract(null);
    }
    const selectContractHandler = (contractId: number) => {
        let contract = contracts.find((c: ContractModel) => c.id == contractId);
        if (contract) setSelectedContract(contract);
        else setSelectedContract(null);
    }
    const confirmHandler = () => {
        if (currentUser.roleId === 4 || currentUser.roleId === 3) {
            showWarningMsg("Вы находитесь в режиме просмотра");
            return;
        }
        if (firstname && lastname && secondName && dateStart && dateFinish && selectedFlatId && selectedRoomId && memo && male !== null && selectedOrganization && selectedContract) {
            let ds = `${dateStart.format("DD-MM-YYYY")} ${timeStart.format("HH:mm")}`;
            let df = `${dateFinish.format("DD-MM-YYYY")} ${timeFinish.format("HH:mm")}`;
            if (dayjs(ds, 'DD-MM-YYYY HH:mm').isAfter(dayjs(df, 'DD-MM-YYYY HH:mm'))) {
                showWarningMsg("Время заселения опережает время выселения.");
                return;
            }
            if (dayjs(ds, 'DD-MM-YYYY HH:mm').isSame(dayjs(df, 'DD-MM-YYYY HH:mm'))) {
                showWarningMsg("Время заселения совпадает с временем выселения.");
                return;
            }
            if (ds.includes("00:00")) ds = ds.replace("00:00", "12:00");
            if (df.includes("00:00")) df = df.replace("00:00", "12:00");
            let bed: any = {
                id: selectedBedId,
                name: "",
                room: {id: selectedRoomId, flat: {id: selectedFlatId, hotel: {id: selectedHotelId, filial: {id: selectedFilialId}}}}
            }
            let guest: GuestModel = {
                dateFinish: df,
                dateStart: ds,
                firstname: firstname ? firstname.trim() : null,
                id: null,
                lastname: lastname ? lastname.trim() : null,
                note,
                secondName: secondName ? secondName.trim() : null,
                tabnum: isEmployee ? tabnum : null,
                organization: selectedOrganization,
                regPoMestu,
                memo,
                male,
                contract: selectedContract,
                familyMemberOfEmployee: familyTabnum,
                bed,
                creditCard: isCreditCard
            };
            if (props.selectedGuest) {
                guest = {...guest, id: props.selectedGuest.id}
                updateGuest(guest);
            } else {
                createGuest(guest);
            }
        } else showWarningMsg("Некоторые поля остались не заполнены");
    };
    // ------

    return (
        <Modal title={props.selectedGuest ? "Редактирование" : isExtra ? "Создание доп. места" : "Создание"}
               open={props.visible}
               onCancel={closeModalHandler}
               loading={(isFilialsLoading || isOrganizationsLoading)}
               width={'600px'}
               maskClosable={false}
               footer={() => (
                   <Flex justify={'space-between'} align={'center'}>
                       <Badge color={'blue'} count={extras?.length}>
                           {selectedHotelId == 327 &&
                               <Button onClick={() => setVisibleExtrasModal(true)}>Дополнительные услуги</Button>
                           }
                       </Badge>
                       <Flex>
                           <Button style={{marginLeft: 5}} onClick={closeModalHandler}>Отмена</Button>
                           <Button disabled={isUpdateGuestLoading || isCreateGuestLoading} style={{marginLeft: 5}} type={'primary'}
                                   onClick={confirmHandler}>{props.selectedGuest ? "Сохранить" : "Создать"}</Button>
                       </Flex>
                   </Flex>
               )}
        >
            <Button onClick={() => setVisibleHistoryModal(true)} type={'text'} style={{fontSize: 16, position: 'absolute', top: 13, right: 47}} icon={<HistoryOutlined/>}></Button>
            {messageContextHolder}
            {(visibleSelectGuestModal && selectedOrganization && organizations) &&
                <SelectGuestFromOrgModal organizations={organizations} setMale={setMale} setLastname={setLastname} setFirstname={setFirstname} setSecondName={setSecondName}
                                         selectedOrganization={selectedOrganization}
                                         visible={visibleSelectGuestModal}
                                         setVisible={setVisibleSelectGuestModal} showSuccessMsg={showWarningMsg}/>}
            {(visibleHistoryModal && history) && <HistoryModal visible={visibleHistoryModal} setVisible={setVisibleHistoryModal} history={history}/>}
            {(visibleExtrasModal && props.selectedGuest?.id) && <GuestExtrasModal visible={visibleExtrasModal} setVisible={setVisibleExtrasModal} guestId={props.selectedGuest.id}/>}
            <Flex gap={'middle'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 155}}>Работник</div>
                    <Checkbox checked={isEmployee} onChange={switchIsEmployerHandler}
                    />
                </Flex>
                {isEmployee &&
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
                }
                {!isEmployee &&
                    <Flex align={"center"}>
                        <div style={{width: 155}}>Член семьи работника</div>
                        <Checkbox checked={isFamilyMemberOfEmployee} onChange={switchIsFamilyMemberOfEmployeeHandler}
                        />
                    </Flex>
                }
                {isFamilyMemberOfEmployee &&
                    <Flex align={"center"}>
                        <div style={{width: 155}}>Табельный члена семьи</div>
                        <InputNumber style={{width: 300}} value={familyTabnum} onChange={(e) => setFamilyTabnum(e)}/>
                        <Button disabled={isGetFioByFamilyTabnumLoading} style={{marginLeft: 5, width: 92}} onClick={() => {
                            if (familyTabnum) getFioByFamilyTabnum(familyTabnum);
                        }}>Проверить</Button>
                    </Flex>
                }
                <Flex align={"center"}>
                    <div style={{width: 220}}>Организация</div>
                    <Flex vertical={true}>
                        <Select
                            disabled={isEmployee}
                            value={selectedOrganization ? selectedOrganization.id : null}
                            placeholder={"Выберите организацию"}
                            style={{width: 397}}
                            onChange={selectOrganizationHandler}
                            options={organizations?.filter((org: OrganizationModel) => {
                                if (isEmployee) return true;
                                else return org.id !== 11;
                            }).map((o: OrganizationModel) => ({
                                value: o.id,
                                label: o.name,
                                hui: o
                            }))}
                            allowClear={true}
                            showSearch
                            filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                            filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                        />
                    </Flex>
                </Flex>
                {(!isEmployee && selectedOrganization) &&
                    <Flex align={"center"} justify={'space-between'}>
                        <div style={{width: 420}}>Вы можете выбрать жильца из таблицы, если он заселялся ранее</div>
                        <Button onClick={() => setVisibleSelectGuestModal(true)}>Выбрать</Button>
                    </Flex>
                }
                <Flex align={"center"}>
                    <div style={{width: 220}}>Фамилия</div>
                    <Input disabled={isEmployee} value={lastname ?? ""} onChange={(e) => setLastname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Имя</div>
                    <Input disabled={isEmployee} value={firstname ?? ""} onChange={(e) => setFirstname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Отчество</div>
                    <Input disabled={isEmployee} value={secondName ?? ""} onChange={(e) => setSecondName(e.target.value)}/>
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
                    <div style={{width: 220}}>Номер марш. листа / служебного задания</div>
                    <Input value={memo} onChange={(e) => setMemo(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Основание</div>
                    <Flex vertical={true}>
                        <Select
                            loading={isContractsLoading}
                            value={reason ? reason.id : null}
                            placeholder={"Выберите основание"}
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
                        placeholder={"Выберите способо оплаты"}
                        style={{width: 560}}
                        onChange={selectBillingHandler}
                        //options={[{value: "наличный расчет", label: "наличный расчет"}, {value: "безналичный расчет", label: "безналичный расчет"}]}
                        options={billings?.map((b: string) => ({value: b, label: b}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                {billing == "наличный расчет" &&
                    <Flex align={"center"}>
                        <div style={{width: 220}}>Кредитной картой</div>
                        <Checkbox onChange={(e) => setIsCreditCard(e.target.checked)} checked={isCreditCard ?? false}/>
                    </Flex>
                }
                <Flex align={"center"}>
                    <div style={{width: 220}}>Договор</div>
                    <Flex vertical={true}>
                        <Select
                            loading={isContractsLoading}
                            value={selectedContract ? selectedContract.id : null}
                            placeholder={"Перед выбором договора заполните предыдущие поля"}
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
                    <div style={{width: 250}}>Регистрация по месту пребывания</div>
                    <Checkbox onChange={(e) => setRegPoMestu(e.target.checked)} checked={regPoMestu}/>
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
                    {(errorCode == 1 && updatedGuest) &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`Указанные даты пересекают существующий период проживания работника ${updatedGuest?.lastname} ${updatedGuest?.firstname} ${updatedGuest?.secondName} (с ${updatedGuest?.dateStart} по ${updatedGuest?.dateFinish}) 
                        в филиале: "${updatedGuest?.bed.room.flat.hotel.filial.name}", общежитии: "${updatedGuest?.bed.room.flat.hotel.name}", секции: "${updatedGuest?.bed.room.flat.name}", комнате  "${updatedGuest?.bed.room.name}", месте  "${updatedGuest?.bed.name}"`}
                               showIcon/>
                    }
                    {(errorCode == 1 && createdGuest) &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`Указанные даты пересекают существующий период проживания работника ${createdGuest?.lastname} ${createdGuest?.firstname} ${createdGuest.secondName} (с ${createdGuest?.dateStart} по ${createdGuest?.dateFinish}) 
                        в филиале: "${createdGuest?.bed.room.flat.hotel.filial.name}", общежитии: "${createdGuest?.bed.room.flat.hotel.name}", секции: "${createdGuest?.bed.room.flat.name}", комнате  "${createdGuest?.bed.room.name}", месте  "${createdGuest?.bed.name}"`}
                               showIcon/>
                    }
                    {errorCode == 2 &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`На указанный период комната отмечена статусом "Занято", проверьте тайм-лайн статусов в карточке секции.`}
                               showIcon/>
                    }
                    {errorCode == 3 &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`На указанный период секция отмечена статусом "Занято", проверьте тайм-лайн статусов в карточке секции.`}
                               showIcon/>
                    }
                    {errorCode == 4 &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`На указанный период комната отмечена статусом "Выкуплено организацией", проверьте тайм-лайн статусов в карточке секции.`}
                               showIcon/>
                    }
                    {errorCode == 5 &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`На указанный период секция отмечена статусом "Выкуплено организацией", проверьте тайм-лайн статусов в карточке секции.`}
                               showIcon/>
                    }
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Филиал</div>
                    <Select
                        disabled={props.isAddressDisabled}
                        loading={isFilialsLoading}
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
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
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Секция</div>
                    <Select
                        allowClear={true}
                        value={selectedFlatId}
                        loading={isFlatsLoading}
                        disabled={isFlatsLoading}
                        placeholder={"Выберите секцию"}
                        style={{width: '100%'}}
                        onChange={(e) => selectFlatHandler(e)}
                        onClear={() => selectFlatHandler()}
                        options={flats.map((flat: FlatModel) => ({value: flat.id, label: flat.name}))}
                        labelRender={(params) => (<LabelOptionRender params={params}/>)}
                        optionRender={(params) => (<SelectOptionRender params={params}/>)}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Комната</div>
                    <Select
                        allowClear={true}
                        value={selectedRoomId}
                        loading={isRoomsLoading}
                        disabled={isRoomsLoading}
                        placeholder={"Выберите комнату"}
                        style={{width: '100%'}}
                        onChange={(e) => selectRoomHandler(e)}
                        onClear={() => selectRoomHandler()}
                        options={rooms.map((room: RoomModel) => ({value: room.id, label: room.name}))}
                        labelRender={(params) => (<LabelOptionRender params={params}/>)}
                        optionRender={(params) => (<SelectOptionRender params={params}/>)}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Место</div>
                    <Select
                        allowClear={true}
                        value={selectedBedId}
                        loading={isBedsLoading}
                        placeholder={"Выберите койко-место"}
                        disabled={isBedsLoading || isExtra}
                        style={{width: '100%'}}
                        onChange={(e) => selectBedHandler(e)}
                        onClear={() => selectBedHandler()}
                        options={beds.map((bed: BedModel) => ({value: bed.id, label: bed.name}))}
                        labelRender={(params) => (<LabelOptionRender params={params}/>)}
                        optionRender={(params) => (<SelectOptionRender params={params}/>)}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
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
