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
import { useDispatch } from "react-redux";
import { setCredentials } from "@/app/features/authSlice";

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
  const dispatch = useDispatch();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generalError, setGeneralError] = useState("");

  const handleAuthError = (error: unknown) => {
    const err = error as { message?: string };
    const msg = err?.message?.toLowerCase() || "";
    if (msg.includes("unauthorized") || msg.includes("invalid")) {
      return "Invalid email or password.";
    }
    return "Login failed. Please try again later.";
  };

  const checkUserRole = async () => {
    try {
      const { data: session, error } = await authClient.getSession();
      if (error) {
        console.error("Session error:", error);
        return;
      }
      console.log("User session:", session);
      if (session?.user) {
        const userWithRole = session.user as { role?: string };
        console.log("User role:", userWithRole.role || "No role found");
      }
    } catch (err) {
      console.error("Error checking role:", err);
    }
  };

  useEffect(() => {
    checkUserRole();
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

                  // Fetch user details from MongoDB
                  const userResponse = await fetch(
                    `/api/users?email=${encodeURIComponent(values.email)}`
                  );
                  if (!userResponse.ok) {
                    throw new Error("Failed to fetch user details");
                  }
                  const userData = await userResponse.json();

                  // Save credentials to Redux store
                  dispatch(
                    setCredentials({
                      token: data?.token || "",
                      user: {
                        email: userData.email,
                        name: userData.name,
                        role: userData.role,
                      },
                    })
                  );

                  // Check user role and redirect accordingly
                  if (userData.role === "admin") {
                    router.push("/dashboard");
                  } else {
                    router.back();
                  }
                  toast.success("Login successful");
                } catch (err) {
                  console.error("Unexpected login error:", err);
                  setGeneralError(
                    "A technical error occurred. Please try again later."
                  );
                  toast.error("Something went wrong.");
                  authClient.signOut();
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
