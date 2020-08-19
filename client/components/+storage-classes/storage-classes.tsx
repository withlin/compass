import "./storage-classes.scss"

import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { observer } from "mobx-react";
import { t, Trans } from "@lingui/macro";
import { StorageClass, storageClassApi } from "../../api/endpoints/storage-class.api";
import { KubeObjectMenu, KubeObjectMenuProps } from "../kube-object/kube-object-menu";
import { KubeObjectListLayout } from "../kube-object";
import { IStorageClassesRouteParams } from "./storage-classes.route";
import { storageClassStore } from "./storage-class.store";
import { apiManager } from "../../api/api-manager";
import { MainLayout } from "../layout/main-layout";
import { AddStorageClassDialog } from "./add-storageclass-dialog";
import { MenuItem } from "../menu/menu";
import { Icon } from "../icon/icon";
import { _i18n } from "../../../client/i18n";
import { secretsStore } from "../+config-secrets/secrets.store";

enum sortBy {
    name = "name",
    age = "age",
    provisioner = "provision",
    reclaimPolicy = "reclaim",
}

interface Props extends RouteComponentProps<IStorageClassesRouteParams> {
}

@observer
export class StorageClasses extends React.Component<Props> {
    render() {
        return (
            <>
                <KubeObjectListLayout
                    className="StorageClasses"
                    store={storageClassStore} isClusterScoped
                    dependentStores={[secretsStore]}
                    sortingCallbacks={{
                        [sortBy.name]: (item: StorageClass) => item.getName(),
                        [sortBy.age]: (item: StorageClass) => item.getAge(false),
                        [sortBy.provisioner]: (item: StorageClass) => item.provisioner,
                        [sortBy.reclaimPolicy]: (item: StorageClass) => item.reclaimPolicy,
                    }}
                    searchFilters={[
                        (item: StorageClass) => item.getSearchFields(),
                        (item: StorageClass) => item.provisioner,
                    ]}
                    renderHeaderTitle={<Trans>Storage Classes</Trans>}
                    renderTableHeader={[
                        { title: <Trans>Name</Trans>, className: "name", sortBy: sortBy.name },
                        { title: <Trans>Provisioner</Trans>, className: "provisioner", sortBy: sortBy.provisioner },
                        {
                            title: <Trans>Reclaim Policy</Trans>,
                            className: "reclaim-policy",
                            sortBy: sortBy.reclaimPolicy
                        },
                        { title: <Trans>Default</Trans>, className: "is-default" },
                        { title: <Trans>Age</Trans>, className: "age", sortBy: sortBy.age },
                    ]}
                    renderTableContents={(storageClass: StorageClass) => [
                        storageClass.getName(),
                        storageClass.provisioner,
                        storageClass.getReclaimPolicy(),
                        storageClass.isDefault() ? <Trans>Yes</Trans> : null,
                        storageClass.getAge(),
                    ]}
                    renderItemMenu={(item: StorageClass) => {
                        return <StorageClassMenu object={item} />
                    }}
                    addRemoveButtons={{
                        addTooltip: <Trans>Add StorageClass</Trans>,
                        onAdd: () => AddStorageClassDialog.open(),
                    }}
                />
                <AddStorageClassDialog />
            </>
        )
    }
}

export function StorageClassMenu(props: KubeObjectMenuProps<StorageClass>) {
    const { object, toolbar } = props;
    return (
        <KubeObjectMenu {...props} >
        </KubeObjectMenu>
    )
}

apiManager.registerViews(storageClassApi, {
    Menu: StorageClassMenu,
})