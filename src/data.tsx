export interface Category {
    id: number,
    name: string,
}

export interface Service {
    id: number,
    categoryId: number,
    name: string,
    price: number,
    duration: number
}

export interface Master {
    id: number,
    categoryId: number[],
    name: string,
    // нужно добавить фото
}

export interface DisabledTime {
    masterId: number,
    date: string,
    time: number[],
    available: boolean
}

export interface Registration {
    name: string,
    phone: string,
    serviceId: number[],
    masterId: number,
    date: string,
    time: number,
}

const categores: Category[] = [
    {
        id: 1,
        name: 'парикмахерские услуги',
    },
    {
        id: 2,
        name: 'маникюр',
    },
    {
        id: 3,
        name: 'педикюр',
    },
];

const services: Service[] = [
    {
        id: 1,
        categoryId: 1,
        name: 'стрижка',
        price: 1000,
        duration: 1
    },
    {
        id: 2,
        categoryId: 1,
        name: 'окрашивание',
        price: 2000,
        duration: 2
    },
    {
        id: 3,
        categoryId: 2,
        name: 'женский маникюр',
        price: 2000,
        duration: 2
    },
    {
        id: 4,
        categoryId: 2,
        name: 'мужской маникюр',
        price: 1000,
        duration: 1
    },
    {
        id: 5,
        categoryId: 3,
        name: 'педикюр',
        price: 2000,
        duration: 2
    },
];

const masters: Master[] = [
    {
        id: 1,
        categoryId: [1, 2],
        name: 'Ульяна',
        // нужно добавить фото
    },
    {
        id: 2,
        categoryId: [1],
        name: 'Светлана',
    },
    {
        id: 3,
        categoryId: [3],
        name: 'Татьяна',
    }
];

const disabledTime: DisabledTime[] = [
    {
        masterId: 1,
        date: new Date().toLocaleDateString(),
        time: [14, 18, 19],
        available: true,
    },
    {
        masterId: 2,
        date: new Date().toLocaleDateString(),
        time: [11, 12, 13],
        available: true,
    },
    {
        masterId: 3,
        date: '25.01.2023',
        time: [12, 13],
        available: true,
    }
]

const registrations: Registration[] = [
    {
        name: 'Елена',
        phone: '8905839420',
        serviceId: [1, 2],
        masterId: 2,
        date: new Date().toLocaleDateString(),
        time: 11,
    },
    {
        name: 'Ольга',
        phone: '8919591750',
        serviceId: [1],
        masterId: 1,
        date: new Date().toLocaleDateString(),
        time: 14,
    },
    {
        name: 'Екатерина',
        phone: '8985315836',
        serviceId: [3],
        masterId: 1,
        date: new Date().toLocaleDateString(),
        time: 18,
    },
    {
        name: 'Олег',
        phone: '8905453290',
        serviceId: [5],
        masterId: 3,
        date: '25.01.2023',
        time: 12,
    }
]

export { categores, services, masters, disabledTime, registrations }