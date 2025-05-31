"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { useUserStore } from "@/store/user";

const RegisterSchema = Yup.object().shape({
  name: Yup.string()
    .min(2, "Name must be at least 2 characters.")
    .required("Name is required."),
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref("password")], "Passwords must match.")
    .required("Confirm your password."),
});

export default function RegisterPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleAuthError = (error: { message?: string }) => {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("already") || msg.includes("exists")) {
      return "An account with this email already exists.";
    }
    return "Registration failed. Please try again later.";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <motion.div
        className="w-full max-w-md"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="border border-border bg-card backdrop-blur-sm rounded-2xl">
          <CardContent className="p-8">
            <h1 className="text-3xl font-bold text-foreground mb-6 text-center">
              Create Your Account
            </h1>

            {generalError && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {generalError}
              </div>
            )}

            <Formik
              initialValues={{
                name: "",
                email: "",
                password: "",
                confirmPassword: "",
              }}
              validationSchema={RegisterSchema}
              onSubmit={async (values) => {
                setIsSubmitting(true);
                setGeneralError("");
                try {
                  // console.log("[Register.tsx] newUser: ", newUser);
                  const { error } = await authClient.signUp.email({
                    name: values.name,
                    email: values.email,
                    password: values.password,
                    callbackURL: "/",
                  });
                  if (error) {
                    const message = handleAuthError(error);
                    setGeneralError(message);
                    toast.error(error.message);
                    return;
                  }

                  // Set user role via API
                  const roleResponse = await fetch("/api/auth/register", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      name: values.name,
                      email: values.email,
                      userId: values.email, // Using email as userId for simplicity
                    }),
                  });

                  if (!roleResponse.ok) {
                    throw new Error("Failed to set user role");
                  }

                  // Fetch and save user data using store method
                  await useUserStore.getState().fetchUserByEmail(values.email);
                  router.back();
                  toast.success("Registration successful!");
                } catch (err) {
                  console.error("Registration error:", err);
                  const message =
                    "An unexpected error occurred. Please try again later.";
                  setGeneralError(message);
                  toast.error(message);
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-5">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Name
                    </label>
                    <Field
                      as={Input}
                      name="name"
                      placeholder="Your name"
                      className={`w-full h-12 text-base ${
                        errors.name && touched.name ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="name"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Email
                    </label>
                    <Field
                      as={Input}
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      className={`w-full h-12 text-base ${
                        errors.email && touched.email ? "border-red-500" : ""
                      }`}
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Password
                    </label>
                    <Field
                      as={Input}
                      type="password"
                      name="password"
                      placeholder="••••••••"
                      className={`w-full h-12 text-base ${
                        errors.password && touched.password
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="password"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-1">
                      Confirm Password
                    </label>
                    <Field
                      as={Input}
                      type="password"
                      name="confirmPassword"
                      placeholder="••••••••"
                      className={`w-full h-12 text-base ${
                        errors.confirmPassword && touched.confirmPassword
                          ? "border-red-500"
                          : ""
                      }`}
                    />
                    <ErrorMessage
                      name="confirmPassword"
                      component="div"
                      className="text-red-500 text-xs mt-1"
                    />
                  </div>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Registering..." : "Register"}
                    </Button>
                  </motion.div>

                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Already have an account?{" "}
                    <Link
                      href="/auth/login"
                      className="text-primary hover:underline"
                    >
                      Login
                    </Link>
                  </p>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
