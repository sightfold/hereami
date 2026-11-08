import { useEffect } from "react";
import { useRouter } from "next/navigation";

const useRedirect = (shouldGo: boolean, to: string) => {
  const router = useRouter();

  useEffect(() => {
    if (shouldGo) router.replace(to);
  }, [shouldGo, to, router]);
};

export default useRedirect;
