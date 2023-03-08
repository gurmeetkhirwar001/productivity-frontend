import React, { useState, useEffect, Suspense, lazy } from 'react'
import { Tabs } from 'components/ui'
import { AdaptableCard, Container } from 'components/shared'
import { useNavigate, useLocation } from 'react-router-dom'
import isEmpty from 'lodash/isEmpty'
import { apiGetAccountSettingData } from 'services/AccountServices'
import { useSelector } from "react-redux";
import useAuth from "utils/hooks/useAuth";
import { DefaultBody, encryptMessage } from "utils/common";
const Profile = lazy(() => import("./components/Profile"));
const Password = lazy(() => import("./components/Password"));
const NotificationSetting = lazy(() =>
  import("./components/NotificationSetting")
);
const Integration = lazy(() => import("./components/Integration"));
const Billing = lazy(() => import("./components/Billing"));

const { TabNav, TabList } = Tabs;

const settingsMenu = {
  profile: { label: "Profile", path: "profile" },
  password: { label: "Password", path: "password" },
  notification: { label: "Notification", path: "notification" },
  integration: { label: "Integration", path: "integration" },
  billing: { label: "Billing", path: "billing" },
};

const Settings = () => {
  const [currentTab, setCurrentTab] = useState("profile");
  const [data, setData] = useState({});
  const { userProfile } = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const { getUserP } = useAuth();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);
  const path = location.pathname.substring(
    location.pathname.lastIndexOf("/") + 1
  );

  const onTabChange = (val) => {
    setCurrentTab(val);
    navigate(`/app/account/settings/${val}`);
  };

  const fetchData = async () => {
    console.log(userProfile, "userProfile[0]");
    // const response = await apiGetAccountSettingData();
    setData(userProfile);
  };
  useEffect(() => {
    async function GetUserProfile() {
      let body = {
        ...DefaultBody,
        data: {
          usercode: user && user?.user_Code,
        },
        usercode: user && user?.user_Code,
        action: "get",
        event: "userprofileget",
      };
      const encryptedbody = encryptMessage(body);
      await getUserP({ body: encryptedbody });
    }
    GetUserProfile();
  }, []);
  useEffect(() => {
    setCurrentTab(path);
    if (isEmpty(data)) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Container>
      <AdaptableCard>
        <Tabs value={currentTab} onChange={(val) => onTabChange(val)}>
          <TabList>
            {Object.keys(settingsMenu).map((key) => (
              <TabNav key={key} value={key}>
                {settingsMenu[key].label}
              </TabNav>
            ))}
          </TabList>
        </Tabs>
        <div className="px-4 py-6">
          <Suspense fallback={<></>}>
            {currentTab === "profile" && <Profile data={data} />}
            {currentTab === "password" && <Password data={data} />}
            {currentTab === "notification" && (
              <NotificationSetting data={data.notification} />
            )}
            {currentTab === "integration" && <Integration />}
            {currentTab === "billing" && <Billing />}
          </Suspense>
        </div>
      </AdaptableCard>
    </Container>
  );
};

export default Settings