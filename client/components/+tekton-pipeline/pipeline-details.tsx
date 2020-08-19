import React from "react";
import {KubeObjectDetailsProps} from "../kube-object";
import {Pipeline, pipelineApi} from "../../api/endpoints";
import {observer} from "mobx-react";
import {apiManager} from "../../api/api-manager";
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {KubeEventDetails} from "../+events/kube-event-details";
import {Trans} from "@lingui/macro";
import {DrawerItem} from "../drawer";
import {PipelineDetailsTask} from "./pipeline-details-task";

interface Props extends KubeObjectDetailsProps<Pipeline> {
}

@observer
export class PipelineDetails extends React.Component<Props> {

  render() {
    const {object: pipeline} = this.props;
    if (!pipeline) {
      return null;
    }

    return (
      <div className="PipelineDetails">
        <KubeObjectMeta object={pipeline}/>

        <DrawerItem name={<Trans>Tasks</Trans>}>
          <PipelineDetailsTask pipeline={pipeline}/>
        </DrawerItem>

        <KubeEventDetails object={pipeline}/>
      </div>
    )
  }
}

apiManager.registerViews(pipelineApi, {
  Details: PipelineDetails,
})