import React, {useEffect, useState} from 'react';
import {Alert, Button, Checkbox, DatePicker, Flex, InputNumber, Modal, Popconfirm, Select, Space, Table, TableProps, Tag, TimePicker, Upload, UploadProps} from 'antd';
import {InboxOutlined} from "@ant-design/icons";
import {host} from "shared/config/constants";
import dayjs, {Dayjs} from "dayjs";
import {DatesCellRender} from "shared/component/DatesCellRender";
import {FlatRoomCellRenderer} from "shared/component/FlatRoomCellRender";
import {ReservationModel} from "entities/ReservationModel";
import {filialAPI} from "service/FilialService";
import {FilialModel} from "entities/FilialModel";
import {HotelModel} from "entities/HotelModel";
import {hotelAPI} from "service/HotelService";
import {EventKindModel} from "entities/EventKindModel";
import {eventKindAPI} from "service/EventKindService";
import {ReservationModal} from "shared/component/ReservationModal";
import {reservationAPI} from "service/ReservationService";

const {Dragger} = Upload;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    showWarningMsg: Function,
}

// Table component
const TableComponent = (props: { columns: any, data: any }) => {
    return (<Table
        bordered={true}
        style={{width: '100vw', marginTop: 15}}
        columns={props.columns}
        dataSource={props.data}
        pagination={{
            defaultPageSize: 20,
        }}
    />)
}
const MemoizedTable = React.memo(TableComponent);
// -----

export const GroupReservationModal = (props: ModalProps) => {

    // States
    const [reservationMode, setReservationMode] = useState<number>(2);
    const [peopleCount, setPeopleCount] = useState<number | null>(1);
    const [mode, setMode] = useState<boolean>(false); // 0 - by tab, 1 - by fio
    const [data, setData] = useState<ReservationModel[] | null>(null); // Данные в таблице
    const [isVisibleReservationModal, setIsVisibleReservationModal] = useState(false);
    const [selectedReservation, setSelectedReservation] = useState<ReservationModel | null>(null);
    const [selectedFromFilialId, setSelectedFromFilialId] = useState<number | null>(null); // ИД филиала заказчика
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null); // ИД филиала
    const [selectedHotelId, setSelectedHotelId] = useState<number | null>(null); // ИД общежития
    const [selectedEventId, setSelectedEventId] = useState<number | null>(null);  // ИД выбранного мероприятия
    const [dateStart, setDateStart] = useState<Dayjs | null>(null); // Дата заселения
    const [timeStart, setTimeStart] = useState<Dayjs>(dayjs('12:00', 'HH:mm')); // Время заселения
    const [dateFinish, setDateFinish] = useState<Dayjs | null>(null); // Дата выселения
    const [timeFinish, setTimeFinish] = useState<Dayjs>(dayjs('12:00', 'HH:mm')); // Время выселения
    const [soloMode, setSoloMode] = useState(false);
    const [s, ss] = useState(true);
    // -----

    // Useful utils
    const columns: TableProps<ReservationModel>['columns'] = [
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
            title: 'Даты проживания',
            dataIndex: 'dates',
            key: 'dates',
            render: (val, record: ReservationModel) => (<DatesCellRender tabnum={record.tabnum} dateTimeStart={record.dateStart} dateTimeFinish={record.dateFinish} setGridData={setData}/>)
        },
        {
            title: 'Секция и комната',
            dataIndex: 'bed',
            key: 'bed',
            render: (val, record: ReservationModel) => (
                <FlatRoomCellRenderer hotelId={selectedHotelId} s={s} tabnum={record.tabnum} showWarningMsg={props.showWarningMsg} dateStart={record.dateStart} dateFinish={record.dateFinish}
                                      setGridData={setData} bed={record.bed}/>)
        },
        {
            title: 'Статус',
            dataIndex: 'statusGrid',
            key: 'statusGrid',
            render: (val, record: any) => (<Tag style={{marginLeft: 15}} color={record?.statusGrid == "Забронирован" ? 'success' : 'volcano'}>
                {record?.statusGrid == "Забронирован" ? 'Забронирован' : 'Не обработан'}
            </Tag>)
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (val, record: any) => (<Button style={{marginLeft: 15}} disabled={record?.statusGrid === "Забронирован"}
                                                   onClick={() => {
                                                       setSelectedReservation(record);
                                                       setIsVisibleReservationModal(true);
                                                   }}>Забронировать</Button>)
        },
    ]
    const uploadFileProps: UploadProps = {
        name: 'file',
        multiple: false,
        action: `${host}/hotels/api/reservation/manyReservationUpload?mode=${mode}`,
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
    const [getAllFilials, {
        data: filialsFromRequest,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation(); // Поулчение всех филиалов
    const [getAllHotels, {
        data: hotelsFromRequest,
        isLoading: isHotelsLoading
    }] = hotelAPI.useGetAllByFilialIdMutation(); // Получение отелей по ИД филиала
    const [getAllEvents, {
        data: events,
    }] = eventKindAPI.useGetAllMutation(); // Получение списка мероприятий
    const [checkSpaces, {
        data: checkSpacesData,
        isLoading: isCheckSpacesLoading
    }] = reservationAPI.useCheckSpacesMutation(); // Получение списка мероприятий
    // -----

    // Effects
    useEffect(() => {
        getAllEvents();
        getAllFilials();
    }, []);
    useEffect(() => {
        if (selectedFilialId) getAllHotels({filialId: selectedFilialId.toString()});
    }, [selectedFilialId]);
    // -----

    // Handlers
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
        if (dateStart && dateFinish) {
            if (dateStart.isAfter(dateFinish)) {
                props.showWarningMsg("Дата заселения указана после даты выселения");
                return;
            }
            setData((reservations: ReservationModel[]): any => {
                let tmp: ReservationModel[] = JSON.parse(JSON.stringify(reservations));
                let event = events?.find((e: EventKindModel) => e.id == selectedEventId);
                let filial = filialsFromRequest?.find((f: FilialModel) => f.id == selectedFromFilialId);
                return tmp.map((res: ReservationModel) => {
                    if (event && filial) return {
                        ...res,
                        fromFilial: filial,
                        event,
                        dateStart: `${dateStart.format("DD-MM-YYYY")} ${timeStart.format("HH:mm")}`,
                        dateFinish: `${dateFinish.format("DD-MM-YYYY")} ${timeFinish.format("HH:mm")}`
                    }
                })
            });
        } else props.showWarningMsg("Некторые поля остались пустыми");
    }
    const selectHotelHandler = (id: number | undefined = undefined) => {
        if (id !== undefined) setSelectedHotelId(id);
        else setSelectedHotelId(null);
    };
    const checkSpacesHandler = (needReserve: boolean) => {
        if (peopleCount && dateStart && dateFinish && selectedEventId && selectedHotelId) {
            checkSpaces({
                peopleCount,
                dateStart: dayjs(`${dateStart.format("DD-MM-YYYY")} ${timeStart.format("HH:mm")}`, "DD-MM-YYYY HH:mm").unix(),
                dateFinish: dayjs(`${dateFinish.format("DD-MM-YYYY")} ${timeFinish.format("HH:mm")}`, "DD-MM-YYYY HH:mm").unix(),
                eventId: selectedEventId,
                hotelId: selectedHotelId,
                needReserve,
                soloMode
            });
        }
    }
    // -----

    return (
        <Modal title={`Групповое бронирование`}
               open={props.visible}
               onCancel={() => {
                   if (window.confirm("Вы уверены что хотите закрыть окно бронирования?")) props.setVisible(false);
               }}
               footer={() => (<></>)}
               width={reservationMode == 2 ? 550 : window.innerWidth - 10}
               maskClosable={false}
        >
            {(isVisibleReservationModal && selectedReservation) &&
                <ReservationModal
                    semiAutoParams={selectedReservation}
                    selectedReservation={null}
                    visible={isVisibleReservationModal}
                    setVisible={setIsVisibleReservationModal}
                    refresh={(reservation: ReservationModel) => {
                        if (reservation) {
                            setData((prev: ReservationModel[]) => {
                                return prev.map((r: ReservationModel) => {
                                    if (r.tabnum == reservation.tabnum) return {...r, bed: reservation.bed, statusGrid: "Забронирован"};
                                    else return r;
                                })
                            });
                            ss(p => !p);
                        }
                    }}
                />
            }
            <Space direction='vertical'>
                <Space style={{marginBottom: 15}}>
                    Режим бронирования
                    <Select
                        style={{width: 350}}
                        value={reservationMode}
                        placeholder={"Выберите режим"}
                        onChange={(e) => setReservationMode(e)}
                        options={[{value: 1, label: "Персонифицированные брони"}, {value: 2, label: "Обезличенные брони"}]}
                    />
                </Space>

                {(data == null && reservationMode == 1) &&
                    <Flex gap={'small'} vertical={true} style={{marginBottom: 5}}>
                        <Flex align={"center"}>
                            <div style={{width: 300}}>Загрузить список табельный номеров</div>
                            <Checkbox checked={mode} onChange={(e) => setMode(e.target.checked)}/>
                        </Flex>
                        <Dragger {...uploadFileProps}>
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
                {(data != null && reservationMode == 1) &&
                    <Flex vertical={true}>
                        <Flex>
                            <Flex vertical={true}>
                                <Flex align={"center"} style={{marginBottom: 5}}>
                                    <div style={{width: 150}}>Филиал заказчик</div>
                                    <Select
                                        disabled={isFilialsLoading}
                                        loading={isFilialsLoading}
                                        value={selectedFromFilialId}
                                        placeholder={"Выберите филиал"}
                                        style={{minWidth: 395, maxWidth: 395}}
                                        onChange={(e) => setSelectedFromFilialId(e)}
                                        options={filialsFromRequest?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                                    />
                                </Flex>
                                <Flex align={"center"} style={{marginBottom: 5}}>
                                    <div style={{width: 150}}>Филиал</div>
                                    <Select
                                        disabled={isFilialsLoading}
                                        loading={isFilialsLoading}
                                        value={selectedFilialId}
                                        placeholder={"Выберите филиал"}
                                        style={{minWidth: 395, maxWidth: 395}}
                                        onChange={(e) => setSelectedFilialId(e)}
                                        options={filialsFromRequest?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                                    />
                                </Flex>
                                <Flex align={"center"} style={{marginBottom: 5}}>
                                    <div style={{width: 150}}>Общежитие</div>
                                    <Select
                                        allowClear={true}
                                        value={selectedHotelId}
                                        loading={isHotelsLoading}
                                        placeholder={"Выберите общежитие"}
                                        style={{minWidth: 395, maxWidth: 395}}
                                        onChange={(id) => selectHotelHandler(id)}
                                        onClear={() => selectHotelHandler()}
                                        options={hotelsFromRequest?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                                    />
                                </Flex>
                                <Flex align={"center"}>
                                    <div style={{width: 150}}>Мероприятие</div>
                                    <Select
                                        value={selectedEventId}
                                        placeholder={"Выберите мероприятие"}
                                        style={{minWidth: 395, maxWidth: 395}}
                                        onChange={(e) => setSelectedEventId(e)}
                                        options={events?.map((eve: EventKindModel) => ({value: eve.id, label: eve.name}))}
                                    />
                                </Flex>
                            </Flex>
                            <Flex vertical={true} style={{marginLeft: 15}}>
                                <Flex align={"center"} style={{marginBottom: 5}}>
                                    <div style={{width: 150}}>Дата и время заезда</div>
                                    <DatePicker placeholder={'Заезд'} format={'DD.MM.YYYY'} value={dateStart} onChange={selectStartDateHandler} style={{width: 140, marginRight: 5}}
                                                allowClear={false}/>
                                    <TimePicker needConfirm={false} value={timeStart} style={{width: 140}} onChange={selectStartTimeHandler} minuteStep={15} showSecond={false} hourStep={1}
                                                allowClear={false}/>
                                </Flex>
                                <Flex align={"center"} style={{marginBottom: 5}}>
                                    <div style={{width: 150}}>Дата и время выезда</div>
                                    <DatePicker placeholder={'Выезд'} format={'DD.MM.YYYY'} value={dateFinish} onChange={selectFinishDateHandler} style={{width: 140, marginRight: 5}}
                                                allowClear={false}/>
                                    <TimePicker needConfirm={false} value={timeFinish} style={{width: 140}} onChange={selectFinishTimeHandler} minuteStep={15} showSecond={false} hourStep={1}
                                                allowClear={false}/>
                                </Flex>
                                <Button onClick={fillTableHandler}>Применить заполненные параметры</Button>
                            </Flex>
                        </Flex>
                        <MemoizedTable columns={columns} data={data}/>
                    </Flex>
                }

                {reservationMode == 2 &&
                    <Space direction='vertical'>
                        <Space>
                            <div style={{width: 143}}>Кол-во людей</div>
                            <InputNumber value={peopleCount} onChange={(e) => setPeopleCount(e)} style={{width: 350}}/>
                        </Space>
                        <Flex align={"center"}>
                            <div style={{width: 290}}>Размещать в пустые, отдельные комнаты</div>
                            <Checkbox checked={soloMode} onChange={(e) => setSoloMode(e.target.checked)}/>
                        </Flex>
                        <Flex align={"center"}>
                            <div style={{width: 150}}>Дата и время заезда</div>
                            <DatePicker placeholder={'Заезд'} format={'DD.MM.YYYY'} value={dateStart} onChange={selectStartDateHandler} style={{width: 205, marginRight: 5}}
                                        allowClear={false}/>
                            <TimePicker needConfirm={false} value={timeStart} style={{width: 140}} onChange={selectStartTimeHandler} minuteStep={15} showSecond={false} hourStep={1}
                                        allowClear={false}/>
                        </Flex>
                        <Flex align={"center"}>
                            <div style={{width: 150}}>Дата и время выезда</div>
                            <DatePicker placeholder={'Выезд'} format={'DD.MM.YYYY'} value={dateFinish} onChange={selectFinishDateHandler} style={{width: 205, marginRight: 5}}
                                        allowClear={false}/>
                            <TimePicker needConfirm={false} value={timeFinish} style={{width: 140}} onChange={selectFinishTimeHandler} minuteStep={15} showSecond={false} hourStep={1}
                                        allowClear={false}/>
                        </Flex>
                        <Flex align={"center"}>
                            <div style={{width: 150}}>Филиал</div>
                            <Select
                                disabled={isFilialsLoading}
                                loading={isFilialsLoading}
                                value={selectedFilialId}
                                placeholder={"Выберите филиал"}
                                style={{width: 350}}
                                onChange={(e) => setSelectedFilialId(e)}
                                options={filialsFromRequest?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                                showSearch
                                filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            />
                        </Flex>
                        <Flex align={"center"}>
                            <div style={{width: 150}}>Общежитие</div>
                            <Select
                                allowClear={true}
                                value={selectedHotelId}
                                loading={isHotelsLoading}
                                placeholder={"Выберите общежитие"}
                                style={{width: 350}}
                                onChange={(id) => selectHotelHandler(id)}
                                onClear={() => selectHotelHandler()}
                                options={hotelsFromRequest?.map((hotel: HotelModel) => ({value: hotel.id, label: hotel.name}))}
                                showSearch
                                filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            />
                        </Flex>
                        <Flex align={"center"}>
                            <div style={{width: 150}}>Мероприятие</div>
                            <Select
                                value={selectedEventId}
                                placeholder={"Выберите мероприятие"}
                                style={{width: 350}}
                                onChange={(e) => setSelectedEventId(e)}
                                options={events?.map((eve: EventKindModel) => ({value: eve.id, label: eve.name}))}
                                showSearch
                                filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                                filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                            />
                        </Flex>
                        <Space>
                            <Button disabled={isCheckSpacesLoading} onClick={() => checkSpacesHandler(false)}>Проверить наличие свободных мест</Button>
                            <Popconfirm title={"Убедитесь, что вы проверили наличие свободных мест!"} onConfirm={() => checkSpacesHandler(true)}>
                                <Button disabled={isCheckSpacesLoading} danger>Забронировать</Button>
                            </Popconfirm>
                        </Space>
                        {(checkSpacesData ? checkSpacesData.Status == 'Error' : false) && <Alert style={{marginTop: 15}} type={'error'} message={"Ошибка"}
                                                                                                 description={`На указанные даты не получится разместить людей.`}/>}
                        {(checkSpacesData ? checkSpacesData.Status == 'OK' : false) && <Alert style={{marginTop: 15}} type={'success'} message={"ОК"}
                                                                                              description={`Места можно забронировать!`}/>}
                        {(checkSpacesData ? checkSpacesData.Status == 'RESERVED' : false) && <Alert style={{marginTop: 15}} type={'success'} message={"ОК"}
                                                                                                    description={`Места забронированы! Вы можете найти их в шахматке или справочнике броней.`}/>}
                    </Space>
                }
            </Space>
        </Modal>
    );
};
