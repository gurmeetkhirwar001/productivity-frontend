import React from "react";
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
import { DefaultBody } from "utils/common";
import { apiSignIn } from "services/AuthService";
import appConfig from "configs/app.config";
import { REDIRECT_URL_KEY } from "constants/app.constant";
import { useNavigate } from "react-router-dom";
import useQuery from "utils/hooks/useQuery";
import { useDispatch } from "react-redux";
import { setUser } from "store/auth/userSlice";
const validationSchema = Yup.object().shape({
  userName: Yup.string().required("Please enter your user name"),
  password: Yup.string().required("Please enter your password"),
  rememberMe: Yup.bool(),
});

const SignInForm = (props) => {
  const navigate = useNavigate();
  const query = useQuery();
  const dispatch = useDispatch();
  const {
    disableSubmit = false,
    className,
    forgotPasswordUrl = "/forgot-password",
    signUpUrl = "/sign-up",
  } = props;

  const [message, setMessage] = useTimeOutMessage();

  const { signIn } = useAuth();

  const onSignIn = async (values, setSubmitting) => {
    const { userName, password } = values;
    setSubmitting(true);
    const data = {
      ...DefaultBody,
      data: {
        useremail: `,${userName},`,
        userpw: `,${password},`,
      },
      usercode: "136",
      event: "signinuser",
      action: "get",
    };
    const result = await apiSignIn(data);
    console.log(result.data);
    if (result.data.responseCode == 401) {
      setMessage(result.data.message);
    } else {
      dispatch(
        setUser(
          result.data.message.app_token || {
            avatar: "",
            userName: "Anonymous",
            authority: ["USER"],
            email: "",
          }
        )
      );
      const redirectUrl = query.get(REDIRECT_URL_KEY);
      navigate(redirectUrl ? redirectUrl : appConfig.authenticatedEntryPath);
    }

    setSubmitting(false);
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
          userName: "",
          password: "",
          rememberMe: true,
        }}
        validationSchema={validationSchema}
        onSubmit={(values, { setSubmitting }) => {
          if (!disableSubmit) {
            onSignIn(values, setSubmitting);
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
                invalid={errors.userName && touched.userName}
                errorMessage={errors.userName}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="userName"
                  placeholder="User Name"
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
