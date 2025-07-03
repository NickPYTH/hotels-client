import React, {useEffect, useState} from 'react';
import {Button, Checkbox, DatePicker, Flex, Input, Modal, Select, Table, TableProps, Tag, TimePicker, Upload, UploadProps} from 'antd';
import {InboxOutlined} from "@ant-design/icons";
import {host} from "shared/config/constants";
import {GuestModel} from "entities/GuestModel";
import {ReasonModel} from "entities/ReasonModel";
import {reasonAPI} from "service/ReasonService";
import {ContractModel} from "entities/ContractModel";
import {contractAPI} from "service/ContractService";
import dayjs, {Dayjs} from "dayjs";
import {GuestModal} from "shared/component/GuestModal";
import {ContractCellRender} from 'shared/component/ContractCellRender';
import {DatesCellRender} from "shared/component/DatesCellRender";
import {FlatRoomCellRenderer} from "shared/component/FlatRoomCellRender";

const {Dragger} = Upload;

type ModalProps = {
    filialId: number,
    hotelName: string,
    hotelId: number
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    showWarningMsg: Function,
}

export const GroupGuestModal = (props: ModalProps) => {

    // States
    const [mode, setMode] = useState<boolean>(false); // 0 - by tab, 1 - by fio
    const [data, setData] = useState<GuestModel[] | null>(null); // Данные в таблице
    const [reason, setReason] = useState<ReasonModel | null>(null); // Основание
    const [billing, setBilling] = useState<string | null>(null); // Вид оплаты
    const [contractsFiterByAdmAndHotel, setContractsFiterByAdmAndHotel] = useState<ContractModel[]>([]);
    const [contracts, setContracts] = useState<ContractModel[]>([]);  // Список доступных договоров (осторожно фильтруется после получения с сервера) фильтр по оргам и году и отелю
    const [selectedContract, setSelectedContract] = useState<ContractModel | null>(null); // Выбранный договора
    const [visibleGuestModal, setVisibleGuestModal] = useState(false);
    const [dateStart, setDateStart] = useState<Dayjs | null>(null); // Дата заселения
    const [timeStart, setTimeStart] = useState<Dayjs>(dayjs('12:00', 'HH:mm')); // Время заселения
    const [dateFinish, setDateFinish] = useState<Dayjs | null>(null); // Дата выселения
    const [timeFinish, setTimeFinish] = useState<Dayjs>(dayjs('12:00', 'HH:mm')); // Время выселения
    const [selectedRecord, setSelectedRecord] = useState<GuestModel | null>(null);
    const [s, ss] = useState(true);
    // -----

    // Useful utils
    const columns: TableProps<GuestModel>['columns'] = [
        {
            title: 'Табельный номер',
            dataIndex: 'tabnum',
            key: 'tabnum',
            sorter: (a, b) => (a.tabnum ?? 0) - (b.tabnum ?? 0),
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastname',
            key: 'lastname',
        },
        {
            title: 'Имя',
            dataIndex: 'firstname',
            key: 'firstname',
        },
        {
            title: 'Отчество',
            dataIndex: 'secondName',
            key: 'secondName',
        },
        {
            title: 'Договор',
            dataIndex: 'contract',
            key: 'contract',
            render: (val, record: GuestModel) => (
                <ContractCellRender tabnum={record.tabnum} selectedContract={record.contract} reasons={reasons ?? []} contracts={contractsFiterByAdmAndHotel} setGridData={setData} hotelId={props.hotelId}/>)
        },
        {
            title: 'Даты проживания',
            dataIndex: 'dates',
            key: 'dates',
            render: (val, record: GuestModel) => (<DatesCellRender tabnum={record.tabnum} dateTimeStart={record.dateStart} dateTimeFinish={record.dateFinish} setGridData={setData}/>)
        },
        {
            title: 'Секция и комната',
            dataIndex: 'flatName',
            key: 'flatName',
            render: (val, record: GuestModel) => (
                <FlatRoomCellRenderer s={s} tabnum={record.tabnum} showWarningMsg={props.showWarningMsg} dateStart={record.dateStart} dateFinish={record.dateFinish} setGridData={setData}
                                      bed={record.bed} hotelId={props.hotelId}/>)
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (val, record: any) => (<Tag style={{marginLeft: 15}} color={record?.status == "Заселен" ? 'success' : 'volcano'}>
                {record?.status == "Заселен" ? 'Заселен' : 'Не обработан'}
            </Tag>)
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (val, record: any) => (<Button disabled={record.status === "Заселен"}
                                                   onClick={() => {
                                                       setSelectedRecord(record);
                                                       setVisibleGuestModal(true);
                                                   }}>Заселить</Button>)
        },
    ]
    const uploadProps: UploadProps = {
        name: 'file',
        multiple: false,
        action: `${host}/hotels/api/guest/manyGuestUpload?mode=${mode}`,
        onChange(info) {
            const {status} = info.file;
            if (status !== 'uploading') {
            }
            if (status === 'done') {
                setData(info.file.response.map((record: any) => ({...record, status: "Не обработан"})));
                props.showWarningMsg(`${info.file.name} обработан успешно.`);
            } else if (status === 'error') {
                props.showWarningMsg(`${info.file.name} обработан неудачно.`);
            }
        },
        onDrop(e) {
            console.log('Dropped files', e.dataTransfer.files);
        },
    };
    // -----

    // Web requests
    const [getContracts, {
        data: contractsFromRequest,
        isLoading: isContractsLoading
    }] = contractAPI.useGetAllMutation(); // Получение всех договоров
    const [getAllReasons, {
        data: reasons,
        isLoading: isReasonsLoading
    }] = reasonAPI.useGetAllMutation(); // Получение всех оснований
    // -----

    // Effects
    useEffect(() => {
        getContracts();
        getAllReasons();
    }, [])
    useEffect(() => {
        if (contractsFromRequest) {
            setContractsFiterByAdmAndHotel(contractsFromRequest.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id == 11 && c.hotel.id == props.hotelId));
            setContracts(contractsFromRequest.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id == 11 && c.hotel.id == props.hotelId));
        }
    }, [contractsFromRequest]);
    // -----

    // Handlers
    const selectReasonHandler = (reasonId: number) => {
        let reason = reasons?.find((r: ReasonModel) => r.id == reasonId);
        setReason(reason ? reason : null);
        setSelectedContract(null);
        setContracts(contractsFromRequest?.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id == 11 && c.hotel.id == props.hotelId
            && (billing ? c.billing == billing : true) && (reason ? c.reason.id == reason?.id : true)) ?? contracts);

    }
    const selectBillingHandler = (billing: string) => {
        setBilling(billing);
        setSelectedContract(null);
        setContracts(contractsFromRequest?.filter((c: ContractModel) => c.year == dayjs().year() && c.organization.id == 11 && c.hotel.id == props.hotelId
            && (reason ? c.reason == reason : true) && c.billing == billing) ?? contracts);

    }
    const selectContractHandler = (contractId: number) => {
        let contract = contracts.find((c: ContractModel) => c.id == contractId);
        if (contract) {
            setBilling(contract.billing);
            setReason(contract.reason);
            setSelectedContract(contract);
        }
    }
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
    const fillTableHandler = () => {
        if (selectedContract && reason && billing && dateStart && dateFinish) {
            if (dateStart.isAfter(dateFinish)) {
                props.showWarningMsg("Дата заселения указана после даты выселения");
                return;
            }
            setData((guests: GuestModel[]) => {
                let tmp: GuestModel[] = JSON.parse(JSON.stringify(guests));
                return tmp.map((guest: GuestModel) => ({
                    ...guest,
                    reason,
                    billing,
                    contract: selectedContract,
                    dateStart: `${dateStart.format("DD-MM-YYYY")} ${timeStart.format("HH:mm")}`,
                    dateFinish: `${dateFinish.format("DD-MM-YYYY")} ${timeFinish.format("HH:mm")}`

                }))
            });
        } else props.showWarningMsg("Некторые поля остались пустыми");
    }
    // -----

    return (
        <Modal title={`Массовая загрузка жильцов`}
               open={props.visible}
               onCancel={() => {
                   if (window.confirm("Вы уверены что хотите закрыть окно расселения?")) props.setVisible(false);
               }}
               footer={() => (<></>)}
               width={window.innerWidth - 10}
               maskClosable={false}
        >
            {(visibleGuestModal && selectedRecord) &&
                <GuestModal
                    semiAutoParams={selectedRecord}
                    setGuests={() => {
                    }}
                    showSuccessMsg={() => {
                    }}
                    isAddressDisabled={false}
                    selectedGuest={null}
                    visible={visibleGuestModal}
                    setVisible={setVisibleGuestModal}
                    refresh={(guest: GuestModel) => {
                        if (guest) {
                            setData((prev: GuestModel[]) => {
                                return prev.map((g: GuestModel) => {
                                    if (g.tabnum == guest.tabnum)
                                        return {...g, status: "Заселен"}; // Todo
                                    else return g;
                                })
                            });
                            ss(p => !p);
                        }
                    }}/>}
            {data == null &&
                <Flex gap={'small'} vertical={true} style={{marginBottom: 5}}>
                    <Flex align={"center"}>
                        <div style={{width: 300}}>Загрузить список табельный номеров</div>
                        <Checkbox checked={mode} onChange={(e) => setMode(e.target.checked)}/>
                    </Flex>
                    <Dragger {...uploadProps}>
                        <p className="ant-upload-drag-icon">
                            <InboxOutlined/>
                        </p>
                        <p className="ant-upload-text">Нажмите или перетащите файл в эту область для загрузки</p>
                        <p className="ant-upload-hint">
                            {!mode ?
                                "Поддерживаются файлы формата xlsx, в которых в первой колонке находится 'Фамилия',  во второй 'Имя', в третьей 'Отчество'. Учитывается что у файла есть шапка в 1-ой строке, поэтому ФИО считываются со 2-ой строки таблицы."
                                :
                                "Поддерживаются файлы формата xlsx, в которых в первой колонке находятся табельные номера, Учитывается что у файла есть шапка в 1-ой строке, поэтому табельные номера считываются со 2-ой строки таблицы."
                            }
                        </p>
                    </Dragger>
                </Flex>
            }
            {data != null &&
                <Flex vertical={true}>
                    <Flex>
                        <Flex vertical={true}>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 120}}>Общежитие</div>
                                <Input disabled={true}
                                       style={{width: 300}}
                                       value={props.hotelName}
                                />
                            </Flex>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 120}}>Основание</div>
                                <Select
                                    allowClear
                                    loading={isReasonsLoading}
                                    value={reason ? reason.id : null}
                                    placeholder={"Выберите основание"}
                                    style={{width: 300}}
                                    onChange={selectReasonHandler}
                                    options={contractsFiterByAdmAndHotel?.reduce((acc:ContractModel[], contract:ContractModel) => {
                                        if (!acc.find((c:ContractModel) => c.reason.id == contract.reason.id)) return acc.concat(contract);
                                        return acc;
                                    }, []).map((c: ContractModel) => ({value: c.reason.id, label: c.reason.name}))}
                                />
                            </Flex>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 120}}>Вид оплаты</div>
                                <Select
                                    allowClear
                                    value={billing}
                                    placeholder={"Выберите способо оплаты"}
                                    style={{width: 300}}
                                    onChange={selectBillingHandler}
                                    options={contractsFiterByAdmAndHotel?.reduce((acc:ContractModel[], contract:ContractModel) => {
                                        if (!acc.find((c:ContractModel) => c.billing == contract.billing)) return acc.concat(contract);
                                        return acc;
                                    }, []).map((c: ContractModel) => ({value: c.billing, label: c.billing}))}
                                />
                            </Flex>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 120}}>Договор</div>
                                <Select
                                    allowClear
                                    loading={isContractsLoading}
                                    value={selectedContract ? selectedContract.id : null}
                                    placeholder={"Перед выбором договора заполните предыдущие поля"}
                                    style={{width: 300}}
                                    onChange={selectContractHandler}
                                    options={contracts?.map((contractModel: ContractModel) => ({value: contractModel.id, label: `№: ${contractModel.docnum}`}))}
                                />
                            </Flex>
                        </Flex>
                        <Flex vertical={true} style={{marginLeft: 15}}>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 150}}>Дата и время заезда</div>
                                <DatePicker placeholder={'Заезд'} format={'DD.MM.YYYY'} value={dateStart} onChange={selectStartDateHandler} style={{width: 140, marginRight: 5}} allowClear={false}/>
                                <TimePicker needConfirm={false} value={timeStart} style={{width: 140}} onChange={selectStartTimeHandler} minuteStep={15} showSecond={false} hourStep={1}
                                            allowClear={false}/>
                            </Flex>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 150}}>Дата и время выезда</div>
                                <DatePicker placeholder={'Выезд'} format={'DD.MM.YYYY'} value={dateFinish} onChange={selectFinishDateHandler} style={{width: 140, marginRight: 5}} allowClear={false}/>
                                <TimePicker needConfirm={false} value={timeFinish} style={{width: 140}} onChange={selectFinishTimeHandler} minuteStep={15} showSecond={false} hourStep={1}
                                            allowClear={false}/>
                            </Flex>
                            <Button onClick={fillTableHandler}>Применить заполненные параметры</Button>
                        </Flex>
                    </Flex>
                    <Table
                        bordered={true}
                        style={{width: '100vw'}}
                        columns={columns}
                        dataSource={data}
                        pagination={{
                            defaultPageSize: 20,
                        }}
                    />
                </Flex>
            }
        </Modal>
    );
};
