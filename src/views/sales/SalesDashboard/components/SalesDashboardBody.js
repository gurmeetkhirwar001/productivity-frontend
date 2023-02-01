import React, { useEffect, useMemo } from 'react'
import { Loading } from 'components/shared'
import Statistic from './Statistic'
import SalesReport from './SalesReport'
import SalesByCategories from './SalesByCategories'
import LatestOrder from './LatestOrder'
import TopProduct from './TopProduct'
import { getSalesDashboardData } from '../store/dataSlice'
import { useDispatch, useSelector } from 'react-redux'
import useTeanant from "utils/hooks/useUser";
import { DefaultBody, encryptMessage } from "utils/common";
const SalesDashboardBody = () => {
  const dispatch = useDispatch();
  const { ListUserTeanants } = useTeanant();
  const { user } = useSelector((state) => state.auth);
  const teanant = useSelector((state) => state.user);
  let List = teanant?.teanantUser?.tenantUserList;
  useMemo(() => {
    async function GetList() {
      const code = user?.user_Code
        ? user?.user_Code
        : user?.userDetail?.user_Code;
      console.log(user);
      const body = {
        ...DefaultBody,
        data: {
          usercode: code,
        },
        usercode: code,
        event: "listusertenant",
        action: "get",
      };
      const encryptybody = encryptMessage(body);
      const result = await ListUserTeanants({ body: encryptybody });
      console.log(result, "result");
    }
    GetList();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Loading loading={false}>
      <Statistic data={[]} />
      <div className="grid grid-cols-1 lg:grid-cols-3 ">
        <LatestOrder data={List} className="lg:col-span-3" />
      </div>
    </Loading>
  );
};

export default SalesDashboardBody