import "./injectors.store.ts";

import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { Injector, injectorApi } from "../../api/endpoints";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { InjectorsRouteParams } from "../+workloads";
import { apiManager } from "../../api/api-manager";
import { injectorStore } from "./injectors.store";

enum sortBy {
  name = "name",
  namespace = "namespace",
  owner = "owner",
  precontainers = "precontainers",
  postcontainers = "postcontainers",
  age = "age",
}

interface Props extends RouteComponentProps<InjectorsRouteParams> {
}

@observer
export class Injectors extends React.Component<Props> {
  getOwner(injector: Injector) {
    return injectorStore.
      getInjector(injector).
      getOwnerRefs().
      map(ref =>
        ref.kind + '/' +
        ref.namespace + ':' +
        ref.name
      );
  }

  getPreContainers(injector: Injector) {
    return injectorStore.
      getInjector(injector)
      .getPreContainer().length
  }

  getPostContainers(injector: Injector) {
    return injectorStore.
      getInjector(injector)
      .getPostContainer().length
  }

  render() {
    return (
      <KubeObjectListLayout
        className="Injectors" store={injectorStore}
        sortingCallbacks={{
          [sortBy.name]: (injector: Injector) => injector.getName(),
          [sortBy.namespace]: (injector: Injector) => injector.getNs(),
          [sortBy.owner]: (injector: Injector) => this.getOwner(injector),
          [sortBy.precontainers]: (injector: Injector) => this.getPreContainers(injector),
          [sortBy.postcontainers]: (injector: Injector) => this.getPostContainers(injector),
          [sortBy.age]: (injector: Injector) => injector.getAge(false),
        }
        }

        searchFilters={
          [
            (injector: Injector) => injector.getSearchFields(),
          ]}

        renderHeaderTitle={< Trans > Injectors</Trans >}
        renderTableHeader={
          [
            { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
            { title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace },
            { title: <Trans>Owner</Trans>, className: "owner", sortBy: sortBy.owner },
            { title: <Trans>PreContainers</Trans>, className: "preconstainers", sortBy: sortBy.precontainers },
            { title: <Trans>PostContainers</Trans>, className: "postcontainers", sortBy: sortBy.postcontainers },
            { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
          ]}

        renderTableContents={(injector: Injector) => [
          injector.getName(),
          injector.getNs(),
          this.getOwner(injector),
          this.getPreContainers(injector),
          this.getPostContainers(injector),
          injector.getAge(),
        ]}

        renderItemMenu={(item: Injector) => {
          return <InjectorMenu object={item} />
        }}
      />
    )
  }
}

export function InjectorMenu(props: KubeObjectMenuProps<Injector>) {
  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(injectorApi, {
  Menu: InjectorMenu,
})
