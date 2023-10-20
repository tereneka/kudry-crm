import { nanoid } from 'nanoid';
import React, { useState, useEffect } from 'react'
import { categores, Category, masters, Registration, Service, services } from '../data'
import { Select } from 'antd';

interface Props {
    data: { master: number, date: string, time: number } | undefined
}

export default function Test({ data }: Props) {
    const [registration, setRegistration] = useState<Registration>({
        name: '',
        phone: '',
        serviceId: [],
        masterId: data?.master || 0,
        date: data?.date || '',
        time: data?.time || 0,
    });

    const currentMaster = masters.find(master => data && master.id === data.master);
    const currentCategores = setCategores();

    const [categorySelectValue, setCategorySelectValue] = useState(currentCategores[0].id)
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
        console.log(value);
        setCategorySelectValue(value)
        setFiltredServices(setServices(value))
    }

    return (
        <div className='reg-popup'>
            <form className='reg-popup__form' name='regForm' method='post'>
                {currentCategores.length > 1 &&
                    <Select
                        value={categorySelectValue}
                        options={currentCategores.map(category => {
                            return { value: category.id, label: category.name }
                        })}
                        onChange={handleCategorySelect}
                        style={{ width: 120 }}

                    />
                    // <label>
                    //     категория услуг
                    //     <select
                    //         name="category"
                    //         id=""
                    //         required
                    //         value={categorySelectValue}
                    //         onChange={handleCategorySelect}
                    //     >
                    //         {currentCategores.map(category => {
                    //             return (
                    //                 <option value={category.id} key={nanoid()}>
                    //                     {category.name}
                    //                 </option>
                    //             )
                    //         })}
                    //     </select>
                    // </label>
                }

                <label>
                    услуга
                    <select
                        name="service"
                        id=""
                        required
                        multiple
                    // defaultValue={filtredServices[0].id}
                    // onChange={}
                    >
                        {filtredServices.map(service => {
                            return (
                                <option value={service.id} key={nanoid()}>
                                    {service.name}
                                </option>
                            )
                        })}
                    </select>
                </label>

            </form>
        </div>
    )
}
