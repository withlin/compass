import "./add-ingress-dialog.scss"

import React from "react";
import {observer} from "mobx-react";
import {Dialog, DialogProps} from "../dialog";
import {observable} from "mobx";
import {Wizard, WizardStep} from "../wizard";
import {t, Trans} from "@lingui/macro";
import {Notifications} from "../notifications";
import {Collapse} from "../collapse";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {Backend, backend, BackendDetails, MultiRuleDetails, Rule, TlsDetails, Tls} from "../+network-ingress-details";
import {Ingress} from "../../api/endpoints";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {ingressStore} from "./ingress.store";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddIngressDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name = "";
  @observable namespace = "";
  @observable tls: Tls[] = [];
  @observable rules: Rule[] = [];
  @observable backend: Backend = backend

  static open() {
    AddIngressDialog.isOpen = true;
  }

  static close() {
    AddIngressDialog.isOpen = false;
  }

  close = () => {
    AddIngressDialog.close();
  }

  createIngress = () => {
    const {name, namespace, tls, rules, backend} = this;
    let data: Partial<Ingress> = {
      spec: {
        tls: tls.map(item => {
          return {hosts: item.hosts, secretName: item.secretName};
        }).slice(),
        rules: JSON.parse(JSON.stringify(rules)),
      }
    }
    if (backend.serviceName != "" && backend.servicePort != 0) {
      data.spec.backend = JSON.parse(JSON.stringify(backend))
    }
    try {
      ingressStore.create({name: name, namespace: namespace}, {...data})
      Notifications.ok(
        <>Ingress {name} save succeeded</>
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const header = <h5><Trans>Create Ingress</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        className="AddIngressDialog"
        isOpen={AddIngressDialog.isOpen}
        close={this.close}
      >
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createIngress}>
            <SubTitle title={<Trans>Name</Trans>}/>
            <Input
              required={true}
              title={"Name"}
              value={this.name}
              onChange={value => this.name = value}
            />
            <SubTitle title={<Trans>Namespace</Trans>}/>
            <NamespaceSelect
              themeName="light"
              title={"namespace"}
              value={this.namespace}
              onChange={({value}) => this.namespace = value}
            />
            <Collapse panelName={<Trans>Rules</Trans>} key={"rules"}>
              <MultiRuleDetails
                value={this.rules}
                onChange={value => this.rules = value}/>
            </Collapse>
            <Collapse panelName={<Trans>Backend</Trans>} key={"backend"}>
              <BackendDetails
                value={this.backend}
                onChange={value => this.backend = value}
              />
            </Collapse>
            <Collapse panelName={<Trans>Transport Layer Security</Trans>} key={"tls"}>
              <TlsDetails
                value={this.tls}
                onChange={value => this.tls = value}
              />
            </Collapse>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}