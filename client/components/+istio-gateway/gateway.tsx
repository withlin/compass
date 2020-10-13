
import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { gateWayApi, Gateway } from "../../api/endpoints";
import { gatewayStore } from "./gateway.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { MenuItem } from "../menu";
import { GateWayDialog } from "./add-gateway-dialog"


enum sortBy {
    name = "name",
    namespace = "namespace",
    ownernamespace = "ownernamespace",
    pods = "pods",
    age = "age",
}

interface Props extends RouteComponentProps { }

@observer
export class Gateways extends React.Component<Props> {

    render() {
        return (
            <>
                <KubeObjectListLayout
                    isClusterScoped
                    className="Gateways"
                    store={gatewayStore}
                    sortingCallbacks={{
                        [sortBy.name]: (gw: Gateway) => gw.getName(),
                        [sortBy.namespace]: (gw: Gateway) => gw.getNs(),
                        [sortBy.ownernamespace]: (gw: Gateway) => gw.getOwnerNamespace(),
                        [sortBy.age]: (gw: Gateway) => gw.getAge(false),
                    }}
                    searchFilters={[(gw: Gateway) => gw.getSearchFields()]}
                    renderHeaderTitle={<Trans>Gateways</Trans>}
                    renderTableHeader={[
                        {
                            title: <Trans>Name</Trans>,
                            className: "name",
                            sortBy: sortBy.name,
                        },
                        {
                            title: <Trans>Namespace</Trans>,
                            className: "namespace",
                            sortBy: sortBy.namespace,
                        },
                        {
                            title: <Trans>OwnerNamespace</Trans>,
                            className: "ownernamespace",
                            sortBy: sortBy.ownernamespace,
                        },
                        { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
                    ]}
                    renderTableContents={(gw: Gateway) => [
                        gw.getName(),
                        gw.getNs(),
                        gw.getOwnerNamespace(),
                        gw.getAge(),
                    ]}
                    renderItemMenu={(item: Gateway) => {
                        return <GatewayMenu object={item} />;
                    }}
                    addRemoveButtons={{
                        addTooltip: <Trans>Gateway</Trans>,
                        onAdd: () => {
                            GateWayDialog.open();
                        },
                    }}
                />
                <GateWayDialog />
            </>

        );
    }
}

export function GatewayMenu(props: KubeObjectMenuProps<Gateway>) {
    const { object, toolbar } = props;
    return (
        <KubeObjectMenu {...props}>
            <MenuItem
                onClick={() => {
                    //donot something
                }}
            >
            </MenuItem>
        </KubeObjectMenu>
    );
}

apiManager.registerViews(gateWayApi, { Menu: GatewayMenu });
