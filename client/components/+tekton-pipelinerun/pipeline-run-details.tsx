import React from "react";
import {KubeObjectDetailsProps} from "../kube-object";
import {PipelineRun, pipelineRunApi} from "../../api/endpoints";
import {observer} from "mobx-react";
import {apiManager} from "../../api/api-manager";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {KubeEventDetails} from "../+events/kube-event-details";
import {Trans} from "@lingui/macro";
import {DrawerItem} from "../drawer";
import {PipelineRunDetailsTaskRun} from "./pipeline-run-details-task-run";


interface Props extends KubeObjectDetailsProps<PipelineRun> {
}

@observer
export class PipelineRunDetails extends React.Component<Props> {

  render() {
    const {object: pipelineRun} = this.props;
    if (!pipelineRun) {
      return null;
    }

    return (
      <div className="PipelineRunDetails">
        <KubeObjectMeta object={pipelineRun}/>

        <DrawerItem name={<Trans>TaskRuns</Trans>}>
          <PipelineRunDetailsTaskRun pipelineRun={pipelineRun}/>
        </DrawerItem>

        <KubeEventDetails object={pipelineRun}/>
      </div>
    )
  }
}

apiManager.registerViews(pipelineRunApi, {
  Details: PipelineRunDetails,
})