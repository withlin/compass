import "./pods.scss"

import React, {Fragment} from "react";
import {observer} from "mobx-react";
import {Link} from "react-router-dom";
import {Trans} from "@lingui/macro";
import {podsStore} from "./pods.store";
import {RouteComponentProps} from "react-router";
import {volumeClaimStore} from "../+storage-volume-claims/volume-claim.store";
import {IPodsRouteParams} from "../+workloads";
import {eventStore} from "../+events/event.store";
import {KubeObjectListLayout} from "../kube-object";
import {Pod, podsApi} from "../../api/endpoints";
import {PodMenu} from "./pod-menu";
import {stopPropagation} from "../../utils";
import {KubeEventIcon} from "../+events/kube-event-icon";
import {getDetailsUrl} from "../../navigation";
import kebabCase from "lodash/kebabCase";
import {lookupApiLink} from "../../api/kube-api";
import {apiManager} from "../../api/api-manager";
import {PodContainerStatuses} from "./pod-container-statuses";
import {TooltipContent} from "../tooltip";
import {Tooltip} from "../tooltip";

enum sortBy {
  name = "name",
  namespace = "namespace",
  containers = "containers",
  restarts = "restarts",
  age = "age",
  qos = "qos",
  node = "node",
  owners = "owners",
  status = "status",
}

interface Props extends RouteComponentProps<IPodsRouteParams> {
}

@observer
export class Pods extends React.Component<Props> {

  renderStatus(pod: Pod) {
    const b = pod.getStatusMessage(true);
    const tooltipId = pod.getName();
    const tooltip = (
      <>
        <span id={tooltipId}>{b.reason}</span>
        {b.message != "" ?
          <Tooltip htmlFor={tooltipId} following>
            <TooltipContent tableView>{b.message}</TooltipContent>
          </Tooltip> : null}
      </>
    );
    return {title: tooltip, className: kebabCase(b.reason)}
  }

  render() {
    return (
      <KubeObjectListLayout
        className="Pods" store={podsStore}
        dependentStores={[volumeClaimStore, eventStore]}
        sortingCallbacks={{
          [sortBy.name]: (pod: Pod) => pod.getName(),
          [sortBy.namespace]: (pod: Pod) => pod.getNs(),
          [sortBy.containers]: (pod: Pod) => pod.getContainers().length,
          [sortBy.restarts]: (pod: Pod) => pod.getRestartsCount(),
          [sortBy.node]: (pod: Pod) => pod.getNodeName(),
          [sortBy.owners]: (pod: Pod) => pod.getOwnerRefs().map(ref => ref.kind),
          [sortBy.qos]: (pod: Pod) => pod.getQosClass(),
          [sortBy.age]: (pod: Pod) => pod.getAge(false),
          [sortBy.status]: (pod: Pod) => pod.getStatusMessage(),
        }}
        searchFilters={[
          (pod: Pod) => pod.getSearchFields(),
          (pod: Pod) => pod.getStatusMessage(),
        ]}
        renderHeaderTitle={<Trans>Pods</Trans>}
        renderTableHeader={[
          {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
          {className: "warning"},
          {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
          {title: <Trans>Containers</Trans>, className: "containers", sortBy: sortBy.containers},
          {title: <Trans>Restarts</Trans>, className: "restarts", sortBy: sortBy.restarts},
          {title: <Trans>Controlled By</Trans>, className: "owners", sortBy: sortBy.owners},
          {title: <Trans>Node</Trans>, className: "node", sortBy: sortBy.node},
          {title: <Trans>QoS</Trans>, className: "qos", sortBy: sortBy.qos},
          {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
          {title: <Trans>Status</Trans>, className: "status", sortBy: sortBy.status},
        ]}
        renderTableContents={(pod: Pod) => [
          pod.getName(),
          pod.hasIssues() && <KubeEventIcon object={pod}/>,
          pod.getNs(),
          <PodContainerStatuses pod={pod}/>,
          pod.getRestartsCount(),
          pod.getOwnerRefs().map(ref => {
            const {kind, name} = ref;
            const detailsLink = getDetailsUrl(lookupApiLink(ref, pod));
            return (
              <Link key={name} to={detailsLink} className="owner" onClick={stopPropagation}>
                {kind}
              </Link>
            )
          }),
          pod.getNodeName(),
          pod.getQosClass(),
          pod.getAge(),
          this.renderStatus(pod),
        ]}
        renderItemMenu={(item: Pod) => {
          return <PodMenu object={item}/>
        }}
      />
    )
  }
}

apiManager.registerViews(podsApi, {
  Menu: PodMenu,
})