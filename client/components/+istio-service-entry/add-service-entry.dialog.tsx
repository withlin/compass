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
import { ServiceEntrySpec } from "../../api/endpoints/istio-service-entry.api";
import { serviceEntryStore } from "./service-entry.store";
import { Notifications } from "../notifications";
import { ServerDetail } from "../+istio-common/server"
import { serviceEntryApi } from "../../api/endpoints";
import { SelectorDetails } from "../+istio-common/selector"

interface Props extends DialogProps {
}



@observer
export class ServiceEntryDialog extends React.Component<Props> {

    @observable static isOpen = false;
    // @observable serviceDetail: ServiceEntrySpec =
    // @observable gatewayDetail: GatewayDetail = defaultGatewayDetail;
    // @observable defaultSelector: Selector[] = [];


    static open() {
        ServiceEntryDialog.isOpen = true;
    }

    static close() {
        ServiceEntryDialog.isOpen = false;
    }

    close = async () => {
        ServiceEntryDialog.close();
        await this.reset();
    }

    reset = async () => {

    }

    addGateWay = async () => {
        try {


            await serviceEntryApi.create(
                {
                    name: "",
                    namespace: configStore.getOpsNamespace(),
                    labels: new Map<string, string>().set(
                        "namespace",
                        configStore.getDefaultNamespace()
                    ),
                },
                {
                    // spec: {

                    // },
                }
            )
            Notifications.ok(
                <>ServiceEntry {name} succeeded</>
            );
            await this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const header = <h5><Trans>ServiceEntry</Trans></h5>;

        return (
            <Dialog
                className="ServiceEntryDialog"
                isOpen={ServiceEntryDialog.isOpen}
                close={this.close}
                pinned
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flex gaps column" next={this.addGateWay}>
                        {/* <Input
                            required={true}
                            placeholder={_i18n._("Gateway Name")}
                            value={this.gatewayDetail.name}
                            onChange={(value) => (this.gatewayDetail.name = value)}
                        />

                        <ServerDetail value={this.gatewayDetail.servers} />
                        <br />
                        <SelectorDetails value={this.defaultSelector} /> */}
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}