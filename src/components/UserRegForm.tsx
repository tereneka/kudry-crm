import React, { useState, useEffect } from 'react'
import { Button, Form, Input, Select, Modal, DatePicker } from 'antd';
import dayjs from 'dayjs';
import { categores, disabledTime, masters, services } from '../data';
import type { RangePickerProps } from 'antd/es/date-picker';
import { nanoid } from 'nanoid'

interface FormData {
    category: number,
    serviceId: number[],
    date: dayjs.Dayjs,
}

interface RegData {
    category?: number,
    name: string,
    phone: string,
    serviceId: number[],
    masterId: number,
    date: string,
    time: number,
}

export default function UserRegForm() {
    const [form] = Form.useForm();

    const dateFormat: string = 'DD.MM.YYYY';

    const fieldsetsList = document.querySelectorAll('.reg-form__fieldset');

    const [regData, setRegData] = useState<RegData>({
        name: '',
        phone: '',
        serviceId: [],
        masterId: 0,
        date: '',
        time: 0,
    });
    const [filtredServices, setFiltredServices] = useState(services);
    const [filtredMasters, setFiltredMasters] = useState(masters);
    const [isNextBtnDisabled, setIsNextBtnDisabled] = useState({
        category: !!!regData.category,
        services: regData.serviceId.length < 1,
        masterId: !!!regData.masterId
    });
    const [currentFieldsetIndex, setCurrentFieldsetIndex] = useState(0);

    useEffect(() => {
        setIsNextBtnDisabled({
            category: !!!regData.category,
            services: regData.serviceId.length < 1,
            masterId: !!!regData.masterId
        })
    }, [regData])

    function handleCategorySelect(categoryId: number) {
        setFiltredServices(
            services.filter(service => service.categoryId === categoryId)
        )
        setFiltredMasters(
            masters.filter(master => master.categoryId.some(id => id === categoryId))
        )
    }

    function handleNextBtnClick() {
        fieldsetsList[currentFieldsetIndex].classList.remove('reg-form__fieldset_visible')
        fieldsetsList[currentFieldsetIndex + 1].classList.add('reg-form__fieldset_visible')
        setCurrentFieldsetIndex(currentFieldsetIndex + 1)
    }

    function handleBackBtnClick() {
        fieldsetsList[currentFieldsetIndex].classList.remove('reg-form__fieldset_visible')
        fieldsetsList[currentFieldsetIndex - 1].classList.add('reg-form__fieldset_visible')
        setCurrentFieldsetIndex(currentFieldsetIndex - 1)
    }

    function setDisabledDate(date: dayjs.Dayjs) {
        return date < dayjs().endOf('day')
            ||
            disabledTime
                .filter(i => i.time.length >= 10)
                .some(i => i.date === date.format(dateFormat))
    }


    function handleFormSubmit(formData: FormData) {
        // setRegData({ ...formData, date: formData.date.format(dateFormat) })
    }
    return (
        <Form
            form={form}
            className='reg-form'
            onValuesChange={(changedValue) => {
                setRegData({ ...regData, ...changedValue })
            }
            }
            onFinish={handleFormSubmit}
        >
            <div className='relative-container'>
                <div className='reg-form__fieldset reg-form__fieldset_visible'>
                    <Form.Item
                        name="category"
                        label="категория услуг"
                        rules={[{ required: true, message: 'выберите категорию услуг' }]}
                    >
                        <Select
                            options={categores.map(category => {
                                return { value: category.id, label: category.name }
                            })}
                            onChange={handleCategorySelect}
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="button"
                        disabled={isNextBtnDisabled.category}
                        onClick={handleNextBtnClick}
                    >
                        Далее
                    </Button>
                </div>

                <div className='reg-form__fieldset'>
                    <Form.Item
                        name="serviceId"
                        label="услуги"
                        rules={[{ required: true, message: 'выберите услуги' }]}>
                        <Select
                            options={filtredServices.map(service => {
                                return { value: service.id, label: service.name }
                            })}
                            mode="multiple"
                            allowClear
                        />
                    </Form.Item>

                    <Button
                        type="primary"
                        htmlType="button"
                        onClick={handleBackBtnClick}
                    >
                        Назад
                    </Button>

                    <Button
                        type="primary"
                        htmlType="button"
                        disabled={isNextBtnDisabled.services}
                        onClick={handleNextBtnClick}
                    >
                        Далее
                    </Button>
                </div>

                {filtredMasters.length > 1
                    &&
                    <div className='reg-form__fieldset'>

                        {filtredMasters.map(master => {
                            return (
                                <div
                                    key={master.id}
                                    id={master.id.toString()}
                                    onClick={(e) => {
                                        console.log(e.currentTarget.id);

                                        setRegData({ ...regData, masterId: +e.currentTarget.id })
                                    }}
                                >
                                    <h4 >{master.name}</h4>
                                </div>
                            )
                        })}
                        {/* <Select
                                options={
                                    masters
                                        .filter(master => master.categoryId.some(categoryId => categoryId === regData.category))
                                        .map(master => {
                                            return { value: master.id, label: master.name }
                                        })}
                            /> */}

                        <Button
                            type="primary"
                            htmlType="button"
                            onClick={handleBackBtnClick}
                        >
                            Назад
                        </Button>

                        <Button
                            type="primary"
                            htmlType="button"
                            disabled={isNextBtnDisabled.masterId}
                            onClick={handleNextBtnClick}
                        >
                            Далее
                        </Button>
                    </div>
                }


                <div className='reg-form__fieldset'>
                    <Form.Item
                        label="дата"
                        name="date"
                        rules={[{ required: true, message: 'Please input your password!' }]}
                    >
                        <DatePicker
                            format={dateFormat}
                            disabledDate={setDisabledDate}
                            placeholder='выберите дату'
                            showToday={false}
                        />
                    </Form.Item>

                </div>
            </div>

            <Button type="primary" htmlType="submit" style={{ marginTop: 200 }}>
                Отправить
            </Button>
        </Form>
    )
}
