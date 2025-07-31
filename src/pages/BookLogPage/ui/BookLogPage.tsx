import React, {useEffect, useState} from 'react';
import {Button, Flex, Table, TableProps, Tag} from 'antd';
import {RootStateType} from "store/store";
import {useNavigate} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {bookReportAPI} from "service/BookReportService";
import {BookReportModel} from "entities/BookReportModel";
import {host} from "shared/config/constants";

interface GroupedBookReportModel {
    key: number,
    bookId: number;
    date: string;
    username: string;
    duration: number;
    bookStatus: string;
    withBook: boolean;
    children?: BookReportModel[];
}

const BookLogPage: React.FC = () => {

    // States
    const [gridData, setGridData] = useState<GroupedBookReportModel[]>([]);
    // -----

    // Web requests
    const [getAll, {
        data: bookReportList,
        isLoading: isBookReportListLoading
    }] = bookReportAPI.useGetAllMutation();
    // -----

    // Effects
    useEffect(() => {
        getAll();
    }, []);
    useEffect(() => {
        if (bookReportList) {
            let reduced = bookReportList.reduce((acc: GroupedBookReportModel[], record: BookReportModel) => {
                if (!acc.find((rec: GroupedBookReportModel) => rec.bookId == record.bookId)) {
                    let newGroup: GroupedBookReportModel = {
                        key: record.bookId,
                        bookId: record.bookId,
                        date: record.date,
                        username: record.username,
                        duration: record.duration,
                        bookStatus: record.bookStatus,
                        withBook: record.withBook,
                        children: [record]
                    }
                    return acc.concat([newGroup])
                }
                let group = acc.find((rec: GroupedBookReportModel) => rec.bookId == record.bookId);
                if (group) group.children?.push(record);
                // magic
                return acc;
            }, []);
            console.log(reduced);
            setGridData(reduced);
        }
    }, [bookReportList]);
    // -----

    // Useful utils
    const navigate = useNavigate();
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    if (currentUser.roleId !== 1 && currentUser.roleId !== 999) navigate(`../hotels/`);
    const columns: TableProps<GroupedBookReportModel>['columns'] = [
        {
            title: 'ИД протокола',
            dataIndex: 'bookId',
            key: 'bookId',
            sorter: (a, b) => a.bookId - b.bookId,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend',
            filters: bookReportList?.reduce((acc: { text: string, value: string }[], bookReportModel: BookReportModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === bookReportModel.bookId?.toString()) === undefined)
                    return acc.concat({text: bookReportModel.bookId?.toString(), value: bookReportModel.bookId?.toString()});
                return acc;
            }, []),
            onFilter: (value: any, record: GroupedBookReportModel) => {
                return record.bookId?.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Дата',
            dataIndex: 'date',
            key: 'date',
        },
        {
            title: 'Пользователь',
            dataIndex: 'username',
            key: 'username',
            filters: bookReportList?.reduce((acc: { text: string, value: string }[], bookReportModel: BookReportModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === bookReportModel.username) === undefined)
                    return acc.concat({text: bookReportModel.username, value: bookReportModel.username});
                return acc;
            }, []),
            onFilter: (value: any, record: GroupedBookReportModel) => {
                return record.username?.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Длительность',
            dataIndex: 'duration',
            key: 'duration',
        },
        {
            title: 'Статус протокола',
            dataIndex: 'bookStatus',
            key: 'bookStatus',
            render: (e) => (<Tag color={e === 'ok' ? 'green' : 'error'}>{e}</Tag>),
            filters: bookReportList?.reduce((acc: { text: string, value: string }[], bookReportModel: BookReportModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === bookReportModel.bookStatus) === undefined)
                    return acc.concat({text: bookReportModel.bookStatus, value: bookReportModel.bookStatus});
                return acc;
            }, []),
            onFilter: (value: any, record: GroupedBookReportModel) => {
                return record.bookStatus.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Проверка с последующим бронированием',
            dataIndex: 'withBook',
            key: 'withBook',
            render: (e) => (e ? "Да" : "Нет")
        },
        {
            title: 'Табельный номер',
            dataIndex: 'tabnumber',
            key: 'tabnumber',
            filters: bookReportList?.reduce((acc: { text: string, value: string }[], bookReportModel: BookReportModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === bookReportModel.tabnumber?.toString()) === undefined)
                    return acc.concat({text: bookReportModel.tabnumber?.toString(), value: bookReportModel.tabnumber?.toString()});
                return acc;
            }, []),
            onFilter: (value: any, record: any) => {
                return record.tabnumber?.toString().indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'ФИО',
            dataIndex: 'fio',
            key: 'fio',
            filters: bookReportList?.reduce((acc: { text: string, value: string }[], bookReportModel: BookReportModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === bookReportModel.fio) === undefined)
                    return acc.concat({text: bookReportModel.fio, value: bookReportModel.fio});
                return acc;
            }, []),
            onFilter: (value: any, record: any) => {
                return record.fio.indexOf(value) === 0
            },
            filterSearch: true,
        },
        {
            title: 'Дата начала',
            dataIndex: 'dateStart',
            key: 'dateStart',
        },
        {
            title: 'Дата окончания',
            dataIndex: 'dateFinish',
            key: 'dateFinish',
        },
        {
            title: 'Статус',
            dataIndex: 'status',
            key: 'status',
            render: (value, record) => (
                <div style={{width: '100%', marginTop: 2, marginBottom: 2}}>
                    <Flex justify={'center'}>
                        {value ? <Tag color={value === 'ok' ? 'green' : 'error'}>{value}</Tag> : <Button size={'small'} onClick={() => {
                            let tmpButton = document.createElement('a')
                            tmpButton.href = `${host}/hotels/api/report/getBookReport?bookReportId=${record.bookId}`
                            tmpButton.click();
                        }}>Скачать протокол</Button>}
                    </Flex>
                </div>),
            filters: bookReportList?.reduce((acc: { text: string, value: string }[], bookReportModel: BookReportModel) => {
                if (acc.find((g: { text: string, value: string }) => g.text === bookReportModel.status) === undefined)
                    return acc.concat({text: bookReportModel.status, value: bookReportModel.status});
                return acc;
            }, []),
            onFilter: (value: any, record: any) => {
                return record.status.indexOf(value) === 0
            },
            filterSearch: true,
        },
    ]
    // -----

    return (
        <Flex vertical={true}>
            <Table
                style={{width: '100vw'}}
                columns={columns}
                dataSource={gridData}
                loading={isBookReportListLoading}
                pagination={{
                    defaultPageSize: 100,
                }}
            />
        </Flex>
    );
};

export default BookLogPage;