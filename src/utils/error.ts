export const errorMessage = (error: unknown) =>
  (error as { message?: string } | null)?.message ?? "Something went wrong. Try again.";

type SetRootError = (name: "root", error: { message: string }) => void;

export const withRootError =
  <Args extends unknown[]>(setError: SetRootError, action: (...args: Args) => Promise<unknown>) =>
  async (...args: Args) => {
    try {
      await action(...args);
    } catch (error) {
      setError("root", { message: errorMessage(error) });
    }
  };
