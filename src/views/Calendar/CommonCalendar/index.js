import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
export default function CommonCalendar({ event, EventDetails }) {
  const localized = momentLocalizer(moment);
  return (
    <Calendar
      localizer={localized}
      events={event}
      startAccessor="startDate"
      endAccessor="endDate"
      style={{ height: "100vh" }}
      onSelectEvent={(eve) => EventDetails(eve.id)}
    />
  );
}
