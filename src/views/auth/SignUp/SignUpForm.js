import React, { useEffect, useState } from "react";
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
import { useDebounce } from "use-debounce";
const validationSchema = Yup.object().shape({
  username: Yup.string().required("Please enter your user name"),
  userpw: Yup.string()
    .required("Please enter your password")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      `Must Contain 8 Characters,
       One Uppercase, One Lowercase, 
       One Number and 
       One Special Case Character`
    ),
  confirmpassword: Yup.string().oneOf(
    [Yup.ref("userpw"), null],
    "Passwords must match"
  ),
});

const SignUpForm = (props) => {
  const { disableSubmit = false, className, signInUrl = "/sign-in" } = props;
  const [open, setOpen] = useState(false);
  const [emailMessage, setEmailMessage] = useState("");
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [value] = useDebounce(email, 1000);
  const navigate = useNavigate();
  const [textColor, setTextColor] = useState("green");
  const [message, setMessage] = useTimeOutMessage();
  useEffect(() => {
    async function validateUser(value) {
      console.log(value, "value");
      const validatedbody = {
        ...DefaultBody,
        data: { useremail: value },
        usercode: 136,
        event: "validateuser",
        action: "get",
      };
      const encryptedValidatedbody = encryptMessage(validatedbody);
      try {
        if (value !== "") {
          const validateresp = await apiValidateUser({
            body: encryptedValidatedbody,
          });
          setEmailMessage(validateresp.data.message);
          setTextColor("green");
        }
      } catch (e) {
        console.log(e.response.data.message, "errrr");
        setTextColor("red");
        setEmailMessage(e.response.data.message);
      }
    }
    validateUser(value);
  }, [value]);
  const onSignUp = async (values, setSubmitting, resetForm) => {
    console.log("jjsjsjs callings");
    const { useremail, userpw, username, usermobile } = values;
    setSubmitting(true);
    try {
      const signupBody = {
        ...DefaultBody,
        data: {
          useremail: `${email}`,
          userpw: `${userpw}`,
          usermobile: `${usermobile}`,
          userename: ``,
        },
        usercode: 136,
        event: "signupuser",
        action: "create",
      };

      const encryptedSignupbody = encryptMessage(signupBody);
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
        setOpen(true);
        resetForm();
        //   navigate(appConfig.tourPath);
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
          usermobile: "",
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting, resetForm }) => {
          console.log(values);
          if (!disableSubmit) {
            onSignUp(values, setSubmitting, resetForm);
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
                <Input
                  onChange={(e) => setEmail(e.target.value)}
                  name="useremail"
                />
                <p style={{ color: textColor }}>{emailMessage}</p>
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
                label="Confirm Password"
                invalid={errors.confirmpassword && touched.confirmpassword}
                errorMessage={errors.confirmpassword}
              >
                <Field
                  autoComplete="off"
                  name="confirmpassword"
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
              <div className="social-link">
                <img src="/img/social/google.png" />
                <img src="/img/social/fb.png" />
                <img src="/img/social/saml.png" />
                <img src="/img/social/aplelogo.png" />
                <img src="/img/social/azure.png" />
              </div>
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
