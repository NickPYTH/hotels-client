import React, {useEffect, useState} from 'react';
import {
    Button,
    Checkbox,
    DatePicker,
    Flex,
    Modal,
    Select,
    Table,
    TableProps,
    Tag,
    TimePicker,
    Upload,
    UploadProps
} from 'antd';
import {InboxOutlined} from "@ant-design/icons";
import {host} from "../../config/constants";
import dayjs, {Dayjs} from "dayjs";
import {DatesCellRender} from "./DatesCellRender";
import {FlatRoomCellRenderer} from "./FlatRoomCellRender";
import {ReservationModel} from "../../model/ReservationModel";
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {HotelModel} from "../../model/HotelModel";
import {hotelAPI} from "../../service/HotelService";
import {EventModel} from "../../model/EventModel";
import {eventAPI} from "../../service/EventService";
import {ReservationModal} from "../dict/ReservationModal";

const {Dragger} = Upload;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    showWarningMsg: Function,
}

export const GroupReservationModal = (props: ModalProps) => {

    // States
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
            render: (val, record:ReservationModel) => (<DatesCellRender tabnum={record.tabnum} dateTimeStart={record.dateStart} dateTimeFinish={record.dateFinish} setGridData={setData} />)
        },
        {
            title: 'Секция и комната',
            dataIndex: 'bed',
            key: 'bed',
            render: (val, record: ReservationModel) => (<FlatRoomCellRenderer hotelId={selectedHotelId} s={s} tabnum={record.tabnum} showWarningMsg={props.showWarningMsg} dateStart={record.dateStart} dateFinish={record.dateFinish} setGridData={setData} bed={record.bed} />)
        },
        {
            title: 'Статус',
            dataIndex: 'statusGrid',
            key: 'statusGrid',
            render: (val, record:any) => (<Tag style={{marginLeft: 15}} color={record?.statusGrid == "Забронирован" ? 'success':'volcano'}>
                {record?.statusGrid == "Забронирован" ? 'Забронирован':'Не обработан'}
            </Tag>)
        },
        {
            title: '',
            dataIndex: 'action',
            key: 'action',
            render: (val, record:any) => (<Button style={{marginLeft: 15}} disabled={record?.statusGrid === "Забронирован"}
                                                  onClick={() => {
                setSelectedReservation(record);
                setIsVisibleReservationModal(true);
            }}>Забронировать</Button>)
        },
    ]
    const uploadFileProps: UploadProps = {
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
    }] = eventAPI.useGetAllMutation(); // Получение списка мероприятий
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
            if (dateStart.isAfter(dateFinish)){
                props.showWarningMsg("Дата заселения указана после даты выселения");
                return;
            }
            setData((reservations:ReservationModel[]):any => {
                let tmp: ReservationModel[] = JSON.parse(JSON.stringify(reservations));
                let event = events?.find((e:EventModel) => e.id == selectedEventId);
                let filial = filialsFromRequest?.find((f:FilialModel) => f.id == selectedFromFilialId);
                return tmp.map((res:ReservationModel) => {
                    if (event && filial) return {...res,
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
    // -----

    return (
        <Modal title={`Групповое бронирование`}
               open={props.visible}
               onCancel={() => {
                   if (window.confirm("Вы уверены что хотите закрыть окно бронирования?")) props.setVisible(false);
               }}
               footer={() => (<></>)}
               width={window.innerWidth - 10}
               maskClosable={false}
        >
            {(isVisibleReservationModal && selectedReservation) &&
                <ReservationModal
                    semiAutoParams={selectedReservation}
                    selectedReservation={null}
                    visible={isVisibleReservationModal}
                    setVisible={setIsVisibleReservationModal}
                    refresh={(reservation:ReservationModel) => {
                        if (reservation) {
                            setData((prev: ReservationModel[]) => {
                                return prev.map((r: ReservationModel) => {
                                    if (r.tabnum == reservation.tabnum) return {...r, bed: reservation.bed, statusGrid: "Забронирован"};
                                    else return r;
                                })
                            });
                            ss(p=>!p);
                        }
                    }}
                />
            }
            {data == null &&
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
            {data != null &&
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
                                    options={events?.map((eve:EventModel) => ({value: eve.id, label: eve.name}))}
                                />
                            </Flex>
                        </Flex>
                        <Flex vertical={true} style={{marginLeft: 15}}>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 150}}>Дата и время заезда</div>
                                <DatePicker placeholder={'Заезд'} format={'DD.MM.YYYY'} value={dateStart} onChange={selectStartDateHandler} style={{width: 140, marginRight: 5}} allowClear={false}/>
                                <TimePicker needConfirm={false} value={timeStart} style={{width: 140}} onChange={selectStartTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false} />
                            </Flex>
                            <Flex align={"center"} style={{marginBottom: 5}}>
                                <div style={{width: 150}}>Дата и время выезда</div>
                                <DatePicker placeholder={'Выезд'} format={'DD.MM.YYYY'} value={dateFinish} onChange={selectFinishDateHandler} style={{width: 140, marginRight: 5}} allowClear={false}/>
                                <TimePicker needConfirm={false} value={timeFinish} style={{width: 140}} onChange={selectFinishTimeHandler} minuteStep={15} showSecond={false} hourStep={1} allowClear={false} />
                            </Flex>
                            <Button onClick={fillTableHandler}>Применить заполненные параметры</Button>
                        </Flex>
                    </Flex>
                    <Table
                        bordered={true}
                        style={{width: '100vw', marginTop: 15}}
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
