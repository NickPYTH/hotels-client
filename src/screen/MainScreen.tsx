import React, {useEffect, useState} from 'react';
import {Divider, Flex, message, Spin, Switch} from 'antd';
import {filialAPI} from "../service/FilialService";
import {FilialModel} from "../model/FilialModel";
import {FilialCard} from "../component/main/FilialCard";
import {useSelector} from 'react-redux';
import {RootStateType} from "../store/store";
import {useNavigate} from 'react-router-dom';
import dayjs from 'dayjs';

const MainScreen: React.FC = () => {
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const navigate = useNavigate();
    if (currentUser.roleId === 2) navigate(`../hotels/hotels`);

    const [messageApi, messageContextHolder] = message.useMessage();
    const [filials, setFilials] = useState<FilialModel[] | null>(null);
    const [bedsCountSort, setBedsCountSort] = useState<boolean>(false);

    const [getAllFilials, {
        data: filialsData,
        isLoading: isFilialsDataLoading
    }] = filialAPI.useGetAllMutation();

    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        if (filialsData) setFilials(filialsData);
    }, [filialsData]);
    if (isFilialsDataLoading)
        return <div
            style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '90vh', width: '100vw'}}>
            <Spin size={'large'}/>
        </div>
    return (
        <Flex gap="middle" align="start" vertical={true} wrap={'wrap'}>
            {messageContextHolder}
            <Flex style={{marginTop: 20, marginLeft: 15}} gap={'small'}>
                {/*<Flex align={'center'}>*/}
                {/*    <div style={{width: 240, height: 44, wordBreak: 'break-word', whiteSpace: 'normal'}}>Остортировать по убыванию общего колличества мест</div>*/}
                {/*    <div>*/}
                {/*        <Switch value={bedsCountSort} onChange={(e) => setBedsCountSort(e)} style={{marginLeft: 5}}/>*/}
                {/*    </div>*/}
                {/*</Flex>*/}
                {/*<Divider style={{height: 44}} type={'vertical'}/>*/}
            </Flex>
            {/*<Divider style={{marginTop: 5, marginBottom: 5}}/>*/}
            <Flex style={{marginRight: 15, marginLeft: 15, marginTop: 15}} gap="middle" align="start" vertical={false} wrap={'wrap'} justify="center">
                {filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => (
                    <FilialCard showWarningMsg={showWarningMsg} filial={filial} date={dayjs().format('DD-MM-YYYY HH:mm')}/>
                ))}
            </Flex>
        </Flex>
    );
};

export default MainScreen;