const FormError = ({ message }: { message?: string }) =>
  message ? <p className="rounded-lg bg-bad-soft px-3 py-2 text-sm text-bad">{message}</p> : null;

export default FormError;
