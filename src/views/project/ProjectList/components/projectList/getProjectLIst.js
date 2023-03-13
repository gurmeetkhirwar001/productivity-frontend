import React from 'react';
import 'devextreme/dist/css/dx.light.css';

import  { TreeList, Editing, Column, RowDragging,RequiredRule, Lookup, Button as TreeButton,} from 'devextreme-react/tree-list';

import CheckBox from 'devextreme-react/check-box';
import { Button } from 'components/ui'
import {Navigate} from "react-router-dom"
 import { createTask,getTask,getProjects } from "./getData";
import EditProject from './EditProject';
import { connect } from 'react-redux';
import {settasklist,setprojectList,setCreateModal,setEditProjectModal,setCloneModal,setEditModal} from "store/tasks/project.slice"
import CreateProjectModal from './projectModal';
import {getProjectTypeList} from "store/tasks/project.slice" 
import { DefaultBody, encryptMessage } from "utils/common";
import { withRouter } from 'utils/hoc/withRouter';
import EditProjectModal from './editProjectModal';
import CloneProject from './cloneProject';
import CloneProjectModal from './cloneModal';
const expandedRowKeys = [1];
class App extends React.Component {
  constructor(props) {
    super(props);

    this.onReorder = this.onReorder.bind(this);
    this.onAllowDropInsideItemChanged = this.onAllowDropInsideItemChanged.bind(this);
    this.onAllowReorderingChanged = this.onAllowReorderingChanged.bind(this);
    this.onShowDragIconsChanged = this.onShowDragIconsChanged.bind(this);

    this.state = {
      allowDropInsideItem: true,
      allowReordering: true,
      showDragIcons: true,
      open: false
    };
  }
  componentDidMount(){
    console.log(this.props?.tasks?.activetab,"this.props?.tasks?.activetab")
    if(this.props?.tasks?.activetab == 'list'){
      const body = {
        ...DefaultBody,
        data: {
            usercode:this.props?.user && this.props.user?.user_Code,
        },
        usercode:this.props?.user && this.props.user?.user_Code,
        event: "projecttype",
        action: "get",
      };
      const databody = encryptMessage(body);
      getProjects(this.props.user,this.props.setprojectList)
      this.props.getProjectTypeList({body: databody})
    }
  }
  editButtonRender = (row) => {
    console.log(row,"row")
    return <Button variant="solid" size="sm" onClick={() =>{
      this.props.setEditProjectModal(row.data)
      this.props.setEditModal(true)

    }
      // this.props.setCreateModal(true)}}>Edit</Button>
  }>Edit</Button>
}
viewButtonRender = (row) => {
  console.log(row,"row")
  return <Button variant="solid" size="sm" onClick={() =>{
   localStorage.setItem("projectcode",row.data.projectcode)
   this.props.navigate('/app/project/scrum-board')

  }
    // this.props.setCreateModal(true)}}>Edit</Button>
}>View Tasks</Button>
}
  CloneRender = (row) => {
    return <Button size="sm" onClick={() => {this.props.setCloneModal(true)
      this.props.setEditProjectModal(row.data)
    }}>Clone</Button>
  }
  UpdateStatusRender = (data) => {
    return <Button size="sm" color={data.value == 0 ? 'red-500': 'green-500'} variant="solid">Status</Button>
  }
  render() {
    console.log(this.props.user,"user")
    return (
      <div>
        <Button size="sm"  onClick={() => this.props.setCreateModal(true)}>
			<span>New Project</span>
		</Button>
        
        <TreeList
          id="tasks"
          dataSource={ this.props?.tasks?.projectlist}
          rootValue={-1}
          keyExpr="projectcode"
          showRowLines={true}
          showBorders={true}
          parentIdExpr="Head_ID"
          defaultExpandedRowKeys={expandedRowKeys}
          columnAutoWidth={true}
          // onRowClick={((row) => {
          //   this.props.navigate('/app/project/scrum-board')
          //   localStorage.setItem('projectcode',row.data.projectcode)})}
        >

          <RowDragging
            onDragChange={this.onDragChange}
            onReorder={this.onReorder}
            allowDropInsideItem={this.state.allowDropInsideItem}
            allowReordering={this.state.allowReordering}
            showDragIcons={this.state.showDragIcons}
          
          />
          <Column dataField="projectname" caption="projectname" />
          <Column dataField="tasksname"  />
          <Column dataField="tasksstatus" />
          <Column dataField={"projectcode"}  caption="Edit"  cellRender={this.editButtonRender}/>
          <Column dataField={"viewtask"}  caption="View Task"  cellRender={this.viewButtonRender}/>

          <Column dataField={"Clone"} cellRender={this.CloneRender}/>
          <Column dataField={"activestatus"} cellRender={this.UpdateStatusRender}/>
         
          {/* <Column dataField="Mobile_Phone" /> */}
        </TreeList>

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
        <CreateProjectModal />
        <EditProjectModal />
        <CloneProjectModal />
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
export default connect(mapStatetoprops,{settasklist,setprojectList,setCreateModal,getProjectTypeList,setEditModal,setEditProjectModal,setCloneModal})(withRouter(App));