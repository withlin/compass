import React from "react";
import {observer, disposeOnUnmount} from "mobx-react";
import {autorun} from "mobx";
import {Deploy, deployApi} from "../../api/endpoints"
import {KubeObjectMeta} from "../kube-object/kube-object-meta";
import {KubeObjectDetailsProps} from "../kube-object";
import {apiManager} from "../../api/api-manager";

interface Props extends KubeObjectDetailsProps<Deploy> {
}

@observer
export class DeployDetails extends React.Component<Props> {

  async componentDidMount() {
    disposeOnUnmount(this, [
      autorun(() => {
        const {object: deploy} = this.props;
      }),
    ])
  }

  render() {
    const {object: deploy} = this.props;
    if (!deploy) return null;
    return (
      <div className="DeployDetails">
        <KubeObjectMeta object={deploy}/>
      </div>
    )
  }
}

apiManager.registerViews(deployApi, {
  Details: DeployDetails
})