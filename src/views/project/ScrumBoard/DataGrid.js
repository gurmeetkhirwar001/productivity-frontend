import React from "react";

import Grid from './scrumBoardDrag'


class GridApp extends React.Component {
  render() {
    console.log();
    return (
      <div className="flex-tables" style={{display:'flex'}} >
        <div className="column">
          <Grid tasksStore="" status={1} />
        </div>
        <div className="column">
          <Grid tasksStore="" status={2} />
        </div>
        <div className="column">
          <Grid tasksStore="" status={3} />
        </div>
        <div className="column">
          <Grid tasksStore="" status={4} />
        </div>
        
      </div>
    );
  }
}
export default GridApp;
