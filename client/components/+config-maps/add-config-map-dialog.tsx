import "./add-config-map-dialog.scss"

import React from "react";
import { observer } from "mobx-react";
import { Dialog, DialogProps } from "../dialog";
import { observable } from "mobx";
import { Wizard, WizardStep } from "../wizard";
import { t, Trans } from "@lingui/macro";
import { Notifications } from "../notifications";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { ConfigMapDataDetails } from "./config-map-data-details";
import { Collapse } from "../collapse";
import { Data } from "./common";
import { configMapApi, ConfigMap } from "../../api/endpoints";
import { NamespaceSelect } from "../+namespaces/namespace-select";
import { _i18n } from "../../i18n";
import { IKubeObjectMetadata } from "../../api/kube-object";
import { showDetails } from "../../navigation";

interface Props extends Partial<DialogProps> {
}

@observer
export class AddConfigMapDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable namespace = "";
  @observable name = "";
  @observable data: Data[] = [];

  static open() {
    AddConfigMapDialog.isOpen = true;
  }

  static close() {
    AddConfigMapDialog.isOpen = false;
  }

  close = () => {
    AddConfigMapDialog.close();
  }

  reset = () => {
    this.name = "";
    this.data = [];
  }

  createConfigMap = async () => {
    try {
      let dataMap = new Map<string, string>();
      this.data.map((item, index) => {
        dataMap.set(item.key, item.value)
      })

      const configMap: Partial<ConfigMap> = {
        data: Object.fromEntries(dataMap),
        metadata: {
          name: this.name,
          namespace: this.namespace,
        } as IKubeObjectMetadata
      }

      const newConfigMap =
        await configMapApi.create(
          { name: this.name, namespace: this.namespace },
          configMap,
        );
      showDetails(newConfigMap.selfLink);
      this.reset();
      Notifications.ok(
        <div>ConfigMap {this.name} save succeeded</div>
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const { ...dialogProps } = this.props;
    const header = <h5><Trans>Create Config Map</Trans></h5>;
    return (
      <Dialog
        {...dialogProps}
        isOpen={AddConfigMapDialog.isOpen}
        close={this.close}
      >
        <Wizard className="AddConfigMapDialog" header={header} done={this.close}>
          <WizardStep contentClass="flow column" nextLabel={<Trans>Create</Trans>} next={this.createConfigMap}>
            <SubTitle title={<Trans>Namespace</Trans>} />
            <NamespaceSelect
              value={this.namespace}
              placeholder={_i18n._(t`Namespace`)}
              themeName="light"
              className="box grow"
              onChange={({ value }) => this.namespace = value}
            />
            <SubTitle title={<Trans>Name</Trans>} />
            <Input
              required={true}
              placeholder={_i18n._(t`Name`)}
              value={this.name}
              onChange={value => this.name = value}
            />
            <br/>
            <ConfigMapDataDetails value={this.data} onChange={value => this.data = value} />
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}