import "./add-network-attachment-definition-dialog.scss";

import React from "react";
import {Dialog, DialogProps} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Notifications} from "../notifications";
import {
  networkAttachmentDefinitionApi,
  NetworkAttachmentDefinitionConfig,
  networkAttachmentDefinitionConfig,
  IPAM,
  ipam
} from "../../api/endpoints";
import {IPInput} from "../ip";
import {SubTitle} from "../layout/sub-title";
import {Select} from "../select";
import {Input} from "../input";

interface Props extends DialogProps {
}

@observer
export class AddNetworkAttachmentDefinitionDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name: string = "";
  @observable config: NetworkAttachmentDefinitionConfig = networkAttachmentDefinitionConfig;
  @observable ipam: IPAM = ipam;
  @observable routes: { [key: string]: string }[] = [{"dst": "0.0.0.0/0"}];

  static open() {
    AddNetworkAttachmentDefinitionDialog.isOpen = true;
  }

  static close() {
    AddNetworkAttachmentDefinitionDialog.isOpen = false;
  }

  close = () => {
    AddNetworkAttachmentDefinitionDialog.close();
  }

  addNetworkAttachmentDefinition = async () => {
    try {

      this.ipam.routes = this.routes;
      this.config.ipam = this.ipam;
      this.config.name = this.name;
      await networkAttachmentDefinitionApi.create({name: this.name, namespace: "kube-system"}, {
        spec: {
          config: JSON.stringify(this.config)
        }
      })
      Notifications.ok(
        <>NetworkAttachmentDefinition {name} save succeeded</>
      );
      this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }

  render() {
    const {...dialogProps} = this.props;
    const header = <h5>Create NetworkAttachmentDefinition</h5>;
    return (
      <Dialog {...dialogProps} className="AddNetworkAttachmentDefinitionDialog"
              isOpen={AddNetworkAttachmentDefinitionDialog.isOpen} close={this.close}>
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column"
                      nextLabel={`Create NetworkAttachmentDefinition`} next={this.addNetworkAttachmentDefinition}>
            <SubTitle title={`name`}/>
            <Input
              required
              value={this.name}
              onChange={(value) => this.name = value}
            />
            <SubTitle title={`type`}/>
            <Select
              required
              value={this.config.type}
              options={['macvlan']}
              onChange={(value) => this.config.type = value.value}
            />
            <SubTitle title={`master`}/>
            <Input
              required
              value={this.config.master}
              onChange={(value) => this.config.master = value}
            />
            <SubTitle title={`mode`}/>
            <Select
              required
              value={this.config.mode}
              options={['bridge']}
              onChange={(value) => this.config.mode = value.value}
            />
            <SubTitle title={`IPAM type`}/>
            <Select
              required
              value={this.ipam.type}
              options={['host-local']}
              onChange={(value) => this.ipam.type = value.value}
            />
            <SubTitle title={`IPAM RangeStart`}/>
            <IPInput
              value={this.ipam.rangeStart}
              onChange={(value: string) => {
                this.ipam.rangeStart = value
              }}/>
            <SubTitle title={`IPAM RangeEnd`}/>
            <IPInput
              value={this.ipam.rangeEnd}
              onChange={(value: string) => {
                this.ipam.rangeEnd = value
              }}/>
            <SubTitle title={`IPAM SubNet`}/>
            <IPInput
              value={this.ipam.subnet}
              isIPv4CIDR
              onChange={(value: string) => {
                this.ipam.subnet = value
              }}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}