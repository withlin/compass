import "./enhancestatefulsets.scss";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { EnhanceStatefulSet, enhanceStatefulSetApi } from "../../api/endpoints";
import { podsStore } from "../+workloads-pods/pods.store";
import { enhanceStatefulSetStore } from "./enhancestatefulset.store";
import { nodesStore } from "../+nodes/nodes.store";
import { eventStore } from "../+events/event.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { IEnhanceStatefulSetsRouteParams } from "../+workloads";
import { KubeEventIcon } from "../+events/kube-event-icon";
import { apiManager } from "../../api/api-manager";

enum sortBy {
  name = "name",
  namespace = "namespace",
  pods = "pods",
  age = "age",
}

interface Props extends RouteComponentProps<IEnhanceStatefulSetsRouteParams> {
}

@observer
export class EnhanceStatefulSets extends React.Component<Props> {
  getPodsLength(statefulSet: EnhanceStatefulSet) {
    return enhanceStatefulSetStore.getChildPods(statefulSet).length;
  }

  render() {
    return (
      <KubeObjectListLayout
        className="EnhanceStatefulSets" store={enhanceStatefulSetStore}
        dependentStores={[podsStore, nodesStore, eventStore]}
        sortingCallbacks={{
          [sortBy.name]: (statefulSet: EnhanceStatefulSet) => statefulSet.getName(),
          [sortBy.namespace]: (statefulSet: EnhanceStatefulSet) => statefulSet.getNs(),
          [sortBy.age]: (statefulSet: EnhanceStatefulSet) => statefulSet.getAge(false),
          [sortBy.pods]: (statefulSet: EnhanceStatefulSet) => this.getPodsLength(statefulSet),
        }}
        searchFilters={[
          (statefulSet: EnhanceStatefulSet) => statefulSet.getSearchFields(),
        ]}
        renderHeaderTitle={<Trans>Stateful Sets</Trans>}
        renderTableHeader={[
          { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
          { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
          { title: <Trans>Pods</Trans>, className: "pods", sortBy: sortBy.pods },
          { className: "warning" },
          { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
        ]}
        renderTableContents={(statefulSet: EnhanceStatefulSet) => [
          statefulSet.getName(),
          statefulSet.getNs(),
          this.getPodsLength(statefulSet),
          <KubeEventIcon object={statefulSet} />,
          statefulSet.getAge(),
        ]}
        renderItemMenu={(item: EnhanceStatefulSet) => {
          return <EnhanceStatefulSetMenu object={item} />
        }}
      />
    )
  }
}

export function EnhanceStatefulSetMenu(props: KubeObjectMenuProps<EnhanceStatefulSet>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(enhanceStatefulSetApi, {
  Menu: EnhanceStatefulSetMenu,
})
