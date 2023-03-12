import { forwardRef, useState } from 'react'
import classNames from 'classnames'
import { Button, Card, Input, Tag } from "components/ui";
import UsersAvatarGroup from "components/shared/UsersAvatarGroup";
import IconText from "components/shared/IconText";
import { HiOutlineChatAlt2, HiOutlinePaperClip, HiFlag } from "react-icons/hi";
import {
  openDialog,
  updateDialogView,
  setSelectedTicketId,
} from "./store/stateSlice";
import { useDispatch, useSelector } from "react-redux";
import { taskLabelColors } from "./utils";
import dayjs from "dayjs";
import "react-responsive-modal/styles.css";
import { Modal } from "react-responsive-modal";
import UpdateSurvey from "../ProjectList/updateSurvey";
import Survey1 from "../ProjectList/surveyjs";
import { setEditModal, setSelectedTask } from "store/tasks/project.slice";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { HiMail, HiVideoCamera, HiChat } from "react-icons/hi";
import "./app.css";
import Textarea from "views/ui-components/forms/Input/Textarea";
const BoardCard = forwardRef((props, ref) => {
  const dispatch = useDispatch();
  const { editModal } = useSelector((state) => state.tasks.projects);

  const selectedTab = useSelector(
    (state) => state.scrumBoard.state.selectedTab
  );
  const [show, setShow] = useState("text");
  const { listId, cardData, data, ...rest } = props;

  const { id, name, comments, attachments, members, dueDate, labels } = data;
  const authors = [
    {
      id: "1",
      name: "To Do",
      // url: "http://adventuretime.wikia.com/wiki/Jake",
      // avatarUrl: jakeImg,
      // colors: {
      //   soft: colors.Y50,
      //   hard: colors.N400A
      // }
    },
    {
      id: "2",
      name: "IN Progress",
      // url: "http://adventuretime.wikia.com/wiki/BMO",
      // avatarUrl: bmoImg,
      // colors: {
      //   soft: colors.G50,
      //   hard: colors.N400A
      // }
    },
    {
      id: "3",
      name: "Qa",
      // url: "http://adventuretime.wikia.com/wiki/Finn",
      // avatarUrl: finnImg,
      // colors: {
      //   soft: colors.B50,
      //   hard: colors.N400A
      // }
    },
    {
      id: "4",
      name: "Completed",
      // url: "http://adventuretime.wikia.com/wiki/Princess_Bubblegum",
      // avatarUrl: princessImg,
      // colors: {
      //   soft: colors.P50,
      //   hard: colors.N400A
      // }
    },
  ];
  const onCardClick = () => {
    dispatch(setEditModal(true));
    dispatch(setSelectedTask(data));
  };
  console.log(data, "priority_Desc");
  const labelss = authors.find(
    (aut) =>
      aut.name == data?.priority_Desc || aut.id == Number(data?.priority_Desc)
  );
  console.log(labelss, "labelss");
  return (
    <>
      <Card
        ref={ref}
        className={classNames(
          "hover:shadow-lg rounded-lg dark:bg-gray-700 bg-gray-50",
          selectedTab !== "All" && !labels.includes(selectedTab)
            ? "opacity-0 overflow-hidden h-0"
            : "mb-4"
        )}
        bodyClass="p-4"
        clickable
        onClick={() => onCardClick()}
        {...rest}
      >
        {
          <Tag
            // key={label + index}
            className="mr-2 rtl:ml-2 mb-2"
            prefix
            prefixClass={`${taskLabelColors[labelss.name]}`}
          >
            {labelss.text}
          </Tag>
        }
        <h6 className="mb-2">{data?.rr_Desc}</h6>
        {dueDate && (
          <IconText
            textClass="text-sm font-semibold"
            className="mb-2"
            icon={<HiFlag className="text-lg" />}
          >
            {dayjs(dueDate).format("MMMM DD")}
          </IconText>
        )}
        <div className="flex items-center justify-between mt-3">
          <UsersAvatarGroup avatarProps={{ size: 25 }} users={members} />
          <div className="flex items-center gap-2">
            {comments?.length > 0 && (
              <IconText
                className="font-semibold"
                icon={<HiOutlineChatAlt2 className="text-base" />}
              >
                {comments.length}
              </IconText>
            )}
            {attachments?.length > 0 && (
              <IconText icon={<HiOutlinePaperClip />} className="text-base">
                {attachments.length}
              </IconText>
            )}
          </div>
        </div>
      </Card>
      <Modal
        open={editModal}
        onClose={() => dispatch(setEditModal(false))}
        styles={{
          modal: {
            width: "900px",
            maxWidth: "1000px",
            height: "80%",
          },
        }}
      >
        <div className="grid grid-cols-2 gap-2 ">
          <div>
            <UpdateSurvey />
          </div>
          <div className="comment">
            {show === "text" ? (
              <div className="comment-input1">
                <Input
                  placeholder="Comment"
                  onFocus={() => setShow("comment")}
                />
              </div>
            ) : show === "comment" ? (
              <div className="comment-input">
                <Textarea placeholder="Enter Comment" />
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <HiMail size={20} />
                    <HiVideoCamera size={20} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex" }}>
                      <HiMail
                        size={20}
                        colorProfile={show !== "email" ? "#e3e3e" : "#4f46e5"}
                        color={show != "email" ? "#e3e3e" : "#4f46e5"}
                        onClick={() => setShow("email")}
                      />
                      <HiChat
                        colorProfile={show !== "comment" ? "#e3e3e" : "#4f46e5"}
                        color={show != "comment" ? "#e3e3e" : "#4f46e5"}
                        size={20}
                        onClick={() => setShow("comment")}
                      />
                    </div>
                    <div>
                      <Button variant="twoTone">Comment</Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : show === "email" ? (
              <div className="comment-input2">
                <Input
                  placeholder="From"
                  className="input2 border-transparent focus:outline-white"
                />
                <Input
                  placeholder="to"
                  className="input2 border-transparent focus:outline-white"
                />
                <Input
                  placeholder="Subject"
                  className="input2 border-transparent focus:outline-white"
                />
                <Textarea
                  placeholder="Enter Comment"
                  className="input2 border-transparent focus:outline-white"
                />
                <div
                  style={{
                    marginTop: "1rem",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div style={{ display: "flex" }}>
                    <HiMail size={20} />
                    <HiVideoCamera size={20} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <div style={{ display: "flex" }}>
                      <HiMail
                        size={20}
                        colorProfile={show !== "email" ? "#e3e3e" : "#4f46e5"}
                        color={show == "email" ? "#e3e3e" : "#4f46e5"}
                        onClick={() => setShow("email")}
                      />
                      <HiChat
                        colorProfile={show !== "comment" ? "#e3e3e" : "#4f46e5"}
                        color={show == "comment" ? "#e3e3e" : "#4f46e5"}
                        size={20}
                        onClick={() => setShow("comment")}
                      />
                    </div>
                    <div>
                      <Button variant="twoTone">Send Email</Button>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
      </Modal>
    </>
  );
});

export default BoardCard
