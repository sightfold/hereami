"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import Alert from "@mui/material/Alert";
import Snackbar from "@mui/material/Snackbar";
import { errorMessage } from "@/utils/error";

const ErrorNoticeContext = createContext<(error: unknown) => void>(() => undefined);

type Pending = { unwrap: () => Promise<unknown> };

export const useRunAction = () => {
  const notify = useContext(ErrorNoticeContext);
  return (pending: Pending) =>
    pending.unwrap().then(
      () => true,
      (error: unknown) => {
        notify(error);
        return false;
      },
    );
};

const ErrorNotice = ({ children }: { children: ReactNode }) => {
  const [message, setMessage] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const notify = useCallback((error: unknown) => {
    setMessage(errorMessage(error));
    setIsOpen(true);
  }, []);

  return (
    <ErrorNoticeContext value={notify}>
      {children}
      <Snackbar
        open={isOpen}
        autoHideDuration={5000}
        onClose={() => setIsOpen(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert severity="error" variant="filled" onClose={() => setIsOpen(false)}>
          {message}
        </Alert>
      </Snackbar>
    </ErrorNoticeContext>
  );
};

export default ErrorNotice;
