import { Button } from "components/ui";
import React, { useState } from "react";
import Modal from "react-responsive-modal";
import "react-responsive-modal/styles.css";
import { Formik, Form, Field } from "formik";
import { Input, Checkbox, FormItem, FormContainer, Alert } from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";

const SendGridContainer = () => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div className="cloud-connect-container">
        <h1>SendGrid</h1>
        <Button variant="solid" onClick={() => setOpen(!open)}>
          Send Email Notification
        </Button>
      </div>
      <div>
        <Modal open={open} onClose={() => setOpen(!open)}>
          <h3>Send Mail</h3>
          <div>
            <Formik
              initialValues={{
                useremail: "",
                password: "",
                rememberMe: true,
              }}
              //   validationSchema={validationSchema}
              //   onSubmit={(values, { setSubmitting }) => {
              //     console.log(values);
              //     if (!disableSubmit) {
              //       onSignIn(values, setSubmitting);
              //     } else {
              //       setSubmitting(false);
              //     }

              //     // console.log(values, "valuesss");
              //   }}
            >
              {({ touched, errors, isSubmitting }) => (
                <Form>
                  <FormContainer>
                    <FormItem
                      label="Mail Subject"
                      invalid={errors.useremail && touched.useremail}
                      errorMessage={errors.useremail}
                    >
                      <Field
                        type="text"
                        autoComplete="off"
                        name="useremail"
                        placeholder="User Email"
                        component={Input}
                      />
                    </FormItem>
                    <FormItem
                      label="Mail Body"
                      invalid={errors.password && touched.password}
                      errorMessage={errors.password}
                    >
                      <Field
                        autoComplete="off"
                        name="password"
                        type="textarea"
                        placeholder="Password"
                        component={PasswordInput}
                      />
                    </FormItem>
                    <Button
                      block
                      loading={isSubmitting}
                      variant="solid"
                      type="submit"
                    >
                      {isSubmitting ? "Signing in..." : "Sign In"}
                    </Button>
                  </FormContainer>
                </Form>
              )}
            </Formik>
          </div>
        </Modal>
      </div>
    </>
  );
};

export default SendGridContainer;
