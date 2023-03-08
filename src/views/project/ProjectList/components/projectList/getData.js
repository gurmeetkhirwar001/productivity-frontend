import { io } from "socket.io-client";
import { socket } from "utils/socketIO";

export async function createTask() {
  const createTask = await socket.emit("createTask", {
    tasksname: "BC123213",
    tasksdescription: "hold",
    taskscreatedat: "date()",
    tasksupdatedat: "date()",
    tasksstatus: "donebaby",
    taskproject: 1,
  });
}
export async function createProject() {
  const createPro = await socket.emit("createProject", {
    projectsname: "HoldUPPPPPPPPPPP",
  });
}

export async function getTask(settasklist) {
  socket.emit("getTask", true);
  socket.on("receive-task", (data) => settasklist(data.data));
}

export async function getProjects( setprojectList) {
  
  socket.emit("getProject", true);
  socket.on("receive-projects", (data) => setprojectList(data));
}

export async function updateTasks(body,setprojectList) {
  socket.emit("updateTaskStatus", body);
  // getProjects(setprojectList)
  // socket.on("receive-updatedTask", (data) => settaskList(data));
}
