import { configureStore } from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import attendance from "@/store/attendanceSlice";
import auth from "@/store/authSlice";
import children from "@/store/childrenSlice";
import departments from "@/store/departmentsSlice";
import members from "@/store/membersSlice";
import platform from "@/store/platformSlice";
import roles from "@/store/rolesSlice";
import roster from "@/store/rosterSlice";
import settings from "@/store/settingsSlice";

export const makeStore = () =>
  configureStore({
    reducer: {
      auth,
      attendance,
      roster,
      members,
      departments,
      settings,
      roles,
      platform,
      children,
    },
  });

export const store = makeStore();

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export const useAppDispatch = useDispatch.withTypes<AppDispatch>();
export const useAppSelector = useSelector.withTypes<RootState>();
