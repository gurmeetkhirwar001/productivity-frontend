import React from "react";
import DataGrid, {
  Column,
  RowDragging,
  Scrolling,
  Lookup,
} from "devextreme-react/data-grid";
import "devextreme/dist/css/dx.light.css";
import { setprojectList, settasklist } from "store/tasks/project.slice";
import { getTask } from "../ProjectList/components/projectList/getData"; 
import { connect } from "react-redux";
class Grid extends React.Component {
  constructor(props) {
    super(props);
  // const authors=[{low},{normal},{high},{urgent},]
    this.authors = [
      {
        id: 1,
        text: "Low",
      },
      {
        id: 2,
        text: "Normal",
      },
      {
        id: 3,
        text: "High",
      },
      {
        id: 4,
        text: "Urgent",
      },
    ];
    this.filterExpr = ["tasksstatus", "=", this.props.status];

    this.onAdd = this.onAdd.bind(this);

    this.dataSource = {
      store: this.props.tasksStore,
      reshapeOnPush: true,
    };
  }

  onAdd(e) {
    const key = e.itemData.id;
    // console.log(key,"Donk=t know")
    const values = { tasksstatus: e.toData };

    // this.props.tasksStore.update(key, values).then(() => {
    //   this.props.tasksStore.push([
    //     {
    //       type: "update",
    //       key,
    //       data: values,
    //     },
    //   ]);
    // });
  }
  componentDidMount() {
    getTask(this.props.setprojectList);
  }
  render() {

    return (


      <DataGrid
        id="id"
        dataSource={this.props?.tasks?.projectlist}
        height={300}
        showBorders={true}
        filterValue={this.filterExpr}
      >
        <RowDragging
          data={this.props.status}
          group="tasksGroup"
          onAdd={this.onAdd}
        />
        <Scrolling mode="virtual" />
        <Column dataField="tasksname" width={100} />
        <Column dataField="tasksstatus" dataType="number" width={90}>
          <Lookup
            dataSource={this.authors}
            valueExpr="id"
            displayExpr="text"
          />
        </Column>
        {/* <Column dataField="tasksstatus" dataType="number"  width={30} visible={false} /> */}
      </DataGrid>
    )
  }
}
const mapStatetoprops = (state) => ({
  tasks: state.tasks.projects,
});
export default connect(mapStatetoprops, { settasklist, setprojectList })(Grid);
