
import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { virtualServiceApi, VirtualService } from "../../api/endpoints";
import { virtualServiceStore } from "./virtual-service.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { MenuItem } from "../menu";
import { VirtualServiceDialog } from "./add-virtual-service-dialog"

enum sortBy {
    name = "name",
    namespace = "namespace",
    ownernamespace = "ownernamespace",
    pods = "pods",
    age = "age",
}

interface Props extends RouteComponentProps { }

@observer
export class VirtualServices extends React.Component<Props> {

    render() {
        return (
            <>
                <KubeObjectListLayout
                    isClusterScoped
                    className="VirtualServices"
                    store={virtualServiceStore}
                    sortingCallbacks={{
                        [sortBy.name]: (vs: VirtualService) => vs.getName(),
                        [sortBy.namespace]: (vs: VirtualService) => vs.getNs(),
                        [sortBy.ownernamespace]: (vs: VirtualService) => vs.getOwnerNamespace(),
                        [sortBy.age]: (vs: VirtualService) => vs.getAge(false),
                    }}
                    searchFilters={[(vs: VirtualService) => vs.getSearchFields()]}
                    renderHeaderTitle={<Trans>VirtualServices</Trans>}
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
                    renderTableContents={(vs: VirtualService) => [
                        vs.getName(),
                        vs.getNs(),
                        vs.getOwnerNamespace(),
                        vs.getAge(),
                    ]}
                    renderItemMenu={(item: VirtualService) => {
                        return <VirtualServiceMenu object={item} />;
                    }}
                    addRemoveButtons={{
                        addTooltip: <Trans>VirtualService</Trans>,
                        onAdd: () => {
                            VirtualServiceDialog.open();
                        },
                    }}
                />
                <VirtualServiceDialog />
            </>
        );
    }
}

export function VirtualServiceMenu(props: KubeObjectMenuProps<VirtualService>) {
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

apiManager.registerViews(virtualServiceApi, { Menu: VirtualServiceMenu });
