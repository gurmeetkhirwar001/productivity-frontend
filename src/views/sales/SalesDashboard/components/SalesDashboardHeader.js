import React, { useState } from "react";
import { DatePicker, Button, Dialog, Input } from "components/ui";
import { setStartDate, setEndDate } from "../store/stateSlice";
import { getSalesDashboardData } from "../store/dataSlice";
import { HiOutlineFilter, HiPlus } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import { DefaultBody, encryptMessage } from "utils/common";
import useUser from "utils/hooks/useUser";
// import Input from "views/ui-components/forms/Input";

const dateFormat = "MMM DD, YYYY";

const { DatePickerRange } = DatePicker;

const SalesDashboardHeader = () => {
  const dispatch = useDispatch();
  const [message, setMessage] = useState("");
  const [invite, setInvite] = useState(false);
  const [email, setEmail] = useState("");
  const { InviteUsers } = useUser();
  const { user } = useSelector((state) => state.auth);
  const teanant = useSelector((state) => state.user);

  const startDate = useSelector(
    (state) => state.salesDashboard.state.startDate
  );
  const endDate = useSelector((state) => state.salesDashboard.state.endDate);

  const handleDateChange = (value) => {
    dispatch(setStartDate(value[0]));
    dispatch(setEndDate(value[1]));
  };

  const onFilter = () => {
    dispatch(getSalesDashboardData());
  };
  const onInvite = async () => {
    let List = teanant?.teanantUser?.tenantUserList?.find(
      (tuser) => tuser?.user_Code == user?.user_Code
    );
    const body = {
      ...DefaultBody,
      data: {
        usercode: user?.user_Code,
        tenantcode: List?.tenant_Code,
        inviteuseremail: email,
      },
      usercode: user?.user_Code,
      event: "inviteguest",
      action: "create",
    };
    console.log(body);
    const encryptedbody = encryptMessage(body);
    const result = await InviteUsers({ body: encryptedbody });
    if (result.status == "failed") {
      setMessage("Something went wrong while sending an Invite");
    } else {
      setMessage("Invite has been sent!");
    }
  };
  return (
    <div className="lg:flex items-center justify-between mb-4 gap-3">
      <div className="mb-4 lg:mb-0">
        <h3>Dashboard Overview</h3>
        <p>View your current sales & summary</p>
      </div>
      <div className="flex flex-col lg:flex-row lg:items-center gap-3">
        <DatePickerRange
          value={[startDate, endDate]}
          onChange={handleDateChange}
          inputFormat={dateFormat}
          size="sm"
        />
        <Button size="sm" icon={<HiOutlineFilter />} onClick={onFilter}>
          Filter
        </Button>
        <Button size="sm" icon={<HiPlus />} onClick={() => setInvite(!invite)}>
          Invite User
        </Button>
        <Dialog isOpen={invite} onClose={() => setInvite(!invite)}>
          <h2 className="text-center">Invite User</h2>
          <p className="text-center pt-4">{message}</p>
          <div className="p-4 invite-form">
            <label className="pb-5 ">User Email</label>
            <Input
              placeholder="Enter Email"
              onChange={(e) => setEmail(e.target.value)}
              value={email}
            />
            <div className="btn-container">
              <Button className="submit-btn" onClick={onInvite}>
                Send Invite
              </Button>
            </div>
          </div>
        </Dialog>
      </div>
    </div>
  );
};

export default SalesDashboardHeader;
