import {DataNode} from 'antd/es/tree';
import React, {Key, useState} from 'react';
import {Flex, Image, Tree} from "antd";
//@ts-ignore
import Main from "shared/assets/about/MainPage.png";
//@ts-ignore
import Filial from "shared/assets/about/FilialPage.png";
//@ts-ignore
import Hotel from "shared/assets/about/HotelPage.png";
//@ts-ignore
import Flat from "shared/assets/about/FlatModal.png";
//@ts-ignore
import TechStatus from "shared/assets/about/TechStatus.png";
//@ts-ignore
import CheckIn from "shared/assets/about/CheckIn.png";
//@ts-ignore
import CheckIn1 from "shared/assets/about/CheckIn1.png";
//@ts-ignore
import CheckIn2 from "shared/assets/about/CheckIn2.png";
//@ts-ignore
import OrgCheckIn from "shared/assets/about/OrgCheckIn.png";
//@ts-ignore
import ReasonBilling from "shared/assets/about/ReasonBillingFields.png";
//@ts-ignore
import TimeField from "shared/assets/about/TimeField.png";
//@ts-ignore
import FlatModalBusy from "shared/assets/about/FlatModalBusy.png";
//@ts-ignore
import LockSection from "shared/assets/about/LockSection.png";
//@ts-ignore
import CheckOut from "shared/assets/about/CheckOut.png";
//@ts-ignore
import Report1 from "shared/assets/about/Report1.png";
//@ts-ignore
import Report2 from "shared/assets/about/Report2.png";
//@ts-ignore
import Report3 from "shared/assets/about/Report3.png";

const AboutPage: React.FC = () => {

    // States
    const [selected, setSelected] = useState<Key[]>(['0-0-0']);
    // -----

    // Useful utils
    const treeData: DataNode[] = [
        {
            title: 'Оглавление',
            key: '0-0',
            children: [
                {
                    title: 'Главная страница', key: '0-0-0'
                },
                {
                    title: 'Рабочее место «Дежурного по общежитию»', key: '0-1-0'
                },
                {
                    title: 'Заселение', key: '0-2-0'
                },
                {
                    title: 'Выселение', key: '0-3-0'
                },
                {
                    title: 'Отчетные формы', key: '0-4-0'
                },
            ]
        }
    ];
    // -----

    return (
        <div style={{height: window.innerHeight - 140, paddingTop: '10px'}}>
            <div style={{display: 'flex', justifyContent: 'start'}}>
                <div style={{width: 400}}>
                    <Tree
                        treeData={treeData}
                        defaultExpandAll={true}
                        showIcon={true}
                        showLine={true}
                        onSelect={(e) => {
                            if (e[0] != '0-0-4' && e.length > 0) {
                                setSelected(e)
                            }
                        }}
                    />
                </div>
                <div style={{
                    width: window.innerWidth - 450,
                    fontSize: 16,
                    marginTop: 15,
                    marginBottom: 15,
                    padding: 15,
                    borderRadius: 10,
                    boxShadow: '4px 4px 15px #f0f0f0'
                }}>
                    {(selected[0] === '0-0-0' || selected[0] === '0-0') && <div>
                        <p>Для работы в АРМ в соответствии с местонахождением рабочего места организован доступ для разных категорий пользователей.</p>
                        <p>Доступ в АРМ осуществляется по учетной записи пользователя, текущий пользователь отображается в верхней правой части рабочего окна</p>
                        <p>В соответствии с распределением ролей возможен просмотр/редактирование всех объектов Филиала:</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={700} height={450} src={Main}/>
                        </Flex>
                        <p>либо непосредственно, объектов проживания закрепленных за пользователем:</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={600} height={250} src={Filial}/>
                        </Flex>
                    </div>}
                    {(selected[0] === '0-1-0') && <div>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={800} height={450} src={Hotel}/>
                        </Flex>
                        <p>В карту объекта внесены все помещения, предназначенные для проживания, в том числе «технические», переоборудованные для иных нужд и не используемые для проживания. Для таких
                            помещений предусмотрено изменение статуса помещения:</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={800} height={450} src={Flat}/>
                        </Flex>
                        <p>На главном экране реализована возможность не отображать «технические помещения», при этом количество мест, занятых такими помещениями влияют на загрузку объекта.</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={800} height={100} src={TechStatus}/>
                        </Flex>
                    </div>}
                    {(selected[0] === '0-2-0') && <div>
                        <p>Выбираем номер для заселения – «открыть» - в новом окне выбираем комнату для заселения – «добавить жильца»</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={670} height={400} src={CheckIn}/>
                        </Flex>
                        <p>В открывшемся окне: для работников ООО «Газпром трансгаз Сургут» ставим отметку «работник» и в поле «табельный номер» вводим т.н. работника – «найти», поля ФИО заполняются
                            автоматически.</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={800} height={630} src={CheckIn1}/>
                        </Flex>
                        <br/>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={800} height={630} src={CheckIn2}/>
                        </Flex>
                        <p>Для работников сторонних организаций отметка «работник» не активирована. В поле «организация» из выпадающего списка выбираем организацию.</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={780} height={230} src={OrgCheckIn}/>
                        </Flex>
                        <p>Далее заполняем поля «номер маршрутного листа/служебного задания», «основание» - выбираем из выпадающего списка (вахта, договор, командировка, договор физ. лицо, иное), вид
                            оплаты (наличный, безналичный расчет).</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={750} height={180} src={ReasonBilling}/>
                        </Flex>
                        <p>Выбираем дату и время заезда и выезда. По умолчанию при выбора 00:00 устанавливается расчетное время 12:00.</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={750} height={470} src={TimeField}/>
                        </Flex>
                        <p><strong>Все поля формы должны быть заполнены.</strong></p>
                        <p>Далее нажимаем заселить. Проживающий добавляется в карточку секции/номера. В карточке номера отображаются проживающие, при заполнении доступных мест кнопка «заселить» не
                            отображается.</p>
                        <p>По каждому жильцу есть возможность открыть «карточку жильца», при необходимости скорректировать информацию, запись в базе будет перезаписана .</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={750} height={500} src={FlatModalBusy}/>
                        </Flex>
                        <p>При необходимости размещения жильца в комнату/секцию без возможности подселения другого проживающего, реализована возможность установить статус на помещении «занято» при
                            этом кнопка «заселить» не отображается.</p>
                        <p>А на карточке секции/номера на главном экране отобразится замок.</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={750} height={480} src={LockSection}/>
                        </Flex>
                    </div>}
                    {(selected[0] === '0-3-0') && <div>
                        <p>Выселение жильца производится в карточке секции/номера, нажатием на кнопку «выселить». При необходимости есть возможность сформировать отчетный документ о проживании нажав
                            кнопку «отчетный документ».</p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={730} height={450} src={CheckOut}/>
                        </Flex>
                    </div>}
                    {(selected[0] === '0-4-0') && <div>
                        <p>На главном экране через вкладку «отчеты» реализовано формирование отчетов.</p>
                        <p><strong>Отчет о проживающих. </strong>
                            Выбираем филиал объектов проживания (или можно выбрать конкретного жильца нажав на переключатель «Отчет по жильцу») и период формирования отчета, информация будет выгружена
                            в файл xlsx.
                        </p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={730} height={280} src={Report1}/>
                        </Flex>
                        <p><strong>Расшифровка к реестру (реестр проживающих) </strong>
                            Отображает информацию по проживанию в разрезе филиалов, или организаций (для этого поставьте галочку «Выбор сторонних организаций»)
                        </p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={630} height={680} src={Report2}/>
                        </Flex>
                        <p><strong>Расшифровка к реестру (реестр проживающих) </strong>
                            Отображает информацию по проживанию в разрезе филиалов, или организаций (для этого поставьте галочку «Выбор сторонних организаций»). Далее выбираем: филиал объекта
                            проживания, объект проживания,
                            ответственное лицо филиала,
                            основание проживания (вахта, командировка, договор, договор физ. лицо),
                            дата отчета (реализована возможность выбора как отдельной даты, так и произвольный период),
                            информация будет выгружена в файл xlsx.
                        </p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={630} height={680} src={Report2}/>
                        </Flex>
                        <p><strong>Загрузка общежитий </strong>
                            Отображает информацию о загрузке объектов жилищного фонда. При выборе большого периода, время формирования отчета может занять около пары минут, не спешите закрывать.
                        </p>
                        <Flex style={{width: '100%'}} justify={'center'}>
                            <Image width={730} height={430} src={Report3}/>
                        </Flex>
                    </div>}
                </div>
            </div>
        </div>
    );
};

export default AboutPage;