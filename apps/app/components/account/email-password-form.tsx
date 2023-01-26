import React from "react";
// next
import Link from "next/link";
// react hook form
import { useForm } from "react-hook-form";
// ui
import { Button, Input } from "components/ui";
import authenticationService from "services/authentication.service";

// types
type EmailPasswordFormValues = {
  email: string;
  password?: string;
  medium?: string;
};

export const EmailPasswordForm = ({ onSuccess }: any) => {
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting, isValid, isDirty },
  } = useForm<EmailPasswordFormValues>({
    defaultValues: {
      email: "",
      password: "",
      medium: "email",
    },
    mode: "onChange",
    reValidateMode: "onChange",
  });

  const onSubmit = (formData: EmailPasswordFormValues) => {
    authenticationService
      .emailLogin(formData)
      .then((response) => {
        onSuccess(response);
      })
      .catch((error) => {
        console.log(error);
        if (!error?.response?.data) return;
        Object.keys(error.response.data).forEach((key) => {
          const err = error.response.data[key];
          console.log("err", err);
          setError(key as keyof EmailPasswordFormValues, {
            type: "manual",
            message: Array.isArray(err) ? err.join(", ") : err,
          });
        });
      });
  };
  return (
    <>
      <form className="mt-5" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Input
            id="email"
            type="email"
            name="email"
            register={register}
            validations={{
              required: "Email ID is required",
              validate: (value) =>
                /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
                  value
                ) || "Email ID is not valid",
            }}
            error={errors.email}
            placeholder="Enter your Email ID"
          />
        </div>
        <div className="mt-5">
          <Input
            id="password"
            type="password"
            name="password"
            register={register}
            validations={{
              required: "Password is required",
            }}
            error={errors.password}
            placeholder="Enter your password"
          />
        </div>
        <div className="mt-2 flex items-center justify-between">
          <div className="ml-auto text-sm">
            <Link href={"/forgot-password"}>
              <a className="font-medium text-theme hover:text-indigo-500">Forgot your password?</a>
            </Link>
          </div>
        </div>
        <div className="mt-5">
          <Button
            disabled={isSubmitting || (!isValid && isDirty)}
            className="w-full text-center"
            type="submit"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </Button>
        </div>
      </form>
    </>
  );
};