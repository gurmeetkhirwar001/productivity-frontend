// import React from "react";
// import DataGrid, { Column } from "devextreme-react/data-grid";
// import { getTask } from "../ProjectList/components/projectList/getData";
// import { settasklist } from "store/tasks/project.slice";
// // import { settasklist } from "store/tasks/taskslice"; 

// import { connect } from 'react-redux';
// import 'devextreme/dist/css/dx.light.css';


// class GetTasks extends React.Component {
//   constructor(props) {
//     super(props);

//     this.state = {
//       showColumnLines: true,
//       showRowLines: true,
//       showBorders: true,
//       rowAlternationEnabled: true,
//     };
//   }
//   componentDidMount() {
//     getTask((settasklist)=>{
//         console.log(settasklist)
//  return settasklist
//     })

//     };


    

//   //get data from redux 
// //   set state
// // map component.
// // 

// render() {
//     const {
//       showColumnLines,
//       showRowLines,
//       showBorders,
//       rowAlternationEnabled,
//     } = this.state;
//     return (
//       <React.Fragment>
//         <DataGrid
//         id="tasks"
//           dataSource={settasklist}
//           keyExpr="id"
//           showColumnLines={showColumnLines}
//           showRowLines={showRowLines}
//           showBorders={showBorders}
//           rowAlternationEnabled={rowAlternationEnabled}
//         >
//           <Column dataField="tasksname" />
//           <Column dataField="tasksdescription" />
//           <Column dataField="taskcreatedat" />
//           <Column dataField="taskupdatedat" />
//           <Column dataField="taskstatus" width={130} />
//         </DataGrid>
      
        
          
         
//       </React.Fragment>
//     );
//   }
// }
// const mapStatetoprops = (state) => ({
//     tasks: state
//     })
//     export default connect(mapStatetoprops,{settasklist})(GetTasks);

import React from 'react';
import DataGrid, { Column } from "devextreme-react/data-grid";

import CheckBox from 'devextreme-react/check-box';
//  import { createTask,getTask,getProjects } from "./getData";
import { getProjects,getTask, getTaskList } from '../ProjectList/components/projectList/getData';
import 'devextreme/dist/css/dx.light.css';
import { connect } from 'react-redux';
import {settasklist,setprojectList} from "store/tasks/project.slice"
const expandedRowKeys = [1];
class App extends React.Component {
  constructor(props) {
    super(props);

    // this.onReorder = this.onReorder.bind(this);
    // this.onAllowDropInsideItemChanged = this.onAllowDropInsideItemChanged.bind(this);
    // this.onAllowReorderingChanged = this.onAllowReorderingChanged.bind(this);
    // this.onShowDragIconsChanged = this.onShowDragIconsChanged.bind(this);

    this.state = {
 
    };
  }
  componentDidMount() {
    console.log(this.props?.user,"this.props?.user")
    getTaskList(this.props.user, Number(localStorage.getItem('projectcode')), this.props.setprojectList);
  }
  renderCell = (data) => {
    console.log(data,"dadad")
    return <div style={{ color: data.value == 1 ? "green" : 'red' }}>{data.value == 1 ? "Active" : 'Closed'}</div>;
};
  render() {
    console.log(this.props.tasks && this.props?.tasks)
    return (
      <div>
        
        <DataGrid
          id="tasks"
          dataSource={ this.props?.tasks?.projectlist}
          rootValue={-1}
          keyExpr="Id"
          showRowLines={true}
          showBorders={true}
          parentIdExpr="Head_ID"
          defaultExpandedRowKeys={expandedRowKeys}
          columnAutoWidth={true}
        >

          {/* <RowDragging
            onDragChange={this.onDragChange}
            onReorder={this.onReorder}
            allowDropInsideItem={this.state.allowDropInsideItem}
            allowReordering={this.state.allowReordering}
            showDragIcons={this.state.showDragIcons}
          /> */}
          <Column dataField="Id" positon="Id" />
           
          <Column dataField="rr_Desc" caption={"Task Description"}/>
          <Column dataField="current_State" caption={"Task State"}/>
          <Column dataField="Start_DT" caption={"Start Date"}/>
          <Column dataField="priority_Desc" />

          <Column dataField="active" caption={"Status"}  cellRender={this.renderCell}>
            
            </Column>
         
          {/* <Column dataField="Mobile_Phone" /> */}
        </DataGrid>

        <div className="options">
          <div className="caption">Options</div>
          <div className="options-container">
            <div className="option">
              <CheckBox
                value={this.state.allowDropInsideItem}
                text="Allow Drop Inside Item"
                onValueChanged={this.onAllowDropInsideItemChanged}
              />
            </div>
            <div className="option">
              <CheckBox
                value={this.state.allowReordering}
                text="Allow Reordering"
                onValueChanged={this.onAllowReorderingChanged}
              />
            </div>
            <div className="option">
              <CheckBox
                value={this.state.showDragIcons}
                text="Show Drag Icons"
                onValueChanged={this.onShowDragIconsChanged}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  onDragChange(e) {
    const visibleRows = e.component.getVisibleRows();
    const sourceNode = e.component.getNodeByKey(e.itemData.id);
    let targetNode = visibleRows[e.toIndex].node;

    while (targetNode && targetNode.data) {
      if (targetNode.data.id === sourceNode.data.id) {
        e.cancel = true;
        break;
      }
      targetNode = targetNode.parent;
    }
  }

  onReorder(e) {
    const visibleRows = e.component.getVisibleRows();
    let sourceData = e.itemData;
    let { tasklist } = this.props.tasks && this.props?.tasks;
    const sourceIndex = tasklist.indexOf(sourceData);

    if (e.dropInsideItem) {
      sourceData = { ...sourceData, Head_ID: visibleRows[e.toIndex].key };
      tasklist = [
        ...tasklist.slice(0, sourceIndex),
        sourceData,
        ...tasklist.slice(sourceIndex + 1),
      ];
    } else {
      const toIndex = e.fromIndex > e.toIndex ? e.toIndex - 1 : e.toIndex;
      let targetData = toIndex >= 0 ? visibleRows[toIndex].node.data : null;

      if (targetData && e.component.isRowExpanded(targetData.id)) {
        sourceData = { ...sourceData, Head_ID: targetData.id };
        targetData = null;
      } else {
        const headId = targetData ? targetData.Head_ID : -1;
        if (sourceData.Head_ID !== headId) {
          sourceData = { ...sourceData, Head_ID: headId };
        }
      }

      tasklist = [...tasklist.slice(0, sourceIndex), ...tasklist.slice(sourceIndex + 1)];

      const targetIndex = tasklist.indexOf(targetData) + 1;
      tasklist = [...tasklist.slice(0, targetIndex), sourceData, ...tasklist.slice(targetIndex)];
    }

    this.props.settasklist(tasklist)
  }

  onAllowDropInsideItemChanged(args) {
    this.setState({
      allowDropInsideItem: args.value,
    });
  }

  onAllowReorderingChanged(args) {
    this.setState({
      allowReordering: args.value,
    });
  }

  onShowDragIconsChanged(args) {
    this.setState({
      showDragIcons: args.value,
    });
  }
}
const mapStatetoprops = (state) => ({
tasks: state.tasks.projects,
user: state.auth.user
})
export default connect(mapStatetoprops,{settasklist,setprojectList})(App);