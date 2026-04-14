import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { loginUser } from "@/Store/features/user/user.auth.slice";
import React from "react";
import { useForm } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const UserLogin = () => {
  const form = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    const toastId = toast.loading("Logging in...");

    try {
      const result = await dispatch(loginUser(data)).unwrap();

      toast.success(result.msg || "Login successful!", {
        id: toastId,
      });

      form.reset();
      navigate("/user/dashboard");
    } catch (error) {
      console.log(error);
      toast.error(
        typeof error === "string" ? error : error?.message || "Login failed",
        { id: toastId },
      );
    }
  };

  return (
    <div className="container py-20">
      <h1 className="text-4xl text-center font-bold mb-4">User Login</h1>

      <form
        className="max-w-md mx-auto mt-8"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Email
          </label>
          <Input
            type="email"
            id="email"
            {...form.register("email", { required: "Email is required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {form.formState.errors.email && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.email.message}
            </p>
          )}
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 mb-2" htmlFor="email">
            Password
          </label>
          <Input
            type="password"
            id="password"
            {...form.register("password", { required: "Password is required" })}
            className="w-full px-3 py-2 border rounded"
          />
          {form.formState.errors.password && (
            <p className="text-red-500 text-sm mt-1">
              {form.formState.errors.password.message}
            </p>
          )}
        </div>
        <div>
          <Button type="submit" className="w-full">
            Login
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UserLogin;
