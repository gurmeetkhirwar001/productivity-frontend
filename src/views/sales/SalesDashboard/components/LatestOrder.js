import React, { useMemo, useCallback } from 'react'
import { Card, Button, Table, Badge } from 'components/ui'
import useThemeClass from 'utils/hooks/useThemeClass'
import { useTable } from 'react-table'
import { useNavigate } from 'react-router-dom'
import NumberFormat from 'react-number-format'
import dayjs from 'dayjs'

const { Tr, Td, TBody, THead, Th } = Table

const orderStatusColor = {
  1: {
    label: "Active",
    dotClass: "bg-emerald-500",
    textClass: "text-emerald-500",
  },
  0: {
    label: "Not Active",
    dotClass: "bg-amber-500",
    textClass: "text-amber-500",
  },
};

const OrderColumn = ({ row }) => {
  const { textTheme } = useThemeClass();
  const navigate = useNavigate();

  const onView = useCallback(() => {
    navigate(`/app/sales/order-details/${row.id}`);
  }, [navigate, row]);

  return (
    <span
      className={`cursor-pointer select-none font-semibold hover:${textTheme}`}
      onClick={onView}
    >
      #{row.id}
    </span>
  );
};

const LatestOrder = ({ data, className }) => {
  const columns = useMemo(
    () => [
      {
        Header: "User Name",
        accessor: "user_Name",
        sortable: true,
        // Cell: (props) => <OrderColumn row={props.row.original} />,
      },
      {
        Header: "Email",
        accessor: "user_Email",
        sortable: true,
      },
      {
        Header: "Mobile",
        accessor: "user_Mobile",
        sortable: true,
      },
      {
        Header: "UserCode",
        accessor: "user_Code",
        sortable: true,
      },
      {
        Header: "Tenant Code",
        accessor: "tenant_Code",
        sortable: true,
      },
      {
        Header: "Status",
        accessor: "User_Status",
        sortable: true,
        Cell: (props) => {
          const { User_Status } = props.row.original;
          return (
            <div className="flex items-center">
              <Badge className={orderStatusColor[User_Status].dotClass} />
              <span
                className={`ml-2 rtl:mr-2 capitalize font-semibold ${orderStatusColor[User_Status].textClass}`}
              >
                {orderStatusColor[User_Status].label}
              </span>
            </div>
          );
        },
      },
      //   {
      //     Header: "Customer",
      //     accessor: "customer",
      //     sortable: true,
      //   },
      //   {
      //     Header: "Total",
      //     accessor: "totalAmount",
      //     sortable: true,
      //     Cell: (props) => {
      //       const { totalAmount } = props.row.original;
      //       return (
      //         <NumberFormat
      //           displayType="text"
      //           value={(Math.round(totalAmount * 100) / 100).toFixed(2)}
      //           prefix={"$"}
      //           thousandSeparator={true}
      //         />
      //       );
      //     },
      //   },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, prepareRow, headerGroups, rows } =
    useTable({ columns, data, initialState: { pageIndex: 0 } });

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <h4>List User Tenants</h4>
        {/* <Button size="sm">View Orders</Button> */}
      </div>
      <Table {...getTableProps()}>
        <THead>
          {headerGroups.map((headerGroup) => (
            <Tr {...headerGroup.getHeaderGroupProps()}>
              {headerGroup.headers.map((column) => (
                <Th {...column.getHeaderProps()}>{column.render("Header")}</Th>
              ))}
            </Tr>
          ))}
        </THead>
        <TBody {...getTableBodyProps()}>
          {rows.map((row, i) => {
            prepareRow(row);
            return (
              <Tr {...row.getRowProps()}>
                {row.cells.map((cell) => {
                  return (
                    <Td {...cell.getCellProps()}>{cell.render("Cell")}</Td>
                  );
                })}
              </Tr>
            );
          })}
        </TBody>
      </Table>
    </Card>
  );
};

export default LatestOrder