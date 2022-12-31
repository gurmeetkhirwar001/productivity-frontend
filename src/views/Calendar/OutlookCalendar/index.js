import React, { useState, useEffect } from "react";
import { Button, FormContainer, Input, FormItem } from "components/ui";
import { MsalProvider, useIsAuthenticated } from "@azure/msal-react";
import { CalendarRequest } from "views/auth/Azure/authconfig";
import AzureConnector from "utils/AzureWrapper";
import { msalConfig } from "../../auth/Azure/authconfig";
import useCloud from "../../../utils/hooks/useCloud";
import { PublicClientApplication } from "@azure/msal-browser";
import {
  CloudConnect,
  GetOneDriveCalendarEvents,
  CreateOutlookCalendarEvents,
  GetOutlookCalendarEvent,
  DeleteOutlookCalendarEvent,
} from "services/CloudStorageService";
import moment from "moment-timezone";
import CommonCalendar from "../CommonCalendar";
import DateTimePicker from "views/ui-components/forms/DatePicker/DateTimePicker";
import { Form, Field, Formik } from "formik";
// import OneDriveFiles from "./onedrivefiles";
import { useSelector } from "react-redux";
import CommonModal from "components/ui/Modal";
import dayjs from "dayjs";

export default function OutlookCalendar() {
  const msalInstance = new PublicClientApplication(msalConfig);
  const Authenticated = useIsAuthenticated();
  const [data, setData] = useState({
    start: "",
    end: "",
    subject: "",
    description: "",
  });
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState({});
  const CloudFiles = useSelector((state) => state.cloud.CloudSlice);
  const { HandleCalendarEvent, CalendarConnection } = useCloud();
  useEffect(() => {
    let driveToken = localStorage.getItem("onecalendartoken");
    SetData(driveToken);
  }, []);
  const SetData = async (token, idToken) => {
    const response = await GetOneDriveCalendarEvents(token);
    // console.log(response.data);
    HandleCalendarEvent(response.data.value);
    console.log(token, idToken);
    if (idToken) {
      CalendarConnection(
        { token: idToken, files: response.data.value },
        "cloud",
        "Azure"
      );
    }
  };
  const getSelectedEvent = async (event) => {
    let driveToken = localStorage.getItem("onecalendartoken");
    const res = await GetOutlookCalendarEvent(event, driveToken);
    setOpenDetail(true);
    setSelectedEvent(res.data);
  };
  const CreateOutLookEvent = async (values) => {
    const date = moment.tz.guess();
    const eventBody = {
      subject: values.subject,
      start: {
        dateTime: values.start,
        timeZone: date,
      },
      end: {
        dateTime: values.end,
        timeZone: date,
      },
      body: {
        contentType: "HTML",
        content: values.description,
      },
    };
    console.log(values, "valuesss");
    let driveToken = localStorage.getItem("onecalendartoken");
    const res = await CreateOutlookCalendarEvents(eventBody, driveToken);

    SetData(driveToken);
    setOpen(!open);
    console.log(res, "ressss");
  };
  const onDeleteEvent = async (eventid) => {
    let token = localStorage.getItem("onecalendartoken");
    const res = await DeleteOutlookCalendarEvent(eventid, token);
    SetData(token);
    setOpenDetail(!openDetail);
  };
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Outlook Calendar</h1>
        <div className="d-flex justify-content-between">
          <MsalProvider instance={msalInstance}>
            <AzureConnector
              ButtonText={
                localStorage.getItem("onecalendartoken")
                  ? "Disconnect Outlook Calendar"
                  : "Connect Outlook Calendar"
              }
              scope={CalendarRequest}
              type="calendar"
              SetData={SetData}
              // CloudConnection={CloudConnection}
            />
          </MsalProvider>
          <Button
            className="mt-4"
            variant="solid"
            onClick={() => setOpen(!open)}
          >
            Create Event
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <CommonCalendar
          event={CloudFiles?.outlookevents}
          EventDetails={getSelectedEvent}
        />
        <CommonModal
          open={openDetail}
          onClose={() => setOpenDetail(!openDetail)}
        >
          <h1>Event Details</h1>

          <p>Event Title: {selectedEvent.subject}</p>
          <p>
            Event Description:{" "}
            <span
              dangerouslySetInnerHTML={{ __html: selectedEvent?.body?.content }}
            />
          </p>
          <p>
            Event Start Date:{" "}
            {dayjs(selectedEvent?.start?.dateTime).format("DD-MM-YYYY HH:MM A")}
          </p>
          <p>
            Event End Date:{" "}
            {dayjs(selectedEvent?.end?.dateTime).format("DD-MM-YYYY HH:MM A")}
          </p>
          <Button
            variant="solid"
            className="mt-4"
            onClick={() => onDeleteEvent(selectedEvent?.id)}
          >
            Delete Event
          </Button>
        </CommonModal>
        <CommonModal open={open} onClose={setOpen}>
          <h2>Create OutLook Event</h2>
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
                CreateOutLookEvent(values, setSubmitting);
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
                          <Field name="start" placeholder="Date">
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
                      <div className="md:grid grid-cols-1 gap-4">
                        <FormItem
                          label="Event End date"
                          // invalid={errors.dob && touched.dob}
                          // errorMessage={errors.dob}
                        >
                          <Field name="end" placeholder="Date">
                            {({ field, form }) => (
                              <DateTimePicker
                                field={field}
                                form={form}
                                value={field.value}
                                placeholder="Pick event end date"
                                onChange={(date) => {
                                  setData({
                                    ...data,
                                    end: dayjs(date).format(
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
                        label="Event Title"
                        // invalid={errors.dob && touched.dob}
                        // errorMessage={errors.dob}
                      >
                        <Field
                          name="subject"
                          placeholder="Enter Subject of event"
                          component={Input}
                          value={values.subject}
                          // onChange={(e) =>
                          //   setData({ ...data, summary: e.target.value })
                          // }
                        ></Field>
                      </FormItem>
                      <FormItem
                        label="Event Description"
                        // invalid={errors.dob && touched.dob}
                        // errorMessage={errors.dob}
                      >
                        <Field
                          name="description"
                          placeholder="Enter Descrption of event"
                          component={Input}
                          value={values.description}
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
      </div>
    </>
  );
}
