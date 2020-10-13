
import React from "react";
import { observer } from "mobx-react";
import { RouteComponentProps } from "react-router";
import { Trans } from "@lingui/macro";
import { destinationRuleApi, DestinationRule } from "../../api/endpoints";
import { destinationRuleStore } from "./destination-rule.store";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object";
import { KubeObjectListLayout } from "../kube-object";
import { apiManager } from "../../api/api-manager";
import { MenuItem } from "../menu";

enum sortBy {
    name = "name",
    namespace = "namespace",
    ownernamespace = "ownernamespace",
    pods = "pods",
    age = "age",
}

interface Props extends RouteComponentProps { }

@observer
export class DestinationRules extends React.Component<Props> {

    render() {
        return (
            <>
                <KubeObjectListLayout
                    isClusterScoped
                    className="DestinationRules"
                    store={destinationRuleStore}
                    sortingCallbacks={{
                        [sortBy.name]: (dr: DestinationRule) => dr.getName(),
                        [sortBy.namespace]: (dr: DestinationRule) => dr.getNs(),
                        [sortBy.ownernamespace]: (dr: DestinationRule) => dr.getOwnerNamespace(),
                        [sortBy.age]: (dr: DestinationRule) => dr.getAge(false),
                    }}
                    searchFilters={[(dr: DestinationRule) => dr.getSearchFields()]}
                    renderHeaderTitle={<Trans>DestinationRules</Trans>}
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
                    renderTableContents={(dr: DestinationRule) => [
                        dr.getName(),
                        dr.getNs(),
                        dr.getOwnerNamespace(),
                        dr.getAge(),
                    ]}
                    renderItemMenu={(item: DestinationRule) => {
                        return <DestinationRuleMenu object={item} />;
                    }}
                />
            </>
        );
    }
}

export function DestinationRuleMenu(props: KubeObjectMenuProps<DestinationRule>) {
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

apiManager.registerViews(destinationRuleApi, { Menu: DestinationRuleMenu });
