import "./waters.store.ts";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Water, waterApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { waterStore } from "./waters.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { IStatefulSetsRouteParams } from "../+workloads";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";
import { deploymentStore } from "../+workloads-deployments/deployments.store";

enum sortBy {
  name = "name",
  namespace = "namespace",
  pods = "pods",
  statefulsets = "statefulsets",
  age = "age",

}

interface Props extends RouteComponentProps<IStatefulSetsRouteParams> {
}

@observer
export class Waters extends React.Component<Props> {
  getPodsLength(water: Water) {
    return waterStore.getChildPods(water).length;
  }

  // getEnhanceStatefulSetLength(stone: Stone) {
  //   return waterStore.getChildEnhanceStatefulset(stone).length;
  // }


  render() {
    return (
      <KubeObjectListLayout
        className="Waters" store={waterStore}
        dependentStores={[podsStore, nodesStore, eventStore, deploymentStore]}
        sortingCallbacks={{
          [sortBy.name]: (water: Water) => water.getName(),
          [sortBy.namespace]: (water: Water) => water.getNs(),
          [sortBy.age]: (water: Water) => water.getAge(false),
          [sortBy.pods]: (water: Water) => this.getPodsLength(water),
        }}
        searchFilters={[
          (water: Water) => water.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>Waters</Trans>}
        renderTableHeader={[
          { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
          { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
          { title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods },
          { className: "warning" },
          // { title: <Trans>Statefulsets</Trans>, className: "statefulsets", sortBy: sortBy.statefulsets },
          { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={((water: Water) => [
          water.getName(),
          water.getNs(),
          this.getPodsLength(water),
          <KubeEventIcon object={water} />,
          water.getAge(),
        ])}
        renderItemMenu={(item: Water) => {
          return <WaterMenu object={item} />
        }}
      />
    )
  }
}

export function WaterMenu(props: KubeObjectMenuProps<Water>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(waterApi, {
  Menu: WaterMenu,
})
