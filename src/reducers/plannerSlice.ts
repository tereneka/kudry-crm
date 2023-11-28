import {
  PayloadAction,
  createSlice,
} from '@reduxjs/toolkit';

type TodoListName = 'reg' | 'notes';
type FormName =
  | ''
  | 'addReg'
  | 'addNote'
  | 'editNote';

interface PlannerState {
  currentTodoListName: TodoListName;
  openedFormName: FormName;
  isFormActive: boolean;
}
const initialState: PlannerState = {
  currentTodoListName: 'reg',
  openedFormName: '',
  isFormActive: false,
};

const plannerSlice = createSlice({
  name: 'planner',
  initialState,
  reducers: {
    setCurrentTodoListName: (
      state,
      action: PayloadAction<TodoListName>
    ) => {
      state.currentTodoListName = action.payload;
    },

    setOpenedFormName: (
      state,
      action: PayloadAction<FormName>
    ) => {
      state.openedFormName = action.payload;
    },

    setIsFormActive: (
      state,
      action: PayloadAction<boolean>
    ) => {
      state.isFormActive = action.payload;
    },
  },
});

export const {
  setCurrentTodoListName,
  setOpenedFormName,
  setIsFormActive,
} = plannerSlice.actions;

export default plannerSlice.reducer;
