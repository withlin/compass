import "./resource-quotas.scss";

import * as React from "react";
import {observer} from "mobx-react";
import {t, Trans} from "@lingui/macro";
import {RouteComponentProps} from "react-router";
import {KubeObjectMenu, KubeObjectMenuProps} from "../kube-object/kube-object-menu";
import {KubeObjectListLayout} from "../kube-object";
import {ResourceQuota, resourceQuotaApi} from "../../api/endpoints/resource-quota.api";
import {AddResourceQuotaDialog} from "./add-resource-quota-dialog";
import {resourceQuotaStore} from "./resource-quotas.store";
import {IResourceQuotaRouteParams} from "./resource-quotas.route";
import {apiManager} from "../../api/api-manager";
import {MenuItem} from "../menu";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {ConfigResourceQuotaDialog} from "./config-resource-quota-dialog";
import {Link} from "react-router-dom";
import Tooltip from "@material-ui/core/Tooltip";
import {stopPropagation} from "../../utils";

enum sortBy {
  name = "name",
  namespace = "namespace",
  age = "age"
}

interface Props extends RouteComponentProps<IResourceQuotaRouteParams> {
}

@observer
export class ResourceQuotas extends React.Component<Props> {

  renderResourceQuotasName(resourceQuota: ResourceQuota) {
    const name = resourceQuota.getName();
    return (
      <Link onClick={(event) => { stopPropagation(event); ConfigResourceQuotaDialog.open(resourceQuota) }} to={null}>
        <Tooltip title={name} placement="top-start">
          <span>{name}</span>
        </Tooltip>
      </Link>
    );
  }

  render() {
    return (
      <>
        <KubeObjectListLayout
          className="ResourceQuotas" store={resourceQuotaStore}
          sortingCallbacks={{
            [sortBy.name]: (item: ResourceQuota) => item.getName(),
            [sortBy.namespace]: (item: ResourceQuota) => item.getNs(),
            [sortBy.age]: (item: ResourceQuota) => item.getAge(false),
          }}
          searchFilters={[
            (item: ResourceQuota) => item.getSearchFields(),
            (item: ResourceQuota) => item.getName(),
          ]}
          renderHeaderTitle={<Trans>Resource Quotas</Trans>}
          renderTableHeader={[
            {title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name},
            {title: <Trans>Namespace</Trans>, className: "namespace", sortBy: sortBy.namespace},
            {title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age},
          ]}
          renderTableContents={(resourceQuota: ResourceQuota) => [
            this.renderResourceQuotasName(resourceQuota),
            resourceQuota.getNs(),
            resourceQuota.getAge(),
          ]}
          renderItemMenu={(item: ResourceQuota) => {
            return <ResourceQuotaMenu object={item}/>
          }}
          addRemoveButtons={{
            onAdd: () => AddResourceQuotaDialog.open(),
            addTooltip: <Trans>Create new ResourceQuota</Trans>
          }}
        />
        <AddResourceQuotaDialog/>
        <ConfigResourceQuotaDialog/>
      </>
    );
  }
}

export function ResourceQuotaMenu(props: KubeObjectMenuProps<ResourceQuota>) {

  const {object, toolbar} = props;

  return (
    <KubeObjectMenu {...props}>
      <MenuItem onClick={() => {
        ConfigResourceQuotaDialog.open(object)
      }}>
        <Icon material="settings" title={_i18n._(t`Config`)} interactive={toolbar}/>
        <span className="title"><Trans>Config</Trans></span>
      </MenuItem>
    </KubeObjectMenu>
  );
}

apiManager.registerViews(resourceQuotaApi, {
  Menu: ResourceQuotaMenu,
})