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
import { serviceEntryApi, Port, WorkloadEntrySpec, ServiceEntry_Location, ServiceEntry_Resolution, WorkloadSelector } from "../../api/endpoints";
import { SelectorDetails } from "../+istio-common/selector";
import { WorkloadEntryExt, defaultWorkloadEntry } from "../+istio-workload-entry/add-workload-entry-dialog";
import { HostDetails } from "../+istio-common/hosts";
import { AddressDetial } from "../+istio-common/address"
import { ServiceEntryPortsDetails, ServiceEntryPort, defaultServiceEntryPort } from "../+istio-common/service-entry-ports"
import { ExportTosDetial } from "../+istio-common/export-to"
import { SubjectAltsNameDetial } from "../+istio-common/subject-altname"
import { PortDetails, Lable } from "../+istio-common/ports"
import { LabelDetails } from "../+istio-common/label"
import { Select } from "../select";
// import { ServiceEntryPort } from "../+istio-common/service-entry-ports"

interface Props extends DialogProps {
}


export interface ServiceEntryExt {
    name: string;
    hosts?: string[];
    addresses?: string[];
    ports?: Port[];
    location: string;
    resolution: string;
    endpoints: WorkloadEntryExt;
    workloadSelector: Map<string, string>;
    exportTo?: string[];
    subjectAltNames: string[];
}


export const defaultServiceEntryExt: ServiceEntryExt = {
    name: "",
    hosts: [],
    addresses: [],
    ports: [],
    location: "",
    resolution: "",
    endpoints: defaultWorkloadEntry,
    workloadSelector: new Map<string, string>(),
    exportTo: [],
    subjectAltNames: [],

}


@observer
export class ServiceEntryDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable serviceEntryDetail: ServiceEntryExt = defaultServiceEntryExt;
    @observable serviceEntryPorts: ServiceEntryPort[] = [];
    @observable workloadLabel: Lable[] = [];
    @observable keyPairLabels: Lable[] = [];
    @observable keyPairPorts: Lable[] = [];


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
        this.serviceEntryDetail = defaultServiceEntryExt;
        this.workloadLabel = [];
        this.keyPairLabels = [];
        this.keyPairPorts = [];
    }

    get resolutionOptions() {
        const options = ["NONE", "STATIC", "DNS"]
        return [...options];
    }

    get locationOptions() {
        const options = ["MESH_EXTERNAL", "MESH_INTERNAL"]
        return [...options];
    }


    addServiceEntry = async () => {
        try {

            let serviceEntry: ServiceEntrySpec = {
            }

            let addresses = this?.serviceEntryDetail?.addresses;
            if (addresses.length > 0 && addresses !== undefined) {
                serviceEntry.addresses = this.serviceEntryDetail.addresses;
            }
            let hosts = this?.serviceEntryDetail?.hosts;
            if (hosts.length > 0 && hosts !== undefined) {
                serviceEntry.hosts = hosts;
            }

            let ports = this.serviceEntryPorts;
            if (ports.length > 0 && ports !== undefined) {
                ports.map((port, index) => {
                    serviceEntry.ports = [];
                    let servicePort: Port = {}
                    if (port.name !== "") {
                        servicePort.name = port.name;
                    }
                    if (port.number !== "") {
                        servicePort.number = Number(port.number);
                    }
                    if (port.protocol !== "") {
                        servicePort.protocol = port.protocol;
                    }
                    if (port.targetPort !== "") {
                        servicePort.targetPort = Number(port.targetPort);
                    }
                    serviceEntry.ports.push(servicePort);

                })
            }

            let location = this?.serviceEntryDetail?.location;
            if (location !== "") {
                serviceEntry.location = location;
            }

            let resolution = this?.serviceEntryDetail?.resolution;
            if (resolution !== "") {
                serviceEntry.resolution = resolution;
            }
            let exportTo = this?.serviceEntryDetail?.exportTo;
            if (exportTo.length > 0) {
                serviceEntry.exportTo = exportTo;
            }

            let subjectAltNames = this?.serviceEntryDetail?.subjectAltNames;
            if (subjectAltNames.length > 0) {
                serviceEntry.subjectAltNames = subjectAltNames;
            }

            let workloadSelector = this?.serviceEntryDetail?.workloadSelector;
            if (workloadSelector.size > 0) {
                const labels: WorkloadSelector = {
                    labels: Object.fromEntries(workloadSelector) as any,
                }
                serviceEntry.workloadSelector = labels;
            }


            if (this?.serviceEntryDetail?.endpoints?.address !== "") {
                serviceEntry.endpoints.address = this.serviceEntryDetail.endpoints.address;
            }
            if (this?.serviceEntryDetail?.endpoints?.locality !== "") {
                serviceEntry.endpoints.locality = this?.serviceEntryDetail.endpoints?.locality;
            }
            if (this?.serviceEntryDetail?.endpoints?.network !== "") {
                serviceEntry.endpoints.network = this?.serviceEntryDetail.endpoints?.network;
            }
            if (this?.serviceEntryDetail?.endpoints?.serviceAccount !== "") {
                serviceEntry.endpoints.serviceAccount = this?.serviceEntryDetail.endpoints?.serviceAccount;
            }
            if (this?.serviceEntryDetail?.endpoints?.weightStr !== "") {
                serviceEntry.endpoints.weight = Number(this?.serviceEntryDetail.endpoints?.weightStr);
            }
            if (this?.keyPairLabels.length > 0) {
                serviceEntry.endpoints.labels = new Map<string, string>();
                this?.keyPairLabels?.map((label) => {
                    serviceEntry.endpoints.labels.set(label.key, label.value);
                });
                serviceEntry.endpoints.labels = Object.fromEntries(serviceEntry.endpoints.labels) as any;
            }
            if (this?.keyPairPorts.length > 0) {
                serviceEntry.endpoints.ports = new Map<string, number>();
                this?.keyPairPorts?.map((port) => {
                    serviceEntry.endpoints.ports.set(port.key, Number(port.value));
                });
                serviceEntry.endpoints.ports = Object.fromEntries(serviceEntry.endpoints.ports) as any;
            }


            await serviceEntryApi.create(
                {
                    name: this.serviceEntryDetail.name,
                    namespace: configStore.getOpsNamespace(),
                    labels: new Map<string, string>().set(
                        "namespace",
                        configStore.getDefaultNamespace()
                    ),
                },
                {
                    spec: serviceEntry,
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
                    <WizardStep contentClass="flex gaps column" next={this.addServiceEntry}>
                        <Input
                            required={true}
                            placeholder={_i18n._("Name")}
                            value={this.serviceEntryDetail.name}
                            onChange={(value) => (this.serviceEntryDetail.name = value)}
                        />
                        <Input
                            placeholder={_i18n._("Address")}
                            value={this.serviceEntryDetail.endpoints.address}
                            onChange={(value) => (this.serviceEntryDetail.endpoints.address = value)}
                        />
                        <Input

                            placeholder={_i18n._("Network")}
                            value={this.serviceEntryDetail.endpoints.network}
                            onChange={(value) => (this.serviceEntryDetail.endpoints.network = value)}
                        />
                        <Input

                            placeholder={_i18n._("Locality")}
                            value={this.serviceEntryDetail.endpoints.locality}
                            onChange={(value) => (this.serviceEntryDetail.endpoints.locality = value)}
                        />
                        <Input

                            placeholder={_i18n._("ServiceAccount")}
                            value={this.serviceEntryDetail.endpoints.serviceAccount}
                            onChange={(value) => (this.serviceEntryDetail.endpoints.serviceAccount = value)}
                        />
                        <Input

                            placeholder={_i18n._("Weight")}
                            value={this.serviceEntryDetail.endpoints.weightStr}
                            onChange={(value) => (this.serviceEntryDetail.endpoints.weightStr = value)}
                        />
                        <LabelDetails value={this.keyPairLabels} />
                        <PortDetails value={this.keyPairPorts} />
                        <Select
                            value={this.serviceEntryDetail.location}
                            options={this.locationOptions}
                            themeName={"light"}
                            onChange={(value) => {
                                this.serviceEntryDetail.location = value.value;
                            }}
                        />
                        <Select
                            value={this.serviceEntryDetail.resolution}
                            options={this.resolutionOptions}
                            themeName={"light"}
                            onChange={(value) => {
                                this.serviceEntryDetail.resolution = value.value;
                            }}
                        />
                        <LabelDetails value={this.workloadLabel} />
                        <HostDetails value={this.serviceEntryDetail.hosts} />
                        <AddressDetial value={this.serviceEntryDetail.addresses} />
                        <ServiceEntryPortsDetails value={this.serviceEntryPorts} />
                        <ExportTosDetial value={this.serviceEntryDetail.exportTo} />
                        <SubjectAltsNameDetial value={this.serviceEntryDetail.subjectAltNames} />
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}