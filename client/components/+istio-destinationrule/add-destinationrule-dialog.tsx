import { observer } from "mobx-react";
import React from "react";
import { Dialog, DialogProps } from "../dialog";
import { observable } from "mobx";
import { Wizard, WizardStep } from "../wizard";
import { t, Trans } from "@lingui/macro";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { isUrl, systemName } from "../input/input.validators";
import { _i18n } from "../../i18n";
import { configStore } from "../../config.store";
import { DestinationRuleSpec, Subset, TrafficPolicy } from "../../api/endpoints/istio-destination-rule.api";
import { destinationRuleStore } from "./destination-rule.store";
import { Notifications } from "../notifications";
import { ServerDetail } from "../+istio-common/server"
import { destinationRuleApi } from "../../api/endpoints";
import { SubSetDetails, Pair, SubSetDetail } from "../+istio-common/subset"

interface Props extends DialogProps {
}

export const defaultTrafficPolicy: TrafficPolicy = {

}

export const defaultDestinationRule: DestinationRuleSpec = {
    host: "",
    trafficPolicy: defaultTrafficPolicy,
    subsets: [],
    exportTo: [],
}




@observer
export class DestinationRuleDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable destinationRuleDetail: DestinationRuleSpec = defaultDestinationRule;
    @observable subsetDetail: SubSetDetail[] = [];
    @observable name: string = "";

    static open() {
        DestinationRuleDialog.isOpen = true;
    }

    static close() {
        DestinationRuleDialog.isOpen = false;
    }

    close = async () => {
        DestinationRuleDialog.close();
        await this.reset();
    }

    reset = async () => {
        this.name = "";
        this.destinationRuleDetail = defaultDestinationRule;
        this.subsetDetail = [];
    }

    addGateWay = async () => {
        try {

            let subsets: Subset[] = [];
            //hahatest
            this.subsetDetail.map((item, index) => {
                let subset: Subset = {
                    name: item.name,
                    labels: new Map<string, string>(),
                };
                item.pairs.map((pair) => {
                    subset.labels.set(pair.key, pair.value);
                });
                subset.labels = Object.fromEntries(subset.labels) as any;
                subsets.push(subset);
            });

            await destinationRuleApi.create(
                {
                    name: this.name,
                    namespace: configStore.getOpsNamespace(),
                    labels: new Map<string, string>().set(
                        "namespace",
                        configStore.getDefaultNamespace()
                    ),
                },
                {
                    spec: {
                        host: this.destinationRuleDetail.host,
                        subsets: subsets,
                    },
                }
            )
            Notifications.ok(
                <>DestinationRule {name} succeeded</>
            );
            await this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const header = <h5><Trans>DestinationRule</Trans></h5>;

        return (
            <Dialog
                className="DestinationRuleDialog"
                isOpen={DestinationRuleDialog.isOpen}
                close={this.close}
                pinned
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flex gaps column" next={this.addGateWay}>
                        <Input
                            required={true}
                            placeholder={_i18n._("Name")}
                            value={this.name}
                            onChange={(value) => (this.name = value)}
                        />
                        <Input
                            required={true}
                            placeholder={_i18n._("Host")}
                            value={this.destinationRuleDetail.host}
                            onChange={(value) => (this.destinationRuleDetail.host = value)}
                        />
                        <SubSetDetails value={this.subsetDetail} />
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}