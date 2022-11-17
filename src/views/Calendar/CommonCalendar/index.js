import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
export default function CommonCalendar() {
  const localized = momentLocalizer(moment);
  return (
    <Calendar
      localizer={localized}
      events={[]}
      startAccessor="start"
      endAccessor="end"
      style={{ height: "100vh" }}
    />
  );
}
