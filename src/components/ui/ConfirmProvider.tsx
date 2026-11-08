"use client";

import { createContext, useCallback, useContext, useState, type ReactNode } from "react";
import Dialog from "@mui/material/Dialog";
import Button from "@/components/ui/Button";

type ConfirmOptions = {
  title: string;
  message?: string;
  confirmLabel?: string;
  isDanger?: boolean;
};

type ConfirmRequest = ConfirmOptions & { resolve: (isConfirmed: boolean) => void };

const ConfirmContext = createContext<(options: ConfirmOptions) => Promise<boolean>>(
  async () => false,
);

export const useConfirm = () => useContext(ConfirmContext);

const ConfirmProvider = ({ children }: { children: ReactNode }) => {
  const [request, setRequest] = useState<ConfirmRequest | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const confirm = useCallback(
    (options: ConfirmOptions) =>
      new Promise<boolean>((resolve) => {
        setRequest({ ...options, resolve });
        setIsOpen(true);
      }),
    [],
  );

  const close = (isConfirmed: boolean) => {
    request?.resolve(isConfirmed);
    setIsOpen(false);
  };

  return (
    <ConfirmContext value={confirm}>
      {children}
      <Dialog
        open={isOpen}
        onClose={() => close(false)}
        fullWidth
        maxWidth="xs"
        aria-labelledby="confirm-title"
        slotProps={{ paper: { className: "m-3 w-full rounded-3xl p-5" } }}
      >
        <h2 id="confirm-title" className="text-lg font-semibold">
          {request?.title}
        </h2>
        {request?.message && <p className="mt-2 text-sm text-muted">{request.message}</p>}
        <div className="mt-6 flex justify-end gap-2">
          <Button variant="outline" onClick={() => close(false)}>
            Cancel
          </Button>
          <Button
            variant={request?.isDanger ? "danger" : "primary"}
            onClick={() => close(true)}
            autoFocus
          >
            {request?.confirmLabel ?? "Confirm"}
          </Button>
        </div>
      </Dialog>
    </ConfirmContext>
  );
};

export default ConfirmProvider;
