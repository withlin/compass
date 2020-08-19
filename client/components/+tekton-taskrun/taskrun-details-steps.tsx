import "./taskrun-details-steps.scss"

import * as React from "react";
import {StatusBrick} from "../status-brick";
import {StepState} from "../../api/endpoints";
import {TaskRunDetailsStepState} from "./taskrun-details-stepstate";
import {cssNames} from "../../utils";

interface Props {
  stepState: StepState
}

export class TaskRunDetailsSteps extends React.Component<Props> {

  render() {

    const {stepState} = this.props;

    status = "waiting";
    if (stepState.waiting) {
      status = "waiting";
    }
    if (stepState.running) {
      status = "running";
    }
    if (stepState.terminated) {
      status = "terminated";
    }

    return (
      <div className={"TaskRunDetailsSteps"}>
        <div className="pod-container-title">
          <StatusBrick className={cssNames(status)}/> {stepState.container}
        </div>
        <br/>
        <div className={"TaskRunDetailsStepState"}>
          <TaskRunDetailsStepState stepState={stepState}/>
        </div>
        <br/>
      </div>
    )
  }
}