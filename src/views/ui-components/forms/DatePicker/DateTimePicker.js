import React from 'react'
import { DatePicker } from 'components/ui'

const { DateTimepicker } = DatePicker

const DateTimePicker = ({ onChange }) => {
  return <DateTimepicker placeholder="Pick date & time" onChange={onChange} />;
};

export default DateTimePicker