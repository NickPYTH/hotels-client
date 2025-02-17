import React, {useEffect, useState} from 'react';
import {Button, Flex, Modal, Popconfirm, Table, TableProps} from 'antd';
import {ExtraModel} from "../../model/ExtraModel";
import {AddGuestExtrasModal} from "./AddGuestExtrasModal";
import {extraAPI} from "../../service/ExtraService";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    guestId: number
}
export const GuestExtrasModal = (props: ModalProps) => {
    const [visibleExtrasModal, setVisibleExtrasModal] = useState(false);

    const [getAllExtras, {
        data: extras,
    }] = extraAPI.useGetAllByGuestMutation();
    const [deleteGuestExtra, {
        data: deleteResult,
    }] = extraAPI.useDeleteGuestExtraMutation();

    useEffect(() => {
        if (props.guestId) getAllExtras(props.guestId);
    }, [])
    useEffect(() => {
        if (deleteResult) getAllExtras(props.guestId);
    }, [deleteResult]);

    const columns: TableProps<ExtraModel>['columns'] = [
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
        {
            key: 'delete',
            render: (value, record) =>
                <Popconfirm title={"Вы точно хотите удалить запись о доп. услуге?"} onConfirm={() => {
                    deleteGuestExtra({guestId: props.guestId, extraId: record.id});
                }}>
                    <Button style={{margin: 5}} danger>Удалить</Button>
                </Popconfirm>
        },
    ];
    return (
        <Modal title={"Использованные дополнительные услуги жильца"}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               width={1100}
               footer={(<></>)}
        >
            {visibleExtrasModal && <AddGuestExtrasModal guestId={props.guestId} refresh={getAllExtras} visible={visibleExtrasModal} setVisible={setVisibleExtrasModal}/>}
            <Flex vertical={true}>
                <Button onClick={() => setVisibleExtrasModal(true)} style={{marginBottom: 15, width: 120}}>Добавить</Button>
                <Table
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={extras?.map((e: any) => ({...e, key: e.id}))}
                    pagination={{defaultPageSize: 100}}
                />
            </Flex>
        </Modal>
    );
};
