import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react'
import { categores, Category, disabledTime, masters, Registration, Service, services } from '../data'
import { Button, Form, Input, Select, Modal } from 'antd';

interface Props {
    data: { master: number, date: string, time: number } | undefined;
    regData: Registration[],
    isModalOpen: boolean;
    setData: React.Dispatch<React.SetStateAction<{
        master: number;
        date: string;
        time: number;
    } | undefined>>;
    setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
    setRegData: React.Dispatch<React.SetStateAction<Registration[]>>;
}

export default function RegForm({ data, regData, isModalOpen, setData, setIsModalOpen, setRegData }: Props) {
    const [form] = Form.useForm();

    const currentMaster = masters.find(master => data && master.id === data.master);
    const currentCategores = setCategores();

    const [categorySelectValue, setCategorySelectValue] = useState(currentCategores[0].id);
    const [filtredServices, setFiltredServices] = useState(
        setServices(currentCategores[0].id)
    );

    useEffect(() => {
        setFiltredServices(setServices(currentCategores[0].id))
    }, [data])

    function setCategores() {
        return categores.filter(category => {
            return currentMaster?.categoryId.some(categoryId => categoryId === category.id)
        })
    }

    function setServices(categoryId: number) {
        return services.filter(service => service.categoryId === categoryId)
    }

    function handleCategorySelect(value: number) {
        setCategorySelectValue(value)
        setFiltredServices(setServices(value))
    }

    // function handleServiceSelect(value: number[]) {
    //     console.log(value);
    // }

    function handleFormSubmit(values: {
        category: number,
        name: string,
        phone: string,
        serviceId: number[],
        masterId: number,
        date: string,
        time: number,
    }) {
        const newReg: {
            category?: number,
            name: string,
            phone: string,
            serviceId: number[],
            masterId: number,
            date: string,
            time: number,
        } = {
            ...values,
            masterId: data?.master || 0,
            date: data?.date || '',
            time: data?.time || 0,
        }
        delete newReg.category
        setRegData([...regData, newReg])

        const timeArr = [newReg.time];
        const regDuration = newReg.serviceId.reduce((accumulator, currentId) => {
            const serviceDuration = services.find(service => service.id === currentId)?.duration
            return accumulator + (serviceDuration || 0)
        }, 0);

        for (let i: number = 1; i < regDuration; i++) {
            timeArr.push(timeArr[0] + i)
        }


        const disabledTimeIndex = disabledTime
            .filter(i => i.masterId === newReg.masterId)
            .findIndex(i => i.date === newReg.date);

        disabledTimeIndex > -1 ?
            disabledTime[disabledTimeIndex].time = [...disabledTime[disabledTimeIndex].time, ...timeArr]
            :
            disabledTime.push({
                masterId: data?.master || 0,
                date: data?.date || '',
                time: timeArr,
                available: true,
            })
    };

    function handleOkBtnClick() {
        form
            .validateFields()
            .then((values) => {
                handleFormSubmit(values);
                form.resetFields();
                setData(undefined)
            })
            .catch((info) => {
                console.log('Validate Failed:', info);
            });
    }

    // function handleResetForm(values: any) {
    //     form.resetFields()
    // }

    return (
        <Modal
            open={isModalOpen}
            title='Добавить запись'
            okText='Создать'
            cancelText='Отменить'
            onCancel={() => {
                setIsModalOpen(false)
                form.resetFields()
                setData(undefined)
            }}
            onOk={handleOkBtnClick}
        >
            <Form
                form={form}
                name="regForm"
                initialValues={
                    {
                        masterId: currentMaster?.name,
                        date: data?.date,
                        time: `${data?.time}:00`,
                        category: categorySelectValue,
                        phone: 8,
                    }
                }
                // onFinish={handleFormSubmit}
                labelCol={{ span: 5 }}
            // style={{ maxWidth: '100%' }}
            >
                <Form.Item name="masterId" label="мастер" rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>
                <Form.Item name="date" label="дата" rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>

                <Form.Item name="time" label="время" rules={[{ required: true }]}>
                    <Input disabled />
                </Form.Item>

                {currentCategores.length > 1 &&
                    <Form.Item name="category" label="категория" rules={[{ required: true }]}>
                        <Select
                            value={categorySelectValue}
                            options={currentCategores.map(category => {
                                return { value: category.id, label: category.name }
                            })}
                            onChange={handleCategorySelect}
                        // style={{ width: 120 }}
                        />
                    </Form.Item>
                }

                <Form.Item name="serviceId" label="услуги" rules={[{ required: true }]}>
                    <Select
                        options={filtredServices.map(service => {
                            return { value: service.id, label: service.name }
                        })}
                        mode="multiple"
                        allowClear
                    />
                </Form.Item>

                <Form.Item name="name" label="имя" rules={[{ required: true }]}>
                    <Input />
                </Form.Item>

                <Form.Item
                    name="phone"
                    label="телефон"
                    rules={[
                        { required: true },
                        { len: 11 },
                    ]}
                >
                    <Input />
                </Form.Item>

                {/* <Form.Item wrapperCol={{ offset: 4, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                    <Button htmlType="button" onClick={handleResetForm}>
                        Reset
                    </Button>
                </Form.Item> */}
            </Form>
        </Modal>
    )
}
