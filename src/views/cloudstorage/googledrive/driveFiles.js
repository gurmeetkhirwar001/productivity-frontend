import React, { useMemo, useCallback, useState } from "react";
import { Card, Button, Table, Badge } from "components/ui";
import useThemeClass from "utils/hooks/useThemeClass";
import { useTable } from "react-table";
import { useNavigate } from "react-router-dom";
import NumberFormat from "react-number-format";
import dayjs from "dayjs";
import Modal from "react-responsive-modal";
import Customize from "views/ui-components/forms/Upload/Customize";
import "react-responsive-modal/styles.css";
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

const DriveFiles = ({
  data,
  className,
  UploadFiles,
  open,
  setOpen,
  downloadFiles,
}) => {
  const [file, setFile] = useState(null);
  const columns = useMemo(
    () => [
      {
        Header: "File Id",
        accessor: "id",
        sortable: true,
        // Cell: (props) => <OrderColumn row={props.row.original} />,
      },
      {
        Header: "File Name",
        accessor: "name",
        sortable: true,
      },
      // {
      //   Header: "Download",
      //   Cell: (props) => (
      //     <Button
      //       variant={"solid"}
      //       onClick={() => downloadFiles(props.row.original.id)}
      //     >
      //       Download
      //     </Button>
      //   ),
      // },
    ],
    []
  );
  const onSumbit = () => {
    UploadFiles(file);
  };
  const { getTableProps, getTableBodyProps, prepareRow, headerGroups, rows } =
    useTable({ columns, data, initialState: { pageIndex: 0 } });

  return (
    <Card className={className}>
      <div className="flex items-center justify-between mb-6">
        <h4>Files List</h4>
        {localStorage.getItem("gdrivetoken") && (
          <Button size="sm" onClick={() => setOpen(!open)}>
            Upload File to Drive
          </Button>
        )}
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
      <Modal open={open} onClose={() => setOpen(!open)}>
        <h1 className="p-4">Upload File to Google Drive</h1>
        <Customize onSubmit={onSumbit} setFile={setFile} />
      </Modal>
    </Card>
  );
};

export default DriveFiles;
