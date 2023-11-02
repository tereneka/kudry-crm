interface Master {
  id: string;
  categoryIdList: string[];
  name: string;
  profession: string;
  weekends: number[];
  disabledDates: string[];
  photoLink: string;
  photoUrl: string;
  index: number;
  available: boolean;
  regAvailable: boolean;
}

interface Category {
  id: string;
  name: string;
  hasSubCategores: boolean;
  index: number;
  available: boolean;
  regAvailable: boolean;
}

interface SubCategory {
  id: string;
  categoryId: string;
  name: string;
  index: number;
}

interface Service {
  id: string;
  categoryId: string;
  subCategoryId: string | null;
  name: string;
  price: string;
  duration: number[];
  available: boolean;
  index: number;
  isMale?: boolean;
  isFemale?: boolean;
}

interface Registration {
  userId: string;
  serviceIdList: string[];
  masterId: string;
  date: Date;
  time: string;
  duration: number;
}

interface DbRegistration
  extends Omit<Registration, 'date'> {
  id: string;
  date: { [key: string]: any };
}

interface RegistrationContext {
  categores: Category[] | undefined;
  masters: Master[] | undefined;
  registrationList: Registration[] | undefined;
}

interface User {
  id: string;
  name: string;
  phone: string;
}

export type {
  Master,
  Category,
  SubCategory,
  Service,
  Registration,
  RegistrationContext,
  DbRegistration,
  User,
};
