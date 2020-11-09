import * as React from "react";
import {observer} from "mobx-react";
import {RouteComponentProps} from "react-router";
import {t, Trans} from "@lingui/macro";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object";
import {KubeObjectListLayout} from "../kube-object";
import {INetworkAttachmentDefinitionRouteParams} from "./network-attachment-definition.route";
import {networkAttachmentDefinitionStore} from "./network-attachment-definition.store";
import {apiManager} from "../../api/api-manager";
import {
  NetworkAttachmentDefinition,
  networkAttachmentDefinitionApi
} from "../../api/endpoints";
import {AddNetworkAttachmentDefinitionDialog} from "./add-network-attachment-definition-dialog";

enum sortBy {
  name = "name",
  namespace = "namespace",
  age = "age",
}

interface Props extends RouteComponentProps<INetworkAttachmentDefinitionRouteParams> {
}

@observer
export class NetworkAttachmentDefinitions extends React.Component<Props> {

  render() {
    return (
      <>
        <KubeObjectListLayout
          onDetails={(obj:NetworkAttachmentDefinition ) => {console.log(obj.getConfig())}}
          className="NetworkAttachmentDefinition"
          store={networkAttachmentDefinitionStore}
          sortingCallbacks={{
            [sortBy.name]: (item: NetworkAttachmentDefinition) => item.getName(),
            [sortBy.namespace]: (item: NetworkAttachmentDefinition) => item.getNs(),
          }}
          searchFilters={[
            (item: NetworkAttachmentDefinition) => item.getSearchFields()
          ]}
          renderHeaderTitle={<Trans>NetworkAttachmentDefinition</Trans>}
          renderTableHeader={[
            {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
            {title: <Trans>Namespace</Trans>, className: "namespace"},
            {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
          ]}
          renderTableContents={(field: NetworkAttachmentDefinition) => [
            field.getName(),
            field.getNs(),
            field.getAge(),
          ]}
          renderItemMenu={(item: NetworkAttachmentDefinition) => {
            return <NetworkAttachmentDefinitionMenu object={item}/>
          }}
          addRemoveButtons={{
            addTooltip: <Trans>Add NetworkAttachmentDefinition</Trans>,
            onAdd: () => AddNetworkAttachmentDefinitionDialog.open(),
          }}
        />
        <AddNetworkAttachmentDefinitionDialog />
      </>
    );
  }
}

export function NetworkAttachmentDefinitionMenu(props: KubeObjectMenuProps<NetworkAttachmentDefinition>) {

  return (
    <KubeObjectMenu {...props} />
  )
}

apiManager.registerViews(networkAttachmentDefinitionApi, {Menu: NetworkAttachmentDefinitionMenu})
