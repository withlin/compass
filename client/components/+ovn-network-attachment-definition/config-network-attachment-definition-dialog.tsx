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
export class ConfigNetworkAttachmentDefinitionDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name: string = "";
  @observable config: NetworkAttachmentDefinitionConfig = networkAttachmentDefinitionConfig;
  @observable ipam: IPAM = ipam;
  @observable routes: { [key: string]: string }[] = [{"dst": "0.0.0.0/0"}];

  static open() {
    ConfigNetworkAttachmentDefinitionDialog.isOpen = true;
  }

  static close() {
    ConfigNetworkAttachmentDefinitionDialog.isOpen = false;
  }

  close = () => {
    ConfigNetworkAttachmentDefinitionDialog.close();
  }

  configNetworkAttachmentDefinition = async () => {
    try {

      this.ipam.routes = this.routes;
      this.config.ipam = this.ipam;
      this.config.name = this.name;

      Notifications.ok(
        <>NetworkAttachmentDefinition {name} save succeeded</>
      );
      // this.close();
    } catch (err) {
      Notifications.error(err);
    }
  }


  render() {
    const {...dialogProps} = this.props;
    const header = <h5>Create NetworkAttachmentDefinition</h5>;
    return (
      <Dialog {...dialogProps} className="ConfigNetworkAttachmentDefinitionDialog"
              isOpen={ConfigNetworkAttachmentDefinitionDialog.isOpen} close={this.close}>
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column"
                      nextLabel={`Create NetworkAttachmentDefinition`} next={this.configNetworkAttachmentDefinition}>
            <SubTitle title={`name`}/>
            <Input
              required value={this.name}
              onChange={(value) => this.name = value}
            />
            <SubTitle title={`type`}/>
            <Select
              required value={this.config.type} options={['macvlan']}
              onChange={(value) => this.config.type = value.value}
            />
            <SubTitle title={`master`}/>
            <Input
              required value={this.config.master}
              onChange={(value) => this.config.master = value}
            />
            <SubTitle title={`mode`}/>
            <Select
              required value={this.config.mode} options={['bridge']}
              onChange={(value) => this.config.mode = value.value}
            />
            <SubTitle title={`IPAM type`}/>
            <Select
              required value={this.ipam.type} options={['host-local']}
              onChange={(value) => this.ipam.type = value.value}
            />
            <SubTitle title={`IPAM RangeStart`}/>
            <IPInput
              value={this.ipam.rangeStart}
              onChange={(value: string) => { this.ipam.rangeStart = value }}/>
            <SubTitle title={`IPAM RangeEnd`}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}