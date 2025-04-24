"use client";
import { useState } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

const ForgotPasswordSchema = Yup.object().shape({
  email: Yup.string().email("Invalid email").required("Email is required"),
});

export default function ForgotPasswordPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageSent, setMessageSent] = useState(false);

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
            <h1 className="text-3xl font-bold text-foreground mb-6 text-center leading-tight">
              Forgot Password
            </h1>
            {!messageSent ? (
              <>
                <p className="text-sm text-muted-foreground mb-6 text-center leading-relaxed">
                  Enter your email to receive a password reset link.
                </p>
                <Formik
                  initialValues={{ email: "" }}
                  validationSchema={ForgotPasswordSchema}
                  onSubmit={async (values) => {
                    setIsSubmitting(true);
                    await new Promise((r) => setTimeout(r, 1000));
                    setIsSubmitting(false);
                    setMessageSent(true);
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
                            errors.email && touched.email
                              ? "border-red-500"
                              : ""
                          }`}
                        />
                        <ErrorMessage
                          name="email"
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
                          {isSubmitting ? "Sending..." : "Send Reset Link"}
                        </Button>
                      </motion.div>
                    </Form>
                  )}
                </Formik>
              </>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="text-center"
              >
                <p className="text-base text-gray-800 leading-relaxed">
                  If an account with that email exists, we've sent a password
                  reset link. Please check your inbox. If you don't see it,
                  check your spam folder.
                </p>
              </motion.div>
            )}
            <p className="text-sm text-muted-foreground text-center mt-6">
              Back to{" "}
              <Link href="/auth/login" className="text-primary hover:underline">
                Login
              </Link>
            </p>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
