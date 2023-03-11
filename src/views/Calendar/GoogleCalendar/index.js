import React, { useState, useCallback, useEffect } from "react";
import {
  Button,
  DatePicker,
  FormContainer,
  FormItem,
  Input,
} from "components/ui";
import CommonCalendar from "../CommonCalendar";
import { gapi } from "gapi-script";
import useCloud from "utils/hooks/useCloud";
import CommonModal from "components/ui/Modal";
import { Field, Form, Formik } from "formik";
import DateTimePicker from "views/ui-components/forms/DatePicker/DateTimePicker";
import dayjs from "dayjs";
import moment from "moment-timezone";

const DISCOVERY_DOCS = [
  "https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest",
];
const scopes = "https://www.googleapis.com/auth/calendar";
export default function GoogleCalendar() {
  const [isLoading, setIsLoadingGoogleDriveApi] = useState(false);
  const [SignedinUser, setSignedInUser] = useState(null);
  const [files, setFiles] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState({});
  const [data, setData] = useState({
    start: "",
    end: "",
    summary: "",
    description: "",
  });
  const [open, setOpen] = useState(false);
  const [openDetail, setOpenDetail] = useState(false);
  console.log(SignedinUser);
  const { CalendarConnection } = useCloud();
  console.log(
    "apiKey:",
    process.env.REACT_APP_NODE_ENV == "dev"
      ? process.env.REACT_APP_GOOGLE_DEV_API_KEY
      : process.env.REACT_APP_API_KEY,
    "  clientId:",
    process.env.REACT_APP_NODE_ENV == "dev"
      ? process.env.REACT_APP_GOOGLE_DEV_CLIENT_ID
      : process.env.REACT_APP_CLIENT_ID
  );
  const initClient = useCallback(() => {
    setIsLoadingGoogleDriveApi(true);
    gapi.client
      .init({
        apiKey:
          process.env.REACT_APP_NODE_ENV == "dev"
            ? process.env.REACT_APP_GOOGLE_DEV_API_KEY
            : process.env.REACT_APP_API_KEY,
        clientId:
          process.env.REACT_APP_NODE_ENV == "dev"
            ? process.env.REACT_APP_GOOGLE_DEV_CLIENT_ID
            : process.env.REACT_APP_CLIENT_ID,
        discoveryDocs: DISCOVERY_DOCS,
        scope: scopes,
      })
      .then(
        function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
        },
        function (error) {
          console.log(error);
        }
      );
  });
  const handleClientLoad = async () => {
    await gapi.load("client:auth2", initClient);
  };
  const updateSigninStatus = useCallback((isSignedIn) => {
    console.log(isSignedIn);
    if (isSignedIn) {
      // Set the signed in user
      localStorage.setItem(
        "gcalendartoken",
        gapi.auth2.getAuthInstance().currentUser.le.xc.id_token
      );
      console.log(gapi.auth2.getAuthInstance().currentUser.le.xc.id_token);
      setSignedInUser(gapi.auth2.getAuthInstance().isSignedIn.get());
      setIsLoadingGoogleDriveApi(false);
      // list files if user is authenticated
      listFiles();
    } else {
     setSignedInUser(false)
    }
  });
  useEffect(() => {
    async function InitateDrive() {
      //   await gapi.load("client:auth2", initClient)
      if (!localStorage.getItem("gcalendartoken")) {
        await gapi.load("client", initClient);
        setSignedInUser(false)
      }
      //   updateSigninStatus(SignedinUser);
      if (localStorage.getItem("gcalendartoken")) {
       
        listFiles();
      }else{
        setSignedInUser(false)
      }
    }
    InitateDrive();
    // eslint-disable-next-line no-use-before-define
  }, [SignedinUser,localStorage.getItem("gcalendartoken")]);
  /**
   * List files.
   */

  const GetEventDetail = (event) => {
    console.log(event);
    gapi.client.calendar.events
      .get({
        calendarId: "primary",
        eventId: event,
      })
      .then((response) => {
        setSelectedEvent(response?.result);
        setOpenDetail(!openDetail);
      })
      .catch((e) => e);
  };

  const listFiles = (searchTerm = null) => {
    // setIsFetchingGoogleDriveFiles(true);
    gapi.client.calendar.events
      .list({
        calendarId: "primary",
        maxResults: 200,
      })
      .then(async function (response) {
        // setIsFetchingGoogleDriveFiles(false);
        // setListDocumentsVisibility(true);
        let events = response.result.items.map((ite) => {
          return {
            startDate: new Date(ite.start.dateTime),
            endDate: new Date(ite.end.dateTime),
            title: ite.summary,
            id: ite.id,
          };
        });
        console.log(events);

        const res = JSON.parse(response.body);
        setFiles(events);
        let token = gapi.auth2.getAuthInstance().currentUser.le.xc.id_token;
        if (localStorage.getItem("gcalendartoken") == null) {
          await CalendarConnection(
            { token, events: res.files },
            "calendar",
            "googlecalendar"
          );
        }
        // setDocuments(res.files);
      });
  };
  const onDeleteEvent = (id) => {
    gapi.client.calendar.events
      .delete({
        calendarId: "primary",
        eventId: id,
      })
      .then(() => {
        listFiles();
        setOpenDetail(!openDetail);
      })
      .catch((e) => e);
  };
  /**
   *  Sign in the user upon button click.
   */
  const handleAuthClick = (event) => {
    gapi.auth2.getAuthInstance().signIn();
  };

  const handleSignOutClick = (event) => {
    // setListDocumentsVisibility(false);
    localStorage.removeItem("gcalendartoken");
    gapi.auth2.getAuthInstance().signOut();
    setFiles([])
    // window.location.reload()
  };
  const handleCreateEvent = (values) => {
    const date = moment.tz.guess();
    console.log(date, "Date");
    let body = {
      summary: values.summary,
      start: {
        dateTime: values.start,
        timeZone: date,
      },
      end: {
        dateTime: values.start,
        timeZone: date,
      },
      description: values.description,
      reminders: {
        useDefault: false,
        overrides: [
          { method: "email", minutes: 24 * 60 },
          { method: "popup", minutes: 10 },
        ],
      },
    };
    console.log(body);
    gapi.client.calendar.events
      .insert({
        calendarId: "primary",
        resource: body,
      })
      .then(() => {
        listFiles();
        setOpen(!open);
      })
      .catch((err) => console.log(err));
  };
  console.log(localStorage.getItem("gcalendartoken"),"localStorage.getItem(gcalendartoken)")
  return (
    <>
      <div className="cloud-connect-container">
        <h1>Google Calendar</h1>
        {/* {SignedinUser} */}
        <div className="d-flex justify-content-between">
          {SignedinUser == false ? <Button
            variant="solid"
            style={{
              marginRight: "1rem",
            }}
            onClick={() =>
              handleAuthClick()
            }
          >
           Connect Google Calendar
          </Button> :
          <Button
            variant="solid"
            style={{
              marginRight: "1rem",
            }}
            onClick={() =>
                handleSignOutClick()
            }
          >
           
              Disconnect Calendar
          </Button>}
          <Button variant="solid" onClick={() => setOpen(!open)}>
            Create Event
          </Button>
        </div>
      </div>
      <div className="mt-4">
        <CommonCalendar event={files} EventDetails={GetEventDetail} />
        <CommonModal open={openDetail} onClose={setOpenDetail}>
          <h1>Event Details</h1>

          <p>Event Title: {selectedEvent.summary}</p>
          <p>Event Description: {selectedEvent.description}</p>
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
          <h2>Create Google Event</h2>
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
                handleCreateEvent(values, setSubmitting);
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
                          name="summary"
                          placeholder="Enter Title of event"
                          component={Input}
                          value={values.summary}
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
  