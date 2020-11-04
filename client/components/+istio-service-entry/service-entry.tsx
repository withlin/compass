
import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { serviceEntryApi, ServiceEntry } from "../../api/endpoints";
import { serviceEntryStore } from "./service-entry.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { MenuItem } from "../menu";
import { ServiceEntryDialog } from "./add-service-entry.dialog"

enum sortBy {
    name = "name",
    namespace = "namespace",
    ownernamespace = "ownernamespace",
    pods = "pods",
    age = "age",
}

interface Props extends RouteComponentProps { }

@observer
export class ServiceEntrys extends React.Component<Props> {

    render() {
        return (
            <>
                <KubeObjectListLayout
                    isClusterScoped
                    className="ServiceEntrys"
                    store={serviceEntryStore}
                    sortingCallbacks={{
                        [sortBy.name]: (se: ServiceEntry) => se.getName(),
                        [sortBy.namespace]: (se: ServiceEntry) => se.getNs(),
                        [sortBy.ownernamespace]: (se: ServiceEntry) => se.getOwnerNamespace(),
                        [sortBy.age]: (se: ServiceEntry) => se.getAge(false),
                    }}
                    searchFilters={[(se: ServiceEntry) => se.getSearchFields()]}
                    renderHeaderTitle={<Trans>ServiceEntrys</Trans>}
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
                    renderTableContents={(se: ServiceEntry) => [
                        se.getName(),
                        se.getNs(),
                        se.getOwnerNamespace(),
                        se.getAge(),
                    ]}
                    renderItemMenu={(item: ServiceEntry) => {
                        return <ServiceEntryMenu object={item} />;
                    }}
                    addRemoveButtons={{
                        addTooltip: <Trans>ServiceEntry</Trans>,
                        onAdd: () => {
                            ServiceEntryDialog.open();
                        },
                    }}
                />
                <ServiceEntryDialog />
            </>
        );
    }
}

export function ServiceEntryMenu(props: KubeObjectMenuProps<ServiceEntry>) {
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

apiManager.registerViews(serviceEntryApi, { Menu: ServiceEntryMenu });
