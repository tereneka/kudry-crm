import { Timestamp } from 'firebase/firestore';

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
  priceDivider?: number;
}

interface Registration {
  userId: string;
  serviceIdList: string[];
  masterId: string;
  date: Date;
  time: string;
  duration: number;
  income: number;
  priceCorrection: number;
  serviceIndex: number;
  gender: 'male' | 'female' | null;
}

interface DbRegistration
  extends Omit<Registration, 'date'> {
  id: string;
  date: Timestamp;
}

interface Income {
  id: string;
  serviceId: string;
  categoryId: string;
  date: Date;
  sum: number;
}

interface RegistrationContext {
  categores: Category[] | undefined;
  masters: Master[] | undefined;
  registrationList: Registration[] | undefined;
}

interface RegUser {
  id: string;
  name: string;
  phone: string;
}

interface Note {
  text: string;
  userId: string | null;
  masterId: string;
  date: Date;
  time: string;
}

interface DbNote extends Omit<Note, 'date'> {
  id: string;
  date: Timestamp;
}

export type {
  Master,
  Category,
  SubCategory,
  Service,
  Registration,
  RegistrationContext,
  DbRegistration,
  Income,
  RegUser,
  Note,
  DbNote,
};
