import React, { useState } from "react";
import {
  Input,
  Avatar,
  Upload,
  Button,
  Select,
  Switcher,
  Notification,
  toast,
  FormContainer,
  FormItem,
} from "components/ui";
import FormDesription from "./FormDesription";
import FormRow from "./FormRow";
import { Field, Form, Formik } from "formik";
import DatePicker from "views/ui-components/forms/DatePicker/Basic";
import dayjs from "dayjs";
import moment from "moment-timezone";
import { components } from "react-select";
import {
  HiOutlineUserCircle,
  HiOutlineMail,
  HiOutlineBriefcase,
  HiOutlineUser,
  HiCheck,
  HiOutlineGlobeAlt,
} from "react-icons/hi";
import * as Yup from "yup";
import useAuth from "utils/hooks/useAuth";
import { DefaultBody, encryptMessage } from "utils/common";

const { Control } = components;

const validationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, "Too Short!")
    .max(12, "Too Long!")
    .required("User Name Required"),
  useremail: Yup.string().email("Invalid email").required("Email Required"),
  usermobile: Yup.string(),
  userfirstname: Yup.string(),
  uselastname: Yup.string(),
  usermidname: Yup.string(),
});

const langOptions = [
  { value: "en", label: "English (US)", imgPath: "/img/countries/us.png" },
  { value: "ch", label: "中文", imgPath: "/img/countries/cn.png" },
  { value: "jp", label: "日本语", imgPath: "/img/countries/jp.png" },
  { value: "fr", label: "French", imgPath: "/img/countries/fr.png" },
];

const CustomSelectOption = ({ innerProps, label, data, isSelected }) => {
  return (
    <div
      className={`flex items-center justify-between p-2 ${
        isSelected
          ? "bg-gray-100 dark:bg-gray-500"
          : "hover:bg-gray-50 dark:hover:bg-gray-600"
      }`}
      {...innerProps}
    >
      <div className="flex items-center">
        <Avatar shape="circle" size={20} src={data.imgPath} />
        <span className="ml-2 rtl:mr-2">{label}</span>
      </div>
      {isSelected && <HiCheck className="text-emerald-500 text-xl" />}
    </div>
  );
};

const CustomControl = ({ children, ...props }) => {
  const selected = props.getValue()[0];
  return (
    <Control {...props}>
      {selected && (
        <Avatar
          className="ltr:ml-4 rtl:mr-4"
          shape="circle"
          size={18}
          src={selected.imgPath}
        />
      )}
      {children}
    </Control>
  );
};

const Profile = ({ data }) => {
  const onSetFormFile = (form, field, file) => {
    form.setFieldValue(field.name, URL.createObjectURL(file[0]));
  };
  const [dob, setDob] = useState(null);
  const { UpdateUserProfile, getUserP } = useAuth();
  console.log(data, "dadad");
  const onFormSubmit = async (values, setSubmitting) => {
    const body = {
      ...DefaultBody,
      data: {
        userdob: dob,
        ...values,
      },
      usercode: data.usercode,
      event: "userprofileupdate",
      action: "update",
    };

    const databody = encryptMessage(body);
    const res = await UpdateUserProfile({ body: databody });
    if (res.status == "success") {
      toast.push(<Notification title={"Profile updated"} type="success" />, {
        placement: "top-center",
      });
      const body2 = {
        ...DefaultBody,
        data: {
          usercode: data.usercode,
        },
        usercode: data.usercode,
        action: "get",
        event: "userprofileget",
      };
      const databody2 = encryptMessage(body2);
      const ress = await getUserP({ body: databody2 });
      console.log(ress, "resss");
      if (ress.payload.is_success == true) {
        setSubmitting(false);
      }
      //   if (ress.) setSubmitting(false);
    } else {
      toast.push(
        <Notification title={"Error in Profile updation"} type="error" />,
        {
          placement: "top-center",
        }
      );
      setSubmitting(false);
    }
  };
  return (
    <Formik
      initialValues={data}
      enableReinitialize
      //   validationSchema={validationSchema}
      onSubmit={(values, { setSubmitting }) => {
        setSubmitting(true);
        setTimeout(() => {
          onFormSubmit(values, setSubmitting);
        }, 1000);
      }}
    >
      {({ values, touched, errors, isSubmitting, resetForm }) => {
        const validatorProps = { touched, errors };
        return (
          <Form>
            <FormContainer>
              <FormDesription
                title="General"
                desc="Basic info, like your name and address that will displayed in public"
              />
              <FormRow name="name" label="UserName" {...validatorProps}>
                <Field
                  type="text"
                  autoComplete="off"
                  name="username"
                  placeholder="Name"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                />
              </FormRow>
              <FormItem
                label="DOB"
                // invalid={errors.dob && touched.dob}
                // errorMessage={errors.dob}
              >
                <Field name="start" placeholder="Date">
                  {({ field, form }) => (
                    <DatePicker
                      field={field}
                      form={form}
                      value={field.value}
                      onChange={(date) => {
                        setDob(dayjs(date).format("YYYY-MM-DDTHH:mm:ss"));
                      }}
                    />
                  )}
                </Field>
              </FormItem>
              <FormRow
                name="userfirstname"
                label="First name"
                {...validatorProps}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="userfirstname"
                  placeholder="First Name"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                />
              </FormRow>
              <FormRow
                name="usermidname"
                label="Middle Name"
                {...validatorProps}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="usermidname"
                  placeholder="Middle Name"
                  component={Input}
                  prefix={<HiOutlineMail className="text-xl" />}
                />
              </FormRow>
              <FormRow
                name="userlastname"
                label="Last Name"
                {...validatorProps}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="userlastname"
                  placeholder="Last Name"
                  component={Input}
                  prefix={<HiOutlineUserCircle className="text-xl" />}
                />
              </FormRow>
              <FormRow name="email" label="Email" {...validatorProps}>
                <Field
                  type="email"
                  autoComplete="off"
                  name="useremail"
                  placeholder="Email"
                  component={Input}
                  prefix={<HiOutlineMail className="text-xl" />}
                />
              </FormRow>

              <FormRow name="avatar" label="Avatar" {...validatorProps}>
                <Field name="avatar">
                  {({ field, form }) => {
                    const avatarProps = field.value ? { src: field.value } : {};
                    return (
                      <Upload
                        className="cursor-pointer"
                        onChange={(files) => onSetFormFile(form, field, files)}
                        onFileRemove={(files) =>
                          onSetFormFile(form, field, files)
                        }
                        showList={false}
                        uploadLimit={1}
                      >
                        <Avatar
                          className="border-2 border-white dark:border-gray-800 shadow-lg"
                          size={60}
                          shape="circle"
                          icon={<HiOutlineUser />}
                          {...avatarProps}
                        />
                      </Upload>
                    );
                  }}
                </Field>
              </FormRow>
              <FormRow
                name="userphone"
                label="Mobile"
                {...validatorProps}
                border={false}
              >
                <Field
                  type="text"
                  autoComplete="off"
                  name="userphone"
                  placeholder="Mobile Number"
                  component={Input}
                  prefix={<HiOutlineBriefcase className="text-xl" />}
                />
              </FormRow>
              <div className="mt-4 ltr:text-right">
                <Button
                  className="ltr:mr-2 rtl:ml-2"
                  type="button"
                  onClick={resetForm}
                >
                  Reset
                </Button>
                <Button variant="solid" loading={isSubmitting} type="submit">
                  {isSubmitting ? "Updating" : "Update"}
                </Button>
              </div>
            </FormContainer>
          </Form>
        );
      }}
    </Formik>
  );
};

export default Profile;
