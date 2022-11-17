/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import {
  Input,
  Button,
  Checkbox,
  FormItem,
  FormContainer,
  Alert,
} from "components/ui";
import { PasswordInput, ActionLink } from "components/shared";
import useTimeOutMessage from "utils/hooks/useTimeOutMessage";
import { Field, Form, Formik } from "formik";
import * as Yup from "yup";
import useAuth from "utils/hooks/useAuth";
import { msalConfig } from "../Azurelogin/authconfig";
import { DefaultBody, encryptMessage } from "utils/common";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider, useMsal } from "@azure/msal-react";
import AzureLogin from "../Azurelogin";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import FacebookLogin from "react-facebook-login/dist/facebook-login-render-props";
const validationSchema = Yup.object().shape({
  useremail: Yup.string().required("Please enter your user name"),
  password: Yup.string().required("Please enter your password"),
  rememberMe: Yup.bool(),
});

const SignInForm = (props) => {
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = "/forgot-password",
    signUpUrl = "/sign-up",
  } = props;
  const msalInstance = new PublicClientApplication(msalConfig);
  const [message, setMessage] = useTimeOutMessage();
  const [data, setData] = useState({
    userName: "",
    password: "",
  });
  const { signIn } = useAuth();

  const onSignIn = async (values, setSubmitting) => {
    const { useremail, password } = values;
    setSubmitting(true);
    const body = {
      ...DefaultBody,
      data: {
        useremail: `${useremail}`,
        userpw: `${password}`,
      },
      usercode: "136",
      event: "signinuser",
      action: "get",
    };
    const databody = encryptMessage(body);
    const result = await signIn({ body: databody }, "normal", "normal");
    console.log(result.status, "result");
    if (result.status === "failed") {
      setMessage(result.message);
    }

    setSubmitting(false);
  };
  const HandleSuccessLogin = async (res, source) => {
    signIn(res, "sso", source);
  };
  const HandleFacebookLogin = async (res, source) => {
    signIn(
      {
        token: res.accessToken,
        email: res.email,
        avatar: res.picture.data.url,
        userName: res.name,
      },
      "sso",
      source
    );
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
          useremail: "",
          password: "",
          rememberMe: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          console.log(values);
          if (!disableSubmit) {
            onSignIn(values, setSubmitting);
          } else {
            setSubmitting(false);
          }

          // console.log(values, "valuesss");
        }}
      >
        {({ touched, errors, isSubmitting }) => (
          <Form>
            <FormContainer>
              <FormItem
                label="Email"
                invalid={errors.useremail && touched.useremail}
                errorMessage={errors.useremail}
              >
                <Field
                  type="email"
                  autoComplete="off"
                  name="useremail"
                  placeholder="User Email0`"
                  component={Input}
                />
              </FormItem>
              <FormItem
                label="Password"
                invalid={errors.password && touched.password}
                errorMessage={errors.password}
              >
                <Field
                  autoComplete="off"
                  name="password"
                  placeholder="Password"
                  component={PasswordInput}
                />
              </FormItem>
              <div className="flex justify-between mb-6">
                <Field
                  className="mb-0"
                  name="rememberMe"
                  component={Checkbox}
                  children="Remember Me"
                />
                <ActionLink to={forgotPasswordUrl}>Forgot Password?</ActionLink>
              </div>
              <Button
                block
                loading={isSubmitting}
                variant="solid"
                type="submit"
              >
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Button>
              <div className="social-link">
                <GoogleOAuthProvider
                  clientId="436505811511-7o0gn8mvbf2oi3de520ot4b0ldjmlfkm.apps.googleusercontent.com"
                  onScriptLoadSuccess={(res) => console.log(res)}
                  onScriptLoadError={(err) => console.log(err)}
                >
                  <GoogleLogin
                    type="icon"
                    onSuccess={(res) =>
                      HandleSuccessLogin(res.credential, "google")
                    }
                    onError={(err) => console.log(err)}
                    style={{
                      border: "none",
                    }}
                  />
                </GoogleOAuthProvider>
                <FacebookLogin
                  appId="1268308690567775"
                  fields="email, name, picture"
                  callback={(res) => HandleFacebookLogin(res, "facebook")}
                  render={(renderProps) => (
                    <img
                      src="/img/social/fb.png"
                      onClick={renderProps.onClick}
                    />
                  )}
                />
                {/* <img src="/img/social/saml.png" />
                <img src="/img/social/aplelogo.png" /> */}
                <MsalProvider instance={msalInstance}>
                  <AzureLogin />
                </MsalProvider>
              </div>
              <div className="mt-4 text-center">
                <span>Don't have an account yet? </span>
                <ActionLink to={signUpUrl}>Sign up</ActionLink>
              </div>
            </FormContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignInForm;
