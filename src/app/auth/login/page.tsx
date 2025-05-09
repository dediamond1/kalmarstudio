"use client";
import { useEffect, useState } from "react";
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

const LoginSchema = Yup.object().shape({
  email: Yup.string()
    .email("Please enter a valid email address.")
    .required("Email is required."),
  password: Yup.string()
    .min(6, "Password must be at least 6 characters.")
    .required("Password is required."),
});

export default function LoginPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleAuthError = (error: any) => {
    const msg = error?.message?.toLowerCase() || "";
    if (msg.includes("unauthorized") || msg.includes("invalid")) {
      return "Invalid email or password.";
    }
    return "Login failed. Please try again later.";
  };

  const loggedInUther = async () => {
    const session = await authClient.getSession();
    console.log(session);
  };

  useEffect(() => {
    loggedInUther();
  }, []);

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
              Login
            </h1>

            {generalError && (
              <div className="text-red-500 text-sm mb-4 text-center">
                {generalError}
              </div>
            )}

            <Formik
              initialValues={{ email: "", password: "" }}
              validationSchema={LoginSchema}
              onSubmit={async (values) => {
                setIsSubmitting(true);
                setGeneralError("");
                try {
                  const { data, error } = await authClient.signIn.email({
                    email: values.email,
                    password: values.password,
                    rememberMe: false,
                  });
                  if (error) {
                    const message = handleAuthError(error);
                    setGeneralError(message);
                    toast.error(message);
                    return;
                  }
                  toast.success("Login successful");
                  router.push("/dashboard");
                } catch (err) {
                  console.error("Unexpected login error:", err);
                  setGeneralError(
                    "A technical error occurred. Please try again later."
                  );
                  toast.error("Something went wrong.");
                } finally {
                  setIsSubmitting(false);
                }
              }}
            >
              {({ errors, touched }) => (
                <Form className="space-y-5">
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

                  <div className="text-sm text-right">
                    <Link
                      href="/auth/forgot-password"
                      className="text-primary hover:underline"
                    >
                      Forgot Password?
                    </Link>
                  </div>

                  <motion.div whileTap={{ scale: 0.97 }}>
                    <Button
                      type="submit"
                      className="w-full h-12 text-lg"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                  </motion.div>

                  <p className="text-sm text-muted-foreground text-center mt-4">
                    Don't have an account?{" "}
                    <Link
                      href="/auth/register"
                      className="text-primary hover:underline"
                    >
                      Register
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
