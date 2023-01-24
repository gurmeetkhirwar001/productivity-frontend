/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState, useCallback, useMemo } from "react";
import { gapi } from "gapi-script";
// import GmailMails from "./maillist";
import useCloud from "utils/hooks/useCloud";
import { Button, FormContainer, Input, FormItem } from "components/ui";
import DateTimePicker from "views/ui-components/forms/DatePicker/DateTimePicker";
import useColaboration from "utils/hooks/useCollaboration";
import { useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import ZoomMeetingsTable from "./ZoomMeetings";
import CommonModal from "components/ui/Modal";
import { Form, Field, Formik } from "formik";
import dayjs from "dayjs";
import moment from "moment-timezone";

import { PasswordInput } from "components/shared";
const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/gmail/v1/rest",
];
const scopes = "https://mail.google.com/";
export default function GoogleDriveFetch() {
  const { GetZoomConnect, GetZoomToken, GetZoomMeetings,createZoomMeeting } = useColaboration();
  const { ColabSlice } = useSelector((state) => state.colab);
  const [authorizeURL, setAuthorizeURL] = useState("");
  const [open, setOpen] = useState(false);
  const [data, setData] = useState({
    start_time: "",
    agenda: "",
    topic: "",
    duration: "",
    password: "",
  });
  const createMeeting = (values) => {
    const date = moment.tz.guess();
    let body = {
      start:values.start,
      agenda: values.agenda,
      topic: values.topic,
      timezone: date,
      password: values.password,
    };
     createZoomMeeting(body)
    console.log(values)
  }
  useEffect(() => {
    async function getAuthorizeUrl() {
      const params = { redirect_uri: `${window.location.href}` };
      if (localStorage.getItem("zoomtoken") == null || undefined) {
        const response = await GetZoomConnect(params);
        setAuthorizeURL(response?.data?.message);
      }
      if (
        window.location.href.includes("code") &&
        !localStorage.getItem("zoomtoken")
      ) {
        let code = window.location.href.split("?")[1].split("=")[1];
        const response = await GetZoomToken({
          code: code,
          redirect_uri: `${window.location.protocol}/${window.location.host}/app/zoom/meetings`,
        });
        if (response.data.responseCode == 201) {
          localStorage.setItem(
            "zoomtoken",
            response?.data?.message?.access_token
          );
          localStorage.setItem(
            "zoomrefreshtoken",
            response?.data?.message?.refresh_token
          );
        }
      }
      if (localStorage.getItem("zoomtoken")) {
        const response = await GetZoomMeetings({
          type: "scheduled",
          limit: 20,
        });
      }
    }
    getAuthorizeUrl();
  }, []);
  console.log(ColabSlice);
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Zoom</h1>
        {/* {SignedinUser} */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            flexDirection: "column",
          }}
        >
          <Button
            variant="solid"
            onClick={() => window.location.replace(authorizeURL)}
          >
            {localStorage.getItem("zoomtoken")
              ? "Disconnect Zoom"
              : "Connect Zoom"}
          </Button>
          <Button
            variant="solid"
            className="mt-4"
            onClick={() => setOpen(!open)}
          >
            Create Meeting
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <ZoomMeetingsTable
          data={ColabSlice?.ZoomMeetings || []}
          className="lg:col-span-3"
        />
        <CommonModal open={open} onClose={() => setOpen(false)}>
          <h2>Create Zoom meeting</h2>
          <Formik
            style={{
              marginTop: 10,
            }}
            initialValues={data}
            enableReinitialize={true}
            // validationSchema={validationSchema}
            onSubmit={(values, { setSubmitting }) => {
              setSubmitting(true);
              setTimeout(() => {
                createMeeting(values, setSubmitting);
              }, 1000);
            }}
          >
            {({ values, touched, errors, isSubmitting }) => {
              return (
                <Form>
                  <FormContainer>
                    <div className="md:grid grid-cols-1 gap-4">
                      <div className="md:grid grid-cols-1 gap-4">
                        <FormItem
                          label="Event Start date"
                          // invalid={errors.dob && touched.dob}
                          // errorMessage={errors.dob}
                        >
                          <Field name="start_time" placeholder="Date">
                            {({ field, form }) => (
                              <DateTimePicker
                                field={field}
                                form={form}
                                value={field.value}
                                onChange={(date) => {
                                  setData({
                                    ...data,
                                    start: dayjs(date).format(
                                      "YYYY-MM-DDTHH:mm:ss"
                                    ),
                                  });
                                }}
                              />
                            )}
                          </Field>
                        </FormItem>
                      </div>
                      <FormItem
                        label="Agenda of Meeting"
                        // invalid={errors.dob && touched.dob}
                        // errorMessage={errors.dob}
                      >
                        <Field
                          name="agenda"
                          placeholder="Enter Agenda of Meeting"
                          component={Input}
                          value={values.agenda}
                          // onChange={(e) =>
                          //   setData({ ...data, summary: e.target.value })
                          // }
                        ></Field>
                      </FormItem>
                      <FormItem
                        label="Topic of Meeting"
                        // invalid={errors.dob && touched.dob}
                        // errorMessage={errors.dob}
                      >
                        <Field
                          name="topic"
                          placeholder="Enter topic of event"
                          component={Input}
                          value={values.topic}
                        ></Field>
                      </FormItem>
                      <FormItem
                        label="Password for Meeting"
                        // invalid={errors.dob && touched.dob}
                        // errorMessage={errors.dob}
                      >
                        <Field
                          name="password"
                          placeholder="Enter password of event"
                          component={PasswordInput}
                          value={values.password}
                        ></Field>
                      </FormItem>
                      <FormItem
                        label="Duration for Meeting (in Minutes)"
                        // invalid={errors.dob && touched.dob}
                        // errorMessage={errors.dob}
                      >
                        <Field
                          name="duration"
                          placeholder="Enter Duration of Meeting"
                          component={Input}
                          max={3}
                          value={values.duration}
                        ></Field>
                      </FormItem>
                    </div>

                    <div className="flex justify-end gap-2">
                      <Button
                        loading={isSubmitting}
                        variant="solid"
                        type="submit"
                      >
                        Create Event
                      </Button>
                    </div>
                  </FormContainer>
                </Form>
              );
            }}
          </Formik>
        </CommonModal>
        {/* {files.map((file) => (
          <li>{file.name}</li>
        ))} */}
      </div>
    </>
  );
}
