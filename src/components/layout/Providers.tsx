"use client";

import { useEffect, type ReactNode } from "react";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import { Provider } from "react-redux";
import BrandTheme from "@/components/layout/BrandTheme";
import ConfirmProvider from "@/components/ui/ConfirmProvider";
import ErrorNotice from "@/components/ui/ErrorNotice";
import { store } from "@/store";
import { loadAll } from "@/store/thunks";
import { todayKey } from "@/utils/date";
import theme from "@/utils/theme";

const Providers = ({ children }: { children: ReactNode }) => {
  useEffect(() => {
    store.dispatch(loadAll());
    const reloadOnNewDay = () => {
      const isNewDay = store.getState().auth.today !== todayKey();
      if (document.visibilityState === "visible" && isNewDay) store.dispatch(loadAll());
    };
    document.addEventListener("visibilitychange", reloadOnNewDay);
    return () => document.removeEventListener("visibilitychange", reloadOnNewDay);
  }, []);

  return (
    <AppRouterCacheProvider options={{ enableCssLayer: true }}>
      <ThemeProvider theme={theme} defaultMode="system" disableTransitionOnChange>
        <Provider store={store}>
          <BrandTheme />
          <ErrorNotice>
            <ConfirmProvider>{children}</ConfirmProvider>
          </ErrorNotice>
        </Provider>
      </ThemeProvider>
    </AppRouterCacheProvider>
  );
};

export default Providers;
