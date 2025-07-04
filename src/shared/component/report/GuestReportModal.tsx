import React, {useEffect, useState} from 'react';
import {DatePicker, Flex, Input, message, Modal, Select, Switch} from 'antd';
import {Dayjs} from "dayjs";
import {FilialModel} from "entities/FilialModel";
import {filialAPI} from "service/FilialService";
import {host} from "shared/config/constants";

const {RangePicker} = DatePicker;

type ModalProps = {
    visible: boolean,
    setVisible: Function,
}
export const GuestReportModal = (props: ModalProps) => {
    const [selectedFilialId, setSelectedFilialId] = useState<number | null>(null);
    const [messageApi, messageContextHolder] = message.useMessage();
    const [dateRange, setDateRange] = useState<Dayjs[] | null>(null);
    const [isDefault, setIsDefault] = useState<boolean>(true);
    const [isFullReport, setIsFullReport] = useState<boolean>(false);
    const [isSingleGuestMode, setIsSingleGuestMode] = useState<boolean>(false);
    const [lastName, setLastName] = useState<string>("");
    const showWarningMsg = (msg: string) => {
        messageApi.warning(msg);
    };
    const [getAllFilials, {
        data: filials,
        isLoading: isFilialsLoading
    }] = filialAPI.useGetAllMutation();
    useEffect(() => {
        getAllFilials();
    }, []);
    const confirmHandler = () => {
        showWarningMsg("Отчет начал формироваться")
        let tmpButton = document.createElement('a')
        if (isFullReport) {
            if (dateRange) {
                let dateStart = dateRange[0].format('DD-MM-YYYY');
                let dateFinish = dateRange[1].format('DD-MM-YYYY');
                tmpButton.href = `${host}/hotels/api/report/getFilialReport?id=${-123}&checkouted=${true}&dateStart=${dateStart}&dateFinish=${dateFinish}&fullReport=${true}`
                tmpButton.click();
            } else {
                showWarningMsg("Не все поля заполнены");
            }
        } else {
            if (isSingleGuestMode) {
                if (dateRange && lastName.trim()) {
                    let dateStart = dateRange[0].format('DD-MM-YYYY');
                    let dateFinish = dateRange[1].format('DD-MM-YYYY');
                    tmpButton.href = `${host}/hotels/api/report/getFilialReportByFIO?lastName=${lastName.trim()}&dateStart=${dateStart}&dateFinish=${dateFinish}&fullReport=${false}`
                    tmpButton.click();
                } else {
                    showWarningMsg("Не все поля заполнены");
                }
            } else {
                if (dateRange && selectedFilialId) {
                    let dateStart = dateRange[0].format('DD-MM-YYYY');
                    let dateFinish = dateRange[1].format('DD-MM-YYYY');
                    tmpButton.href = `${host}/hotels/api/report/getFilialReport?id=${selectedFilialId}&checkouted=${isDefault}&dateStart=${dateStart}&dateFinish=${dateFinish}&fullReport=${false}`
                    tmpButton.click();
                } else {
                    showWarningMsg("Не все поля заполнены");
                }
            }
        }
    }
    return (
        <Modal title={"Отчет о проживающих"}
               open={props.visible}
               onOk={confirmHandler}
               onCancel={() => props.setVisible(false)}
               okText={"Сформировать"}
               width={'650px'}
               maskClosable={false}
               loading={isFilialsLoading}
        >
            {messageContextHolder}
            <Flex gap={'small'} vertical={true}>
                {!isFullReport &&
                    <>
                        <Flex>
                            <div style={{width: 170}}>Отчет по жильцу</div>
                            <Switch checked={isSingleGuestMode} onChange={(e) => setIsSingleGuestMode(e)}/>
                        </Flex>
                        {isSingleGuestMode ?
                            <>
                                <Flex align={"center"}>
                                    <div style={{width: 170}}>Фамилия</div>
                                    <Input style={{width: 400}} value={lastName} onChange={(e) => setLastName(e.target.value)}/>
                                </Flex>
                            </>
                            :
                            <Flex align={"center"}>
                                <div style={{width: 170}}>Выберите филиал</div>
                                <Select
                                    style={{width: 400}}
                                    value={selectedFilialId}
                                    placeholder={"Выберите филиал"}
                                    onChange={(e) => setSelectedFilialId(e)}
                                    options={filials?.filter((filial: FilialModel) => !filial.excluded).map((filial: FilialModel) => ({value: filial.id, label: filial.name}))}
                                    allowClear={true}
                                    showSearch
                                    filterOption={(inputValue, option) => (option?.label.toLowerCase() ?? '').includes(inputValue.toLowerCase())}
                                    filterSort={(optionA, optionB) => (optionA?.label ?? '').toLowerCase().localeCompare((optionB?.label ?? '').toLowerCase())}
                                />
                            </Flex>
                        }
                        {!isSingleGuestMode &&
                            <Flex>
                                <div style={{width: 170}}>Включая выселенных</div>
                                <Switch checked={isDefault} onChange={(e) => setIsDefault(e)}/>
                            </Flex>
                        }
                    </>
                }
                <Flex align={"center"}>
                    <div style={{width: 170}}>Период формирования</div>
                    {/*//@ts-ignore*/}
                    <RangePicker style={{width: 400}} format={"DD-MM-YYYY"} value={dateRange} onChange={(e) => {
                        setDateRange(e as any)
                    }}/>
                </Flex>
                <Flex>
                    <div style={{width: 170}}>Полный отчет</div>
                    <Switch checked={isFullReport} onChange={(e) => setIsFullReport(e)}/>
                </Flex>
            </Flex>
        </Modal>
    );
};
