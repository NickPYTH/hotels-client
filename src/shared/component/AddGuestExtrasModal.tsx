import React, {useEffect, useState} from 'react';
import {Button, Flex, Modal, Table, TableProps} from 'antd';
import {ExtraModel} from "entities/ExtraModel";
import {extraAPI} from "service/ExtraService";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    refresh: Function,
    guestId: number
}
export const AddGuestExtrasModal = (props: ModalProps) => {

    // States
    const [selectedRecord, setSelectedRecord] = useState<ExtraModel | null>(null);
    // -----

    // Web requests
    const [getAllExtras, {
        data: extras,
    }] = extraAPI.useGetAllMutation();
    const [addGuestExtra, {
        data: guestExtra,
    }] = extraAPI.useCreateGuestExtraMutation();
    // -----

    // Effects
    useEffect(() => {
        getAllExtras();
    }, []);
    useEffect(() => {
        if (guestExtra) {
            props.setVisible(false);
            props.refresh(props.guestId);
        }
    }, [guestExtra]);
    // -----

    // Useful utils
    const columns: TableProps<ExtraModel>['columns'] = [
        {
            title: 'ИД',
            dataIndex: 'id',
            key: 'id',
            sorter: (a, b) => (a.id && b.id) ? a.id - b.id : 0,
            sortDirections: ['descend', 'ascend'],
            defaultSortOrder: 'descend'
        },
        {
            title: 'Наименование',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Описание',
            dataIndex: 'description',
            key: 'description',
        },
        {
            title: 'Стоимость',
            dataIndex: 'cost',
            key: 'cost',
        },
    ];
    // -----

    // Handlers
    const addExtraHandler = () => {
        if (selectedRecord) {
            addGuestExtra({guestId: props.guestId, extraId: selectedRecord.id})
        }
    }
    // -----

    return (
        <Modal title={"Выберите дополнительную услугу"}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               width={1100}
               footer={(<></>)}
        >
            <Flex vertical={true}>
                <Button onClick={addExtraHandler} disabled={selectedRecord == null} style={{marginBottom: 15, width: 120}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={extras?.map((e: any) => ({...e, key: e.id}))}
                    pagination={{defaultPageSize: 100}}
                    rowSelection={{
                        type: 'radio',
                        onChange: (selectedRowKeys, record) => {
                            setSelectedRecord(record[0]);
                        }
                    }}
                />
            </Flex>
        </Modal>
    );
};
