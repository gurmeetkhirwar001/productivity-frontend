import React, { useMemo, useCallback } from "react";
import { Card, Button, Table, Badge } from "components/ui";
import useThemeClass from "utils/hooks/useThemeClass";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";

const { Tr, Td, TBody, THead, Th } = Table;

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

const ZoomMeetingsTable = ({ data, className }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Meeting Id",
        accessor: "id",
        sortable: true,
        // Cell: (props) => <OrderColumn row={props.row.original} />,
      },
      {
        Header: "Meeting Subject",
        accessor: "topic",
        sortable: true,
        // Cell: (props) => (
        //   <div dangerouslySetInnerHTML={{ __html: props.data.snippet }} />
        // ),
        //   console.log(props, "propss"),
      },
      {
        Header: "Join Meeting",
        Cell: (props) => (
          <Button onClick={() => window.open(props.row.original.join_url)}>
            Join
          </Button>
        ),
      },
    ],
    []
  );

  const { getTableProps, getTableBodyProps, prepareRow, headerGroups, rows } =
    useTable({ columns, data, initialState: { pageIndex: 0 } });

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <h4>Zoom Meeting List</h4>
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

export default ZoomMeetingsTable;
