import { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import Swal from "sweetalert2";
import { AxiosError } from "axios";
import { ILoginRequest } from "../types/login";

const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ILoginRequest) => {
    setLoading(true);
    try {
      await login(values);
    } catch (error: unknown | AxiosError) {
      let errorMessage = "Please retry again later";
      if (error instanceof AxiosError) {
        errorMessage = error?.response?.data?.message;
      }

      await Swal.fire({
        icon: "error",
        title: "Something went wrong!",
        text: errorMessage,
        confirmButtonColor: "#326A8C",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    onFinish,
  };
};

export default useLogin;

