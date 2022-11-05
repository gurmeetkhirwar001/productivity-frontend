import React, { useState } from "react";
import {
  Input,
  Button,
  FormItem,
  FormContainer,
  Alert,
  Dialog,
} from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";
import { onSignInSuccess } from "store/auth/sessionSlice";
import { setUser } from "store/auth/userSlice";
import { apiSignUp, apiValidateUser } from "services/AuthService";
import appConfig from "configs/app.config";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import { DefaultBody, encryptMessage } from "utils/common";

const validationSchema = Yup.object().shape({
  userName: Yup.string().required("Please enter your user name"),
  email: Yup.string()
    .email("Invalid email")
    .required("Please enter your email"),
  password: Yup.string().required("Please enter your password"),
});

const SignUpForm = (props) => {
  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const [message, setMessage] = useTimeOutMessage();

  const onSignUp = async (values, setSubmitting) => {
    const { useremail, userpw, username, usermobile } = values;
    setSubmitting(true);
    try {
      console.log("sumitined values");
      const validatedbody = {
        ...DefaultBody,
        data: { useremail: useremail },
        usercode: 136,
        event: "validateuser",
        action: "get",
      };

      const signupBody = {
        ...DefaultBody,
        data: {
          useremail: `,${useremail},`,
          userpw: `${userpw}`,
          usermobile: `,${usermobile},`,
          userename: `,${username},`,
        },
        usercode: 136,
        event: "signupuser",
        action: "create",
      };
      const encryptedValidatedbody = encryptMessage(validatedbody);
      const encryptedSignupbody = encryptMessage(signupBody);
      const validateresp = await apiValidateUser({
        body: encryptedValidatedbody,
      });
      if (validateresp?.data?.is_success == true) {
        const resp = await apiSignUp({ body: encryptedSignupbody });
        if (resp.data) {
          setSubmitting(false);
          const { token } = resp.data;
          dispatch(onSignInSuccess(token));
          if (resp.data.user) {
            dispatch(
              setUser(
                resp.data.user || {
                  avatar: "",
                  userName: "Anonymous",
                  authority: ["USER"],
                  email: "",
                }
              )
            );
          }
          setMessage("User Register SuccessFully");
          setOpen(false);
          //   navigate(appConfig.tourPath);
        }
      } else {
        setMessage("Email Already Exist");
      }
    } catch (errors) {
      setMessage(errors?.response?.data?.message || errors.toString());
      setSubmitting(false);
    }
  };

  return (
    <div className={className}>
      {message && (
        <Alert className="mb-4" type="danger" showIcon>
          {message}
        </Alert>
      )}
      <Formik
        initialValues={{
          username: "",
          userpw: "",
          useremail: "",
          usermobile: "",
        }}
        // validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          if (!disableSubmit) {
            onSignUp(values, setSubmitting);
          } else {
            setSubmitting(false);
          }
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="User Name"
                invalid={errors.username && touched.username}
                errorMessage={errors.username}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="username"
                  placeholder="User Name"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Email"
                invalid={errors.useremail && touched.useremail}
                errorMessage={errors.useremail}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="useremail"
                  placeholder="Email"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Password"
                invalid={errors.userpw && touched.userpw}
                errorMessage={errors.userpw}
              >
                <Field
                  autoComplete="off"
                  name="userpw"
                  placeholder="Password"
                  component={PasswordInput}
                />
              </FormItem>
              <FormItem
                label="Mobile"
                invalid={errors.usermobile && touched.usermobile}
                errorMessage={errors.usermobile}
              >
                <Field
                  autoComplete="off"
                  name="usermobile"
                  placeholder="Mobile"
                  component={Input}
                />
              </FormItem>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? "Creating Account..." : "Sign Up"}
              </Button>
              <div className="mt-4 text-center">
                <span>Already have an account? </span>
                <ActionLink to={signInUrl}>Sign in</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
      <Dialog isOpen={open} onClose={() => setOpen(!open)}>
        <h4 className="text-center">Signup Confirmation</h4>
        Thank you for Signin Up with Productivity. please check your mail for
        further setup before login.
        <div className="text-center">
          <Button
            style={{
              marginTop: "1rem",
            }}
            onClick={() => navigate("/sign-in")}
          >
            Close
          </Button>{" "}
        </div>
      </Dialog>
    </div>
  );
};

export default SignUpForm;
