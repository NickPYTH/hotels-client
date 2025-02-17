import React, {useEffect, useRef, useState} from 'react';
import {Button, Flex, Input, InputRef, message, Popconfirm, Space, Spin, Table, TableProps} from 'antd';
import {GuestModel} from '../../model/GuestModel';
import {guestAPI} from "../../service/GuestService";
import dayjs from "dayjs";
import {GuestModal} from "../../component/dict/GuestModal";
import {host} from "../../config/constants";
import {ColumnType} from 'antd/es/table';
import {SearchOutlined} from '@ant-design/icons';
import {FilterConfirmProps} from 'antd/es/table/interface';

export interface DataType extends GuestModel {
    key: React.Key;
    children?: any;
}

type DataIndex = keyof DataType;

const GuestScreen: React.FC = () => {

    // States
    const searchInput = useRef<InputRef>(null);
    const [visible, setVisible] = useState(false);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [guests, setGuests] = useState<GuestModel[]>([]);
    const [selectedGuest, setSelectedGuest] = useState<GuestModel | null>(null);
    // -----

    // Web requests
    const [getAllGuests, {
        data: guestsDataFromRequest,
        isLoading: isGuestsLoading
    }] = guestAPI.useGetAllMutation();
    const [deleteGuest, {
        data: deletedGuest,
        isLoading: isGuestDeleteLoading
    }] = guestAPI.useDeleteMutation();
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
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => a.id - b.id,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
        },
        {
            title: 'Выселен',
            dataIndex: 'checkouted',
            key: 'checkouted',
            render: (val) => (<>{val ? "Да" : "Нет"}</>)
        },
        {
            title: 'Табельный',
            dataIndex: 'tabnum',
            key: 'tabnum',
            //@ts-ignore
            sorter: (a, b) => a.tabnum.toLowerCase().charCodeAt(0) - b.tabnum.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('tabnum'),
        },
        {
            title: 'Фамилия',
            dataIndex: 'lastname',
            key: 'lastname',
            //@ts-ignore
            sorter: (a, b) => a.lastname.toLowerCase().charCodeAt(0) - b.lastname.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('lastname'),
        },
        {
            title: 'Имя',
            dataIndex: 'firstname',
            key: 'firstname',
            //@ts-ignore
            sorter: (a, b) => a.firstname.toLowerCase().charCodeAt(0) - b.firstname.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('firstname'),
        },
        {
            title: 'Отчество',
            dataIndex: 'secondName',
            key: 'secondName',
            //@ts-ignore
            sorter: (a, b) => a.secondName.toLowerCase().charCodeAt(0) - b.secondName.toLowerCase().charCodeAt(0),
            sortDirections: ['descend', 'ascend'],
            ...getColumnSearchProps('secondName'),
        },
        {
            title: 'Дата заезда',
            dataIndex: 'dateStart',
            key: 'dateStart',
            sorter: (a, b) => {
                let date1 = dayjs(a.dateStart, "dd-MM-yyyy").unix();
                let date2 = dayjs(b.dateStart, "dd-MM-yyyy").unix();
                return date1 - date2;
            },
        },
        {
            title: 'Дата выезда',
            dataIndex: 'dateFinish',
            key: 'dateFinish',
            sorter: (a, b) => {
                let date1 = dayjs(a.dateFinish, "dd-MM-yyyy").unix();
                let date2 = dayjs(b.dateFinish, "dd-MM-yyyy").unix();
                return date1 - date2;
            },
        },
        {
            title: 'Филиал',
            dataIndex: 'filialName',
            key: 'filialName',
            sorter: (a, b) => a.filialName.length - b.filialName.length,
            sortDirections: ['descend', 'ascend'],
            filters: guestsDataFromRequest?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.filialName) === undefined)
                    return acc.concat({text: guest.filialName, value: guest.filialName});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.filialName.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Общежитие',
            dataIndex: 'hotelName',
            key: 'hotelName',
            sorter: (a, b) => a.hotelName.length - b.hotelName.length,
            sortDirections: ['descend', 'ascend'],
            filters: guestsDataFromRequest?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.hotelName) === undefined)
                    return acc.concat({text: guest.hotelName, value: guest.hotelName});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.hotelName.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Квартира',
            dataIndex: 'flatName',
            key: 'flatName',
            sorter: (a, b) => a.flatName.length - b.flatName.length,
            sortDirections: ['descend', 'ascend'],
            filters: guestsDataFromRequest?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === guest.flatName) === undefined)
                    return acc.concat({text: guest.flatName, value: guest.flatName});
                else return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.flatName.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Комната',
            dataIndex: 'roomName',
            key: 'roomName',
            sortDirections: ['descend', 'ascend'],
        },
        {
            title: 'Организация',
            dataIndex: 'organization',
            key: 'organization',
            filters: guestsDataFromRequest?.reduce((acc: { text: string, value: string }[], guest: GuestModel) => {
                if (guest.organization) {
                    if (acc.find((g: { text: string, value: string }) => g.text === guest.organization.toString()) === undefined)
                        return acc.concat({text: guest.organization.toString(), value: guest.organization.toString()});
                }
                return acc;
            }, []),
            onFilter: (value: any, record: GuestModel) => {
                return record.organization?.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Рег. по месту пребывания',
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
    }, []);
    useEffect(() => {
        if (guestsDataFromRequest) setGuests(guestsDataFromRequest);
    }, [guestsDataFromRequest]);
    useEffect(() => {
        if (deletedGuest) {
            showSuccessMsg("Гость удален");
            getAllGuests();
        }
    }, [deletedGuest]);
    useEffect(() => {
        if (!visible) setSelectedGuest(null);
    }, [visible]);
    // -----

    return (
        <>
            {(isGuestsLoading || isGuestDeleteLoading) ?
                <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
                    <Spin size={'large'}/>
                </div>
                :
                <Flex vertical={true}>
                    {messageContextHolder}
                    {visible &&
                        <GuestModal room={null} bedId={null} setGuests={setGuests} showSuccessMsg={showSuccessMsg} isAddressDisabled={false} selectedGuest={selectedGuest} visible={visible} setVisible={setVisible}
                                    refresh={() => {
                                    }}/>}
                    <Flex justify={'space-between'}>
                        <Button type={'primary'} onClick={() => setVisible(true)} style={{width: 100, margin: 10}}>Добавить</Button>
                        <Button type={'primary'} onClick={() => {
                            let tmpButton = document.createElement('a');
                            tmpButton.href = `${host}/hotels/api/guest/getGuestReport`
                            tmpButton.click();
                        }} style={{width: 100, margin: 10}}>Отчет</Button>
                    </Flex>
                    <Table
                        style={{width: '100vw'}}
                        columns={columns}
                        dataSource={guests}
                        onRow={(record, rowIndex) => {
                            return {
                                onDoubleClick: (e) => {
                                    setVisible(true);
                                    setSelectedGuest(record);
                                },
                            };
                        }}
                        pagination={{
                            defaultPageSize: 100,
                        }}
                    />
                </Flex>
            }
        </>
    );
};

export default GuestScreen;