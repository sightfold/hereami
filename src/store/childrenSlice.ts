import { createSlice } from "@reduxjs/toolkit";
import {
  addChild,
  loadAll,
  moveChildren,
  removeChildClass,
  saveChildClass,
  setChildArchived,
  setChildMark,
  updateChild,
} from "@/store/thunks";
import { removeById, replaceById, upsertById } from "@/utils/list";
import type { Child, ChildClass, ChildMark } from "@/utils/types";

type ChildrenState = { list: Child[]; classes: ChildClass[]; marks: ChildMark[] };

const initialState: ChildrenState = { list: [], classes: [], marks: [] };

const childrenSlice = createSlice({
  name: "children",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loadAll.fulfilled, (state, action) => {
        const { children, childClasses, childMarks } = action.payload.db;
        state.list = children;
        state.classes = childClasses;
        state.marks = childMarks;
      })
      .addCase(addChild.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateChild.fulfilled, (state, action) => {
        state.list = replaceById(state.list, action.payload);
      })
      .addCase(setChildArchived.fulfilled, (state, action) => {
        const { id, archived } = action.payload;
        state.list = state.list.map((item) => (item.id === id ? { ...item, archived } : item));
      })
      .addCase(moveChildren.fulfilled, (state, action) => {
        const { ids, classId } = action.payload;
        state.list = state.list.map((item) =>
          ids.includes(item.id) ? { ...item, classId } : item,
        );
      })
      .addCase(setChildMark.fulfilled, (state, action) => {
        const { childId, serviceId, status } = action.payload;
        state.marks = state.marks.filter(
          (mark) => mark.childId !== childId || mark.serviceId !== serviceId,
        );
        if (status) state.marks.push({ childId, serviceId, status });
      })
      .addCase(saveChildClass.fulfilled, (state, action) => {
        state.classes = upsertById(state.classes, action.payload);
      })
      .addCase(removeChildClass.fulfilled, (state, action) => {
        state.classes = removeById(state.classes, action.payload);
      });
  },
});

export default childrenSlice.reducer;
