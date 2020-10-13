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
import { GatewaySpec } from "../../api/endpoints/istio-gateway.api";
import { gatewayStore } from "./gateway.store";
import { Notifications } from "../notifications";
import { ServerDetail } from "../+istio-common/server"
import { gateWayApi } from "../../api/endpoints";
import { SelectorDetails, Selector } from "../+istio-common/selector"

interface Props extends DialogProps {
}

export interface GatewayDetail extends GatewaySpec {
    name: string;
}

export const defaultGatewayDetail: GatewayDetail = {
    name: "",
    servers: [],
    selector: new Map<string, string>(),
}

@observer
export class GateWayDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable gatewayDetail: GatewayDetail = defaultGatewayDetail;
    @observable defaultSelector: Selector[] = [];


    static open() {
        GateWayDialog.isOpen = true;
    }

    static close() {
        GateWayDialog.isOpen = false;
    }

    close = async () => {
        GateWayDialog.close();
        await this.reset();
    }

    reset = async () => {
        this.gatewayDetail.name = "";
        this.gatewayDetail.servers = [];
        this.gatewayDetail.selector = new Map<string, string>();
    }

    addGateWay = async () => {
        try {

            // let newMap: Map<string, string> = new Map<string, string>();
            // this.defaultSelector.map((item) => {
            //     newMap.set(item.key, item.value)
            // });
            await gateWayApi.create(
                {
                    name: this.gatewayDetail.name,
                    namespace: configStore.getOpsNamespace(),
                    labels: new Map<string, string>().set(
                        "namespace",
                        configStore.getDefaultNamespace()
                    ),
                },
                {
                    spec: {
                        servers: this.gatewayDetail.servers,
                        selector: { "istio": "ingressgateway" } as any,
                    },
                }
            )
            Notifications.ok(
                <>Gateway {name} succeeded</>
            );
            await this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const header = <h5><Trans>Gateway</Trans></h5>;

        return (
            <Dialog
                className="GateWayDialog"
                isOpen={GateWayDialog.isOpen}
                close={this.close}
                pinned
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flex gaps column" next={this.addGateWay}>
                        <Input
                            required={true}
                            placeholder={_i18n._("Gateway Name")}
                            value={this.gatewayDetail.name}
                            onChange={(value) => (this.gatewayDetail.name = value)}
                        />

                        <ServerDetail value={this.gatewayDetail.servers} />
                        <br />
                        <SelectorDetails value={this.defaultSelector} />
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}