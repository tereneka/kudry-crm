import {
  createApi,
  fakeBaseQuery,
} from '@reduxjs/toolkit/query/react';
import {
  collection,
  getDocs,
  orderBy,
  query,
  where,
  addDoc,
  increment,
  doc,
  runTransaction,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import {
  ref,
  getDownloadURL,
  list,
} from 'firebase/storage';
import {
  auth,
  db,
  storage,
} from '../db/firebaseConfig';
import {
  Category,
  DbExpenses,
  DbIncome,
  DbNote,
  DbRegistration,
  Expenses,
  ExpensesCategory,
  Income,
  Master,
  Note,
  RegUser,
  Registration,
  Service,
} from '../types';
import { getEarlierDate } from '../utils/date';
import {
  User,
  signInWithEmailAndPassword,
} from 'firebase/auth';

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: fakeBaseQuery(),
  tagTypes: [
    'Master',
    'User',
    'Category',
    'SubCategory',
    'Photo',
    'Service',
    'Registration',
    'Note',
    'Income',
    'Expenses',
    'ExpCategory',
    'Account',
  ],
  endpoints: (builder) => ({
    getMasterList: builder.query<Master[], void>({
      async queryFn() {
        try {
          const mastersQuery = query(
            collection(db, 'masters'),
            orderBy('index')
          );
          const querySnaphot = await getDocs(
            mastersQuery
          );
          let masters: any[] = [];
          querySnaphot?.forEach((doc) => {
            masters.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return { data: masters };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Master'],
    }),

    getUserList: builder.query<RegUser[], void>({
      async queryFn() {
        try {
          const usersQuery = query(
            collection(db, 'users'),
            orderBy('name')
          );
          const querySnaphot = await getDocs(
            usersQuery
          );
          let users: any[] = [];
          querySnaphot?.forEach((doc) => {
            users.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return { data: users };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['User'],
    }),

    getCategoryList: builder.query<
      Category[],
      void
    >({
      async queryFn() {
        try {
          const categoresQuery = query(
            collection(db, 'categores'),
            orderBy('index')
          );
          const querySnaphot = await getDocs(
            categoresQuery
          );
          let categores: any[] = [];
          querySnaphot?.forEach((doc) => {
            categores.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return { data: categores };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Category'],
    }),

    getServiceList: builder.query<
      Service[],
      string | void
    >({
      async queryFn(categoryId) {
        try {
          let servicesQuery;
          if (categoryId) {
            servicesQuery = query(
              collection(db, 'services'),
              where(
                'categoryId',
                '==',
                categoryId
              )
            );
          } else {
            servicesQuery = query(
              collection(db, 'services'),
              orderBy('index')
            );
          }

          const querySnaphot = await getDocs(
            servicesQuery
          );
          let services: any[] = [];
          querySnaphot?.forEach((doc) => {
            services.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return {
            data: services.sort(
              (a, b) => a.index - b.index
            ),
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Service'],
    }),

    getPhotoList: builder.query<
      string[][],
      {
        folderPath: string;
        numberPhotosPerPage: number;
      }
    >({
      async queryFn(args) {
        try {
          const listRef = ref(
            storage,
            args.folderPath
          );
          const photosList = await (
            await list(listRef)
          ).items.map((i) => i.fullPath);
          let data: any[] = [];

          for (
            let i = 0;
            i < photosList.length;
            i += args.numberPhotosPerPage
          ) {
            data.push(
              photosList.slice(
                i,
                i + args.numberPhotosPerPage
              )
            );
          }
          return { data };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Photo'],
    }),

    getPhoto: builder.query<
      string | undefined,
      string
    >({
      async queryFn(path) {
        if (path) {
          try {
            const photoRef = ref(storage, path);
            const url = await getDownloadURL(
              photoRef
            );
            return { data: url };
          } catch (error) {
            return { error };
          }
        } else return {};
      },
      providesTags: ['Photo'],
    }),

    getRegistrationList: builder.query<
      DbRegistration[],
      number | void
    >({
      async queryFn(num) {
        try {
          const registrationsQuery =
            typeof num === 'number'
              ? query(
                  collection(db, 'registrations'),
                  where(
                    'date',
                    '>=',
                    getEarlierDate(num)
                  )
                )
              : query(
                  collection(db, 'registrations')
                );
          const querySnaphot = await getDocs(
            registrationsQuery
          );
          let registrations: any[] = [];
          querySnaphot?.forEach((doc) => {
            registrations.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return {
            data: registrations,
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Registration'],
    }),

    addRegistration: builder.mutation<
      string,
      Omit<Registration, 'id'>
    >({
      queryFn(body) {
        const registrationRef = collection(
          db,
          'registrations'
        );
        return addDoc(registrationRef, body)
          .then((data) => {
            return data.id;
          })
          .catch((err) => err);
      },
      invalidatesTags: ['Registration'],
    }),

    updateRegistration: builder.mutation<
      any,
      { id: string; body: Partial<Registration> }
    >({
      async queryFn({ id, body }) {
        const registrationRef = doc(
          db,
          'registrations',
          id
        );

        try {
          const data = await updateDoc(
            registrationRef,
            body
          );

          return { data };
        } catch (error: any) {
          return { error };
        }
      },
      invalidatesTags: ['Registration'],
    }),

    deleteRegistration: builder.mutation<
      void,
      string
    >({
      async queryFn(id) {
        const registrationRef = doc(
          db,
          'registrations',
          id
        );

        try {
          const data = await deleteDoc(
            registrationRef
          );

          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['Registration'],
    }),

    getNoteList: builder.query<
      DbNote[],
      number | void
    >({
      async queryFn(num) {
        try {
          const notesQuery =
            typeof num === 'number'
              ? query(
                  collection(db, 'notes'),
                  where(
                    'date',
                    '>=',
                    getEarlierDate(num)
                  )
                )
              : query(collection(db, 'notes'));
          const querySnaphot = await getDocs(
            notesQuery
          );
          let notes: any[] = [];
          querySnaphot?.forEach((doc) => {
            notes.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return {
            data: notes,
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Note'],
    }),

    addNote: builder.mutation<string, Note>({
      queryFn(body) {
        const noteRef = collection(db, 'notes');
        return addDoc(noteRef, body)
          .then((data) => {
            return data.id;
          })
          .catch((err) => err);
      },
      invalidatesTags: ['Note'],
    }),

    updateNote: builder.mutation<
      any,
      { id: string; body: Partial<Note> }
    >({
      async queryFn({ id, body }) {
        const noteRef = doc(db, 'notes', id);

        try {
          const data = await updateDoc(
            noteRef,
            body
          );

          return { data };
        } catch (error: any) {
          return { error };
        }
      },
      invalidatesTags: ['Note'],
    }),

    deleteNote: builder.mutation<void, string>({
      async queryFn(id) {
        const noteRef = doc(db, 'notes', id);

        try {
          const data = await deleteDoc(noteRef);

          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['Note'],
    }),

    addUser: builder.mutation<
      string,
      Omit<RegUser, 'id'>
    >({
      async queryFn(body) {
        const userRef = collection(db, 'users');
        try {
          const data = await addDoc(
            userRef,
            body
          );

          return { data: data.id };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['User'],
    }),

    getIncomeList: builder.query<
      DbIncome[],
      { startDate: Date; endDate: Date }
    >({
      async queryFn(args) {
        const { startDate, endDate } = args;

        try {
          const incomeQuery = query(
            collection(db, 'income'),
            where(
              'date',
              '>=',
              new Date(
                startDate.setHours(0, 0, 0, 0)
              )
            ),
            where(
              'date',
              '<=',
              new Date(
                endDate.setHours(0, 0, 0, 0)
              )
            )
          );
          const querySnaphot = await getDocs(
            incomeQuery
          );
          let income: any[] = [];
          querySnaphot?.forEach((doc) => {
            income.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return {
            data: income,
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Income'],
    }),

    updateIncome: builder.mutation<
      void,
      Omit<Income, 'id'>
    >({
      async queryFn(args) {
        const {
          serviceId,
          categoryId,
          date,
          sum,
        } = args;
        const incomeId =
          serviceId + date.toLocaleDateString();
        const docRef = doc(
          db,
          'income',
          incomeId
        );
        try {
          const data = await runTransaction(
            db,
            async (transaction) => {
              const incomeDoc =
                await transaction.get(docRef);
              const initialSum: number =
                incomeDoc.data()?.sum;
              if (
                !incomeDoc.exists() &&
                sum > 0
              ) {
                transaction.set(docRef, {
                  id: incomeId,
                  ...args,
                });
              } else if (initialSum + sum <= 0) {
                transaction.delete(docRef);
              } else {
                transaction.update(docRef, {
                  sum: increment(sum),
                });
              }
            }
          );
          return { data };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['Income'],
    }),

    getExpenseList: builder.query<
      DbExpenses[],
      { startDate: Date; endDate: Date }
    >({
      async queryFn(args) {
        const { startDate, endDate } = args;

        try {
          const expensesQuery = query(
            collection(db, 'expenses'),
            where(
              'date',
              '>=',
              new Date(
                startDate.setHours(0, 0, 0, 0)
              )
            ),
            where(
              'date',
              '<=',
              new Date(
                endDate.setHours(0, 0, 0, 0)
              )
            )
          );
          const querySnaphot = await getDocs(
            expensesQuery
          );
          let expenses: any[] = [];
          querySnaphot?.forEach((doc) => {
            expenses.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return {
            data: expenses,
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['Expenses'],
    }),

    addExpense: builder.mutation<
      string,
      Expenses
    >({
      async queryFn(body) {
        const expRef = collection(db, 'expenses');
        try {
          const data = await addDoc(expRef, body);

          return { data: data.id };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['Expenses'],
    }),

    getExpensesCategoryList: builder.query<
      ExpensesCategory[],
      void
    >({
      async queryFn() {
        try {
          const expensesQuery = query(
            collection(db, 'expCategores')
          );
          const querySnaphot = await getDocs(
            expensesQuery
          );
          let expenses: any[] = [];
          querySnaphot?.forEach((doc) => {
            expenses.push({
              id: doc.id,
              ...doc.data(),
            });
          });
          return {
            data: expenses,
          };
        } catch (error) {
          return { error };
        }
      },
      providesTags: ['ExpCategory'],
    }),

    addExpensesCategory: builder.mutation<
      string,
      Omit<ExpensesCategory, 'id'>
    >({
      async queryFn(body) {
        const categoryRef = collection(
          db,
          'expCategores'
        );
        try {
          const data = await addDoc(
            categoryRef,
            body
          );

          return { data: data.id };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['ExpCategory'],
    }),

    signin: builder.mutation<
      User,
      { email: string; password: string }
    >({
      async queryFn(body) {
        const { email, password } = body;
        try {
          const userCredential =
            await signInWithEmailAndPassword(
              auth,
              email,
              password
            );

          return { data: userCredential.user };
        } catch (error) {
          return { error };
        }
      },
      invalidatesTags: ['Account'],
    }),
  }),
});

export const {
  useGetMasterListQuery,
  useGetUserListQuery,
  useGetCategoryListQuery,
  useGetServiceListQuery,
  useGetPhotoQuery,
  useGetPhotoListQuery,
  useGetRegistrationListQuery,
  useAddRegistrationMutation,
  useUpdateRegistrationMutation,
  useDeleteRegistrationMutation,
  useGetNoteListQuery,
  useAddNoteMutation,
  useUpdateNoteMutation,
  useDeleteNoteMutation,
  useAddUserMutation,
  useGetIncomeListQuery,
  useUpdateIncomeMutation,
  useGetExpenseListQuery,
  useAddExpenseMutation,
  useGetExpensesCategoryListQuery,
  useAddExpensesCategoryMutation,
  useSigninMutation,
} = apiSlice;
