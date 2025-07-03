import React, {useEffect, useState} from 'react';
import {Checkbox, DatePicker, Flex, message, Modal, Select, Tooltip} from 'antd';
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {Dayjs} from "dayjs";
import {useSelector} from "react-redux";
import {RootStateType} from "store/store";
import {host} from "shared/config/constants";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const ReportMVZModal = (props: ModalProps) => {

    // States
    const currentUser = useSelector((state: RootStateType) => state.currentUser.user);
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [selectedEmployeeFilialId, setSelectedEmployeeFilialId] = useState<number | null>(null);
    const [shortMode, setShortMode] = useState<boolean>(false);
    const [onlyLpu, setOnlyLpu] = useState<boolean>(false);
    const [messageApi, messageContextHolder] = message.useMessage();
    // -----

    // Useful utils
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    // -----

    // Web requests
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    // ----

    // Effects
    useEffect(() => {
        getAllFilials();
    }, []);
    useEffect(() => {
        if (onlyLpu) {
            setShortMode(false);
            setSelectedFilialId(null);
        }
    }, [onlyLpu]);
    // -----

    return (
        <Modal title={"Отчет по МВЗ"}
               open={props.visible}
               maskClosable={false}
               loading={(isFilialsLoading)}
               onOk={() => {
                   let tmpButton = document.createElement('a');
                   if (dateRange) {
                       if (onlyLpu) {
                           showWarningMsg("Отчет начал формироваться");
                           tmpButton.href = `${host}/hotels/api/report/getMVZReportOnlyLPU?lpu=ЛПУ&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}`
                       } else {
                           if (selectedFilialId) {
                               showWarningMsg("Отчет начал формироваться");
                               if (shortMode) {
                                   if (selectedEmployeeFilialId) tmpButton.href = `${host}/hotels/api/report/getMVZReportShort?empFilialId=${selectedEmployeeFilialId}&filialId=${selectedFilialId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}`
                               } else tmpButton.href = `${host}/hotels/api/report/getMVZReport?filialId=${selectedFilialId}&dateStart=${dateRange[0].format("DD-MM-YYYY")}&dateFinish=${dateRange[1].format("DD-MM-YYYY")}`
                           } else showWarningMsg("Вы не выбрали филиал");
                       }
                   } else showWarningMsg("Вы не выбрали период");
                   tmpButton.click();
               }}
               onCancel={() => props.setVisible(false)}
               okText={"Скачать"}
               width={'450px'}
        >
            {messageContextHolder}
            <Flex vertical={true} gap={'small'}>
                <Flex align={"center"}>
                    <Tooltip title={"Отчет по всем ЛПУ"}>
                        <div style={{width: 200}}>Отчет по всем ЛПУ</div>
                    </Tooltip>
                    <Checkbox checked={onlyLpu} onChange={(e) => setOnlyLpu(e.target.checked)}/>
                </Flex>
                {!onlyLpu &&
                    <Select
                        value={selectedFilialId}
                        placeholder={"Выберите филиал"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedFilialId(e)}
                        options={currentUser.roleId === 2 ?
                            filials?.filter((filial: FilialModel) => filial.id === currentUser.filialId).map((f: FilialModel) => ({value: f.id, label: f.name}))
                            :
                            filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))
                        }
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                }
                {/*//@ts-ignore*/}
                <RangePicker value={dateRange} format={"DD-MM-YYYY"} onChange={(e) => {
                    setDateRange(e as any)
                }} style={{width: 400}}/>
                {!onlyLpu &&
                    <Flex align={"center"}>
                        <Tooltip title={"Выгрузка в формате: Общежитие-МВЗ-НаименованиеМВЗ-Кол-во дней"}>
                            <div style={{width: 200}}>Упрощенный вариант отчета</div>
                        </Tooltip>
                        <Checkbox checked={shortMode} onChange={(e) => setShortMode(e.target.checked)}/>
                    </Flex>
                }
                {shortMode &&
                    <Select
                        value={selectedEmployeeFilialId}
                        placeholder={"Выберите филиал работника"}
                        style={{width: '100%'}}
                        onChange={(e) => setSelectedEmployeeFilialId(e)}
                        options={filials?.map((filial: FilialModel) => ({value: filial.id, label: filial.name}))
                        }
                        allowClear={true}
                        showSearch
                        filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                        filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                    />
                }
            </Flex>
        </Modal>
    );
};
