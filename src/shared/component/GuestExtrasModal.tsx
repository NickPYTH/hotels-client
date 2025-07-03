import React, {useEffect, useState} from 'react';
import {Button, Flex, Modal, Popconfirm, Table, TableProps, Tag} from 'antd';
import {ExtraModel} from "entities/ExtraModel";
import {AddGuestExtrasModal} from "./AddGuestExtrasModal";
import {extraAPI} from "service/ExtraService";
import {GuestExtrasConfirmPaymentModal} from "shared/component/GuestExtrasConfirmPaymentModal";

type ModalProps = {
    visible: boolean,
    setVisible: Function,
    guestId: number
}
export const GuestExtrasModal = (props: ModalProps) => {

    // States
    const [visibleExtrasModal, setVisibleExtrasModal] = useState(false);
    const [extrasGrouped, setExtrasGrouped] = useState<ExtraModel[]>([]);
    const [visibleConfirmPaymentModal, setVisibleConfirmPaymentModal] = useState(false);
    const [selectedExtra, setSelectedExtra] = useState<ExtraModel | null>(null);
    // -----

    // Web requests
    const [getAllExtras, {
        data: extras,
    }] = extraAPI.useGetAllByGuestMutation();
    const [deleteGuestExtra, {
        data: deleteResult,
    }] = extraAPI.useDeleteGuestExtraMutation();
    // -----

    // Effects
    useEffect(() => {
        if (props.guestId) getAllExtras(props.guestId);
    }, [])
    useEffect(() => {
        if (deleteResult) getAllExtras(props.guestId);
    }, [deleteResult]);
    useEffect(() => {
        if (extras) {
            setExtrasGrouped(extras.reduce((acc: ExtraModel[], currentExtra: ExtraModel) => {
                let extra = acc.find((e: ExtraModel) => e.name == currentExtra.name);
                if (!extra) {
                    let currentExtraCopy = JSON.parse(JSON.stringify(currentExtra));
                    currentExtraCopy.count = 1;
                    currentExtraCopy.totalCost = currentExtraCopy.cost;
                    return acc.concat(currentExtraCopy);
                }
                if (extra.count && extra.totalCost) {
                    extra.totalCost += extra.cost;
                    extra.count += 1;
                }
                return acc;
            }, []))
        }
    }, [extras]);
    // -----

    // Useful utils
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
            title: 'Количество',
            dataIndex: 'count',
            key: 'count',
        },
        {
            title: 'Стоимость',
            dataIndex: 'cost',
            key: 'cost',
        },
        {
            title: 'Общая стоимость',
            dataIndex: 'totalCost',
            key: 'totalCost',
        },
        {
            title: 'Статус',
            dataIndex: 'isPaid',
            key: 'isPaid',
            render: (value, record) => (<>{value ? <Tag color="success">Оплачено</Tag> : <Tag>Не оплачено</Tag>}</>)
        },
        {
            title: 'Способ оплаты',
            dataIndex: 'paymentType',
            key: 'paymentType',
            render: (value, record) => (<>{record?.paymentType?.name}</>)
        },
        {
            key: 'delete',
            render: (value, record) =>
                <Flex align={'center'} justify={'center'}>
                    <Button disabled={record.isPaid} onClick={() => {
                        setSelectedExtra(record);
                        setVisibleConfirmPaymentModal(true);
                    }} size={'small'} style={{margin: 5}}>Провести оплату</Button>
                    <Popconfirm title={"Вы точно хотите удалить запись о доп. услуге?"} onConfirm={() => {
                        deleteGuestExtra({guestId: props.guestId, extraId: record.id});
                    }}>
                        <Button size={'small'} style={{margin: 5}} danger>Удалить</Button>
                    </Popconfirm>
                </Flex>
        },
    ];
    // -----

    return (
        <Modal title={"Использованные дополнительные услуги жильца"}
               maskClosable={false}
               open={props.visible}
               onCancel={() => props.setVisible(false)}
               width={window.innerWidth-100}
               footer={(<></>)}
        >
            {(visibleConfirmPaymentModal && selectedExtra) && <GuestExtrasConfirmPaymentModal
                refresh={getAllExtras}
                visible={visibleConfirmPaymentModal}
                setVisible={setVisibleConfirmPaymentModal}
                extra={({...selectedExtra, guestId: props.guestId})}
            />}
            {visibleExtrasModal && <AddGuestExtrasModal guestId={props.guestId} refresh={getAllExtras} visible={visibleExtrasModal} setVisible={setVisibleExtrasModal}/>}
            <Flex vertical={true}>
                <Button onClick={() => setVisibleExtrasModal(true)} style={{marginBottom: 15, width: 120}}>Добавить</Button>
                <Table
                    bordered
                    style={{width: '100vw'}}
                    columns={columns}
                    dataSource={extrasGrouped.map((e: any) => ({...e, key: e.id}))}
                    pagination={{defaultPageSize: 100}}
                />
            </Flex>
        </Modal>
    );
};
