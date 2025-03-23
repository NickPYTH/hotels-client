import React, {useEffect, useRef, useState} from 'react';
import {Button, Flex, Input, InputRef, message, Popconfirm, Space, Table, TableProps} from 'antd';
import {GuestModel} from '../../model/GuestModel';
import {guestAPI} from "../../service/GuestService";
import dayjs from "dayjs";
import {GuestModal} from "../../component/dict/GuestModal";
import {host} from "../../config/constants";
import {ColumnType} from 'antd/es/table';
import {SearchOutlined} from '@ant-design/icons';
import {FilterConfirmProps} from 'antd/es/table/interface';
import {TableTitleRender} from "../../component/TableTitleRender";
import {filialAPI} from "../../service/FilialService";
import {FilialModel} from "../../model/FilialModel";
import {BedModel} from "../../model/BedModel";

export interface DataType extends GuestModel {
    key: React.Key;
    children?: any;
}

type DataIndex = keyof DataType;

const GuestScreen: React.FC = () => {

    // States
    const [isVisibleGuestModal, setIsVisibleGuestModal] = useState(false);
    const [selectedGuest, setSelectedGuest] = useState<GuestModel | null>(null);
    const [guests, setGuests] = useState<GuestModel[]>([]);
    // -----

    // Web requests
    const [getAllGuests, {
        data: guestsData,
        isLoading: isGuestsLoading
    }] = guestAPI.useGetAllMutation();
    const [deleteGuest, {
        data: deletedGuest,
    }] = guestAPI.useDeleteMutation();
    const [getAllFilials, {
        data: filials
    }] = filialAPI.useGetAllMutation();
    // -----

    // Handlers
    const handleSearch = (selectedKeys: string[], confirm: (param?: FilterConfirmProps) => void, dataIndex: DataIndex) => {
        confirm();
    };
    const handleReset = (clearFilters: () => void) => {
        clearFilters();
    };
    // -----

    // Useful utils
    const [messageApi, messageContextHolder] = message.useMessage();
    const searchInput = useRef<InputRef>(null);
    const showSuccessMsg = (msg: string) => {
        messageApi.success(msg);
    };
    const getColumnSearchProps = (dataIndex: any): ColumnType<any> => ({
        filterDropdown: ({setSelectedKeys, selectedKeys, confirm, clearFilters, close}) => (
            <div style={{padding: 8}} onKeyDown={(e) => e.stopPropagation()}>
                <Input
                    ref={searchInput}
                    placeholder={`Поиск`}
                    value={selectedKeys[0]}
                    onChange={(e: any) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                    onPressEnter={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                    style={{marginBottom: 8, display: 'block'}}
                />
                <Space>
                    <Button
                        type="primary"
                        onClick={() => handleSearch(selectedKeys as string[], confirm, dataIndex)}
                        icon={<SearchOutlined/>}
                        size="small"
                        style={{width: 90}}
                    >
                        Поиск
                    </Button>
                    <Button
                        onClick={() => clearFilters && handleReset(clearFilters)}
                        size="small"
                        style={{width: 90}}
                    >
                        Сбросить
                    </Button>
                    <Button
                        type="link"
                        size="small"
                        onClick={() => {
                            close();
                        }}
                    >
                        Закрыть
                    </Button>
                </Space>
            </div>
        ),
        filterIcon: (filtered: boolean) => (
            <SearchOutlined style={{color: filtered ? '#1677ff' : undefined}}/>
        ),
        onFilter: (value, record) => {
            if (record[dataIndex])
                try {
                    return record[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes((value as string).toLowerCase())
                } catch (e) {
                    return !!record.children.find((child: any) => child[dataIndex]
                        .toString()
                        .toLowerCase()
                        .includes((value as string).toLowerCase()));
                }
        },
        onFilterDropdownOpenChange: (visible) => {
            if (visible) {
                setTimeout(() => searchInput.current?.select(), 100);
            }
        },
        render: (text) => (<div>{text}</div>)
    });
    const columns: TableProps<GuestModel>['columns'] = [
        {
            title: <TableTitleRender title={'ИД'} />,
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
        },
        {
            title: <TableTitleRender title={'Выселен'} />,
            dataIndex: 'checkouted',
            key: 'checkouted',
            render: (val) => (<>{val ? "Да" : "Нет"}</>)
        },
        {
            title: <TableTitleRender title={'Табельный номер'} />,
            dataIndex: 'tabnum',
            key: 'tabnum',
            //@ts-ignore
            sorter: (a, b) => a.tabnum.toLowerCase().charCodeAt(0) - b.tabnum.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('tabnum'),
        },
        {
            title: <TableTitleRender title={'Фамилия'} />,
            dataIndex: 'lastname',
            key: 'lastname',
            //@ts-ignore
            sorter: (a, b) => a.lastname.toLowerCase().charCodeAt(0) - b.lastname.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('lastname'),
        },
        {
            title: <TableTitleRender title={'Имя'} />,
            dataIndex: 'firstname',
            key: 'firstname',
            //@ts-ignore
            sorter: (a, b) => a.firstname.toLowerCase().charCodeAt(0) - b.firstname.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('firstname'),
        },
        {
            title: <TableTitleRender title={'Отчество'} />,
            dataIndex: 'secondName',
            key: 'secondName',
            //@ts-ignore
            sorter: (a, b) => a.secondName.toLowerCase().charCodeAt(0) - b.secondName.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('secondName'),
        },
        {
            title: <TableTitleRender title={'Дата заезда'} />,
            dataIndex: 'dateStart',
            key: 'dateStart',
            sorter: (a, b) => dayjs(a.dateStart, 'DD-MM-YYYY').diff(dayjs(b.dateStart, 'DD-MM-YYYY')),

        },
        {
            title: <TableTitleRender title={'Дата выезда'} />,
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            sorter: (a, b) => dayjs(a.dateFinish, 'DD-MM-YYYY').diff(dayjs(b.dateFinish, 'DD-MM-YYYY')),
        },
        {
            title: 'Филиал',
            dataIndex: 'bed',
            key: 'filial',
            render: (bed:BedModel) => (<>{bed.room.flat.hotel.filial.name}</>),
            sorter: (a, b) => a.bed.room.flat.hotel.filial.name.length - b.bed.room.flat.hotel.filial.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let filial = guest.bed.room.flat.hotel.filial;
                if (acc.find((g: { text: string, value: number }) => g.value == filial.id) === undefined)
                    return acc.concat({text: filial.name, value: filial.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.flat.hotel.filial.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Общежитие',
            dataIndex: 'bed',
            key: 'hotel',
            render: (bed:BedModel) => (<>{bed.room.flat.hotel.name}</>),
            sorter: (a, b) => a.bed.room.flat.hotel.name.length - b.bed.room.flat.hotel.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let hotel = guest.bed.room.flat.hotel;
                if (acc.find((g: { text: string, value: number }) => g.value == hotel.id) === undefined)
                    return acc.concat({text: hotel.name, value: hotel.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.flat.hotel.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Квартира',
            dataIndex: 'bed',
            key: 'flat',
            render: (bed:BedModel) => (<>{bed.room.flat.name}</>),
            sorter: (a, b) => a.bed.room.flat.name.length - b.bed.room.flat.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let flat = guest.bed.room.flat;
                if (acc.find((g: { text: string, value: number }) => g.value == flat.id) === undefined)
                    return acc.concat({text: flat.name, value: flat.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.flat.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Комната',
            dataIndex: 'bed',
            key: 'room',
            render: (bed:BedModel) => (<>{bed.room.name}</>),
            sorter: (a, b) => a.bed.room.name.length - b.bed.room.name.length,
            sortDirections: ['descend', 'ascend'],
            filters: guests?.reduce((acc: { text: string, value: number }[], guest: GuestModel) => {
                let room = guest.bed.room;
                if (acc.find((g: { text: string, value: number }) => g.value == room.id) === undefined)
                    return acc.concat({text: room.name, value: room.id});
                else return acc;
            }, []),
            onFilter: (value: string, record: GuestModel) => {
                return record.bed.room.name.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Организация'} />,
            dataIndex: 'organizationName',
            key: 'organizationName',
            filters: guestsData?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (guest.organizationName) {
                    if (acc.find((g: { text: string, value: string }) => g.text === guest.organizationName) === undefined)
                        return acc.concat({text: guest.organizationName, value: guest.organizationName});
                }
                return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.organizationName.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Филиал работника'} />,
            dataIndex: 'filialEmployee',
            key: 'filialEmployee',
            render: (value: any, record: GuestModel) => {
                if (filials) {
                    let filialName = filials.find((f: FilialModel) => f.code.toString() == record.filialEmployee)?.name;
                    return (<>{filialName}</>);
                }
                return (<></>);
            },
            filters: guestsData?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (guest.filialEmployee && filials) {
                    let filialName = filials.find((f:FilialModel) => f.code.toString() == guest.filialEmployee)?.name;
                    if (acc.find((g: { text: string, value: string }) => g.text === filialName) === undefined)
                        return acc.concat({text: filialName, value: guest.filialEmployee});
                }
                return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.filialEmployee?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: <TableTitleRender title={'Рег. по месту пребывания'} />,
            dataIndex: 'regPoMestu',
            key: 'regPoMestu',
            render: (value) => value ? "Да" : "Нет"
        },
        {
            key: 'delete',
            render: (value, record) =>
                <Popconfirm title={"Вы точно хотите удалить запись о проживании?"} onConfirm={() => {
                    deleteGuest(record.id);
                }}>
                    <Button style={{margin: 5}} danger>Удалить</Button>
                </Popconfirm>
        },
    ];
    // -----

    // Effects
    useEffect(() => {
        getAllGuests();
        getAllFilials();
    }, []);
    useEffect(() => {
        if (guestsData) setGuests(guestsData);
    }, [guestsData]);
    useEffect(() => {
        if (deletedGuest) {
            showSuccessMsg("Запись о проживании удалена");
            getAllGuests();
        }
    }, [deletedGuest]);
    useEffect(() => {
        if (!isVisibleGuestModal) setSelectedGuest(null);
    }, [isVisibleGuestModal]);
    // -----

    return (
        <Flex vertical={true}>
            {messageContextHolder}
            {isVisibleGuestModal &&
                <GuestModal room={null} bedId={null} setGuests={setGuests} showSuccessMsg={showSuccessMsg} isAddressDisabled={false} selectedGuest={selectedGuest} visible={isVisibleGuestModal} setVisible={setIsVisibleGuestModal}
                            refresh={() => {
                            }}/>}
            <Flex justify={'space-between'}>
                <Button type={'primary'} onClick={() => setIsVisibleGuestModal(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                <Button type={'primary'} onClick={() => {
                    let tmpButton = document.createElement('a');
                    tmpButton.href = `${host}/hotels/api/report/getGuestReport`
                    tmpButton.click();
                }} style={{width: 100, margin: 10}}>Отчет</Button>
            </Flex>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={guests}
                loading={isGuestsLoading}
                onRow={(record, rowIndex) => {
                    return {
                        onDoubleClick: (e) => {
                            setIsVisibleGuestModal(true);
                            setSelectedGuest(record);
                        },
                    };
                }}
                pagination={{
                    defaultPageSize: 100,
                }}
            />
        </Flex>
    );
};

export default GuestScreen;