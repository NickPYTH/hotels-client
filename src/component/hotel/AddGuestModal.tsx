import React, {useEffect, useState} from 'react';
import {Alert, Button, Checkbox, DatePicker, Flex, Input, InputNumber, message, Modal, Select} from 'antd';
import dayjs, {Dayjs} from "dayjs";
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {hotelAPI} from "../../service/HotelService";
import {HotelModel} from "../../model/HotelModel";
import {flatAPI} from "../../service/FlatService";
import {FlatModel} from "../../model/FlatModel";
import {GuestModel} from "../../model/GuestModel";
import {guestAPI} from "../../service/GuestService";
import {RoomModel} from "../../model/RoomModel";
import {roomAPI} from "../../service/RoomService";
import {contractAPI} from "../../service/ContractService";
import {OrganizationModel} from "../../model/OrganizationModel";
import {reasonAPI} from "../../service/ReasonService";
import {ReasonModel} from "../../model/ReasonModel";
import {ContractModel} from "../../model/ContractModel";
import {SelectGuestFromOrgModal} from "./SelectGuestFromOrgModal";
import {BedModel} from "../../model/BedModel";

const {RangePicker} = DatePicker;

type ModalProps = {
    flat: FlatModel,
    room: RoomModel,
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    showSuccessMsg: Function,
    bedNumber: number | null;
}

export const AddGuestModal = (props: ModalProps) => {

    // States
    const [messageApi, messageContextHolder] = message.useMessage();
    const [isEmployee, setIsEmployee] = useState(true);
    const [contracts, setContracts] = useState<ContractModel[]>([]);
    const [memo, setMemo] = useState("");
    const [billing, setBilling] = useState("");
    const [osnovanie, setOsnovanie] = useState("");
    const [isOsnovanieCustom, setIsOsnovanieCustom] = useState(false);
    const [isOrgCustom, setIsOrgCustom] = useState(false);
    const [regPoMestu, setRegPoMestu] = useState(false);
    const [tabnum, setTabnum] = useState<number | null>(null);
    const [firstname, setFirstname] = useState("");
    const [lastname, setLastname] = useState("");
    const [secondName, setSecondName] = useState("");
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [selectedOrgId, setSelectedOrgId] = useState<number | null>(11);
    const [customOrgName, setCustomOrgName] = useState<string | null>(null);
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null);
    const [selectedFlatId, setSelectedFlatId] = useState<number | null>(null);
    const [selectedRoomId, setSelectedRoomId] = useState<number | null>(null);
    const [selectedBedId, setSelectedBedId] = useState<number | null>(null);
    const [selectedContractId, setSelectedContractId] = useState<number | null>(null);
    const [visibleSelectGuestModal, setVisibleSelectGuestModal] = useState(false);
    const [male, setMale] = useState(true);
    const [loading, setLoading] = useState(false);
    // -----

    // Web requests
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    const [getContracts, {
        data: contractsFromRequest,
        isLoading: isContracstLoading
    }] = contractAPI.useGetAllMutation();
    const [getAllReasons, {
        data: reasons,
        isLoading: isReasonsLoading
    }] = reasonAPI.useGetAllMutation();
    const [getAllHotels, {
        data: hotels,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation();
    const [getAllFlats, {
        data: flats,
        isLoading: isFlatsLoading
    }] = flatAPI.useGetAllMutation();
    const [getAllOrganizations, {
        data: organizations,
        isLoading: isOrganizationsLoading
    }] = contractAPI.useGetAllOrganizationMutation();
    const [getAllRooms, {
        data: rooms,
        isLoading: isRoomsLoading
    }] = roomAPI.useGetAllMutation();
    const [getAllBeds, {
        data: beds,
        isLoading: isBedsLoading
    }] = roomAPI.useGetAllBedsMutation();
    const [createGuest, {
        data: createdGuest,
        isLoading: isCreateGuestLoading
    }] = guestAPI.useCreateMutation();
    const [getFioByTabnum, {
        data: fioByTabnum,
        isLoading: isGetFioByTabnumLoading
    }] = guestAPI.useGetFioByTabnumMutation();
    // -----

    // Useful utils
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Effects
    useEffect(() => {
        if (contractsFromRequest && selectedHotelId) {
            if (selectedHotelId === 327) {// Если гостинница Ермак, то доп фильтр по комнате
                if (isEmployee)
                    setContracts(contractsFromRequest.filter((c: ContractModel) => c.roomNumber === Number.parseInt(props.flat.name) && c.organizationId === 11 && c.hotelId === selectedHotelId));
                else
                    setContracts(contractsFromRequest.filter((c: ContractModel) => c.roomNumber === Number.parseInt(props.flat.name) && c.organizationId !== 11 && c.hotelId === selectedHotelId));
            } else {
                setContracts(contractsFromRequest.filter((c: ContractModel) => c.organizationId !== 11 && c.hotelId === selectedHotelId));
            }
        }
    }, [contractsFromRequest, selectedHotelId, isEmployee]);
    useEffect(() => {
        if (!isOrgCustom) {
            if (contractsFromRequest && selectedOrgId && osnovanie && billing) {
                let reason = reasons?.find((r: ReasonModel) => r.name === osnovanie);
                if (selectedHotelId === 327) {// Если гостинница Ермак, то доп фильтр по комнате
                    setContracts(contractsFromRequest.filter((c: ContractModel) => c.organizationId === selectedOrgId
                        && c.hotelId === selectedHotelId
                        && c.billing === billing
                        && c.reasonId === reason?.id
                        && c.roomNumber === Number.parseInt(props.flat.name)
                    ));
                } else {
                    setContracts(contractsFromRequest.filter((c: ContractModel) => c.organizationId === selectedOrgId
                        && c.hotelId === selectedHotelId
                        && c.billing === billing
                        && c.reasonId === reason?.id
                    ));
                }
            }
        } else {
            if (contractsFromRequest) {
                let contract = contractsFromRequest.filter((c: ContractModel) => c.organizationId === 2 && c.hotelId === selectedHotelId);
                if (selectedHotelId === 327) {// Если гостинница Ермак, то доп фильтр по комнате
                    contract = contractsFromRequest.filter((c: ContractModel) => c.roomNumber === Number.parseInt(props.flat.name) && c.organizationId === 2 && c.hotelId === selectedHotelId);
                }
                if (contract.length > 0) {
                    setContracts(contract);
                    setOsnovanie(contract[0].reason ?? "");
                    setBilling(contract[0].billing ?? "");
                    setSelectedContractId(contract[0].id);
                }
            }
        }
    }, [selectedOrgId, osnovanie, billing, isOrgCustom]);
    useEffect(() => {
        if (osnovanie) {
            let reason = reasons?.find((r: ReasonModel) => r.name === osnovanie);
            if (reason?.id === 4 || reason?.id === 3) {  //Есди командировка или вахта то безналичная
                setBilling("безналичный расчет");
            }
        }
    }, [osnovanie]);
    useEffect(() => {
        if (props.room) {
            setSelectedFilialId(props.room.filialId);
            setSelectedHotelId(props.room.hotelId);
            setSelectedFlatId(props.room.flatId);
            setSelectedRoomId(props.room.id);
            setSelectedBedId(props.bedNumber);
            getAllHotels({filialId: props.room.filialId.toString()});
            getAllFlats({hotelId: props.room.flatId.toString(), date: dayjs().format('DD-MM-YYYY HH:mm')});
            getAllRooms(props.room.flatId.toString());
        }
    }, [props.room]);
    useEffect(() => {
        if (fioByTabnum) {
            setFirstname(fioByTabnum.firstname);
            setLastname(fioByTabnum.lastname);
            setSecondName(fioByTabnum.secondName);
            setMale(fioByTabnum.male);
        }
    }, [fioByTabnum]);
    useEffect(() => {
        getContracts();
        getAllOrganizations();
        getAllFilials();
        getAllReasons();
    }, []);
    useEffect(() => {
        setOsnovanie("");
    }, [isOsnovanieCustom]);
    useEffect(() => {
        if (selectedFilialId)
            getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    useEffect(() => {
        if (selectedHotelId)
            getAllFlats({hotelId: selectedHotelId.toString(), date: dayjs().format("DD-MM-YYYY HH:mm")});
    }, [selectedHotelId]);
    useEffect(() => {
        if (selectedFlatId)
            getAllRooms(selectedFlatId.toString());
    }, [selectedFlatId]);
    useEffect(() => {
        if (selectedRoomId) {
            getAllBeds(selectedRoomId);
        }
    }, [selectedRoomId]);
    useEffect(() => {
        if (createdGuest) {
            props.showSuccessMsg("Работник добавлен");
            setLoading(true)
            setTimeout(() => {
                if (!createdGuest.error) {
                    props.setVisible(false);
                    props.refresh();
                } else {
                    console.log(createdGuest.error);
                }
                setLoading(false);
            }, 2000);
        }
    }, [createdGuest]);
    useEffect(() => {
        setCustomOrgName(null);
        setIsOrgCustom(false);
        if (isEmployee) setSelectedOrgId(11);
        else setSelectedOrgId(null);
    }, [isEmployee]);
    useEffect(() => {
        if (selectedContractId) {
            let contract: ContractModel | undefined = contracts.find((c: ContractModel) => c.id === selectedContractId);
            if (contract) {
                setBilling(contract.billing);
                setOsnovanie(contract.reason);
            }
        }
    }, [selectedContractId]);
    // -----

    // Handlers
    const confirmHandler = () => {
        if (contracts)
            if (selectedContractId === null) {
                showWarningMsg("Вы не выбрали договор");
                return;
            }
        if (firstname && lastname && secondName && dateRange && selectedFlatId && selectedRoomId && memo && male !== null) {
            let dateStart = dateRange[0].format("DD-MM-YYYY HH:mm");
            let dateFinish = dateRange[1].format("DD-MM-YYYY HH:mm");
            if (dateStart === dateFinish) {
                showWarningMsg("Дата и время заселения и выселения совпадают");
                return;
            }
            if (isEmployee && tabnum === null) {
                showWarningMsg("Не заполнен табельный номер");
                return;
            }
            if (dateStart.includes("00:00")) dateStart = dateStart.replace("00:00", "12:00");
            if (dateFinish.includes("00:00")) dateFinish = dateFinish.replace("00:00", "12:00");
            let guest: GuestModel = {
                dateFinish,
                dateStart,
                filialName: "",
                filialId: 0,
                firstname,
                flatId: 0,
                flatName: "",
                hotelName: "",
                hotelId: 0,
                id: null,
                lastname,
                note: "",
                secondName,
                roomId: selectedRoomId,
                roomName: "",
                tabnum: isEmployee ? tabnum : null,
                organization: organizations?.find((o: OrganizationModel) => o.id === selectedOrgId)?.name ?? (customOrgName ?? ""),
                regPoMestu: regPoMestu,
                memo: memo,
                billing: billing,
                reason: osnovanie,
                male,
                contractId: selectedContractId ?? undefined,
                bedName: props.bedNumber ?? undefined,
                bedId: props.bedNumber ?? undefined,
            };
            createGuest(guest);
        } else showWarningMsg("Некоторые поля остались не заполнены");
    };
    // -----

    return (
        <Modal title={"Заселение"}
               open={props.visible}
               loading={(isFilialsLoading || isCreateGuestLoading || isOrganizationsLoading || loading)}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={"Заселить"}
               width={'600px'}
               maskClosable={false}
        >
            {messageContextHolder}
            {/*{(visibleSelectGuestModal && selectedOrgId) &&*/}
            {/*    <SelectGuestFromOrgModal setMale={setMale} setLastname={setLastname} setFirstname={setFirstname} setSecondName={setSecondName} orgId={selectedOrgId} visible={visibleSelectGuestModal}*/}
            {/*                             setVisible={setVisibleSelectGuestModal} showSuccessMsg={showWarningMsg}/>}*/}
            <Flex gap={'middle'} vertical={true}>
                <Flex align={"center"}>
                    <div style={{width: 155}}>Работник</div>
                    <Checkbox checked={isEmployee} onChange={(e) => setIsEmployee(e.target.checked)}/>
                </Flex>
                {isEmployee &&
                    <Flex align={"center"}>
                        <div style={{width: 220}}>Табельный</div>
                        <InputNumber disabled={isGetFioByTabnumLoading} style={{width: 450}} value={tabnum} onChange={(e) => setTabnum(e)}/>
                        <Button disabled={isGetFioByTabnumLoading} style={{marginLeft: 5}} onClick={() => {
                            if (tabnum) getFioByTabnum(tabnum);
                        }}>Найти</Button>
                    </Flex>
                }
                <Flex align={"center"}>
                    <div style={{width: 220}}>Организация</div>
                    <Flex vertical={true}>
                        {!isOrgCustom ?
                            <Select
                                disabled={isEmployee}
                                value={selectedOrgId}
                                placeholder={"Выберите организацию"}
                                style={{width: 397}}
                                onChange={(e) => setSelectedOrgId(e)}
                                options={organizations?.map((o: OrganizationModel) => ({
                                    value: o.id,
                                    label: o.name
                                }))}
                            />
                            :
                            <Input disabled={isEmployee} style={{width: 397}} value={customOrgName ?? ""} onChange={(e) => setCustomOrgName(e.target.value)}/>
                        }
                        <Flex style={{marginTop: 5}}>
                            Иная организация(заполнить поле вручную)
                            <Checkbox disabled={isEmployee} style={{marginLeft: 5}} checked={isOrgCustom} onChange={(e) => setIsOrgCustom(e.target.checked)}/>
                        </Flex>
                    </Flex>
                </Flex>
                {(!isEmployee && selectedOrgId && !isOrgCustom) &&
                    <Flex align={"center"} justify={'space-between'}>
                        <div style={{width: 420}}>Вы можете выбрать жильца из таблицы, если он заселялся ранее</div>
                        <Button onClick={() => setVisibleSelectGuestModal(true)}>Выбрать</Button>
                    </Flex>
                }
                <Flex align={"center"}>
                    <div style={{width: 220}}>Фамилия</div>
                    <Input disabled={isEmployee} value={lastname} onChange={(e) => setLastname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Имя</div>
                    <Input disabled={isEmployee} value={firstname} onChange={(e) => setFirstname(e.target.value)}/>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Отчество</div>
                    <Input disabled={isEmployee} value={secondName} onChange={(e) => setSecondName(e.target.value)}/>
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
                            loading={isReasonsLoading}
                            value={osnovanie}
                            placeholder={"Выберите основание"}
                            style={{width: 397}}
                            onChange={(e) => setOsnovanie(e)}
                            options={reasons?.filter((r: ReasonModel) => r.isDefault).map((r: ReasonModel) => ({value: r.name, label: r.name}))}
                        />
                    </Flex>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Вид оплаты</div>
                    <Select
                        value={billing}
                        placeholder={"Выберите способ оплаты"}
                        style={{width: 560}}
                        onChange={(e) => setBilling(e)}
                        options={[{value: "наличный расчет", label: "наличный расчет"}, {value: "безналичный расчет", label: "безналичный расчет"}]}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Договор</div>
                    <Flex vertical={true}>
                        <Select
                            allowClear={true}
                            loading={isContracstLoading}
                            value={selectedContractId}
                            placeholder={"СНАЧАЛА ЗАПОЛНИТЕ ВСЕ ПОЛЯ!"}
                            style={{width: 397}}
                            onChange={(e) => setSelectedContractId(e)}
                            options={contracts?.filter((contractModel: ContractModel) => contractModel.year === 2025)?.map((contractModel: ContractModel) => ({
                                value: contractModel.id,
                                label: `Год: ${contractModel.year} №: ${contractModel.docnum}`
                            }))}
                        />
                    </Flex>
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 250}}>Регистрация по месту пребывания</div>
                    <Checkbox onChange={(e) => setRegPoMestu(e.target.checked)} checked={regPoMestu}/>
                </Flex>
                <Flex vertical={true} align={"center"}>
                    {/*//@ts-ignore*/}
                    <RangePicker showTime showSecond={false} format={"DD-MM-YYYY HH:mm"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }} style={{width: 550}}/>
                    {createdGuest?.error === "Dates range error" &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`Указанные даты пересекают существующий период проживания работника (с ${createdGuest.dateStart} по ${createdGuest.dateFinish}) 
                        в общежитии: "${createdGuest.hotelName} в филиале: ${createdGuest.filialName}", в комнате: "${createdGuest.flatName}"`} showIcon/>
                    }
                    {createdGuest?.error === "Room busy" &&
                        <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                               description={`Указанные даты пересекают период проживания работника: ${createdGuest.note} (с ${createdGuest.dateStart} по ${createdGuest.dateFinish}) 
                        в общежитии: "${createdGuest.hotelName} в филиале: ${createdGuest.filialName}", в комнате: "${createdGuest.flatName}"`} showIcon/>
                    }
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Филиал</div>
                    <Select
                        disabled={true}
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={filials?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Общежитие</div>
                    <Select
                        value={selectedHotelId}
                        loading={isHotelsLoading}
                        disabled={true}
                        placeholder={"Выберите общежитие"}
                        style={{minWidth: 395, maxWidth: 395}}
                        onChange={(e) => setSelectedHotelId(e)}
                        options={hotels?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Секция</div>
                    <Select
                        value={selectedFlatId}
                        loading={isFlatsLoading}
                        disabled={true}
                        placeholder={"Выберите секцию"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedFlatId(e)}
                        options={flats?.map((flat: FlatModel) => ({value: flat.id, label: flat.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Комната</div>
                    <Select
                        value={selectedRoomId}
                        loading={isRoomsLoading}
                        placeholder={"Выберите комнату"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedRoomId(e)}
                        options={rooms?.map((room: RoomModel) => ({value: room.id, label: room.name}))}
                    />
                </Flex>
                <Flex align={"center"}>
                    <div style={{width: 220}}>Место</div>
                    <Select
                        value={selectedBedId}
                        loading={isBedsLoading}
                        placeholder={"Выберите койко-место"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedBedId(e)}
                        options={beds?.map((bed: BedModel) => ({value: bed.id, label: bed.name}))}
                    />
                </Flex>
            </Flex>
        </Modal>
    );
};
