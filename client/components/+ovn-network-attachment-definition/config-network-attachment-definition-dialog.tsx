import "./config-network-attachment-definition-dialog.scss";

import React from "react";
import {Dialog, DialogProps} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {observable} from "mobx";
import {observer} from "mobx-react";
import {Notifications} from "../notifications";
import {
  NetworkAttachmentDefinitionConfig,
  networkAttachmentDefinitionConfig,
  NetworkAttachmentDefinition,
} from "../../api/endpoints";
import {IPInput} from "../ip";
import {SubTitle} from "../layout/sub-title";
import {Select} from "../select";
import {Input} from "../input";
import {networkAttachmentDefinitionStore} from "./network-attachment-definition.store";

interface Props extends DialogProps {
}

@observer
export class ConfigNetworkAttachmentDefinitionDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static data: NetworkAttachmentDefinition = null;
  @observable config: NetworkAttachmentDefinitionConfig = networkAttachmentDefinitionConfig;

  static open(data: NetworkAttachmentDefinition) {
    ConfigNetworkAttachmentDefinitionDialog.data = data;
    ConfigNetworkAttachmentDefinitionDialog.isOpen = true;
  }

  get object() {
    return ConfigNetworkAttachmentDefinitionDialog.data;
  }

  static close() {
    ConfigNetworkAttachmentDefinitionDialog.isOpen = false;
  }

  onOpen = () => {
    this.config = this.object.getConfig();
  }

  reset() {
    this.config = networkAttachmentDefinitionConfig;
    ConfigNetworkAttachmentDefinitionDialog.data = null;
  }

  close = () => {
    ConfigNetworkAttachmentDefinitionDialog.close();
    this.reset();
  }

  configNetworkAttachmentDefinition = async () => {
    try {
      await networkAttachmentDefinitionStore.update(this.object, {
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
    const header = <h5>Config NetworkAttachmentDefinition</h5>;

    return (
      <Dialog {...dialogProps}
              className="ConfigNetworkAttachmentDefinitionDialog"
              isOpen={ConfigNetworkAttachmentDefinitionDialog.isOpen}
              close={this.close}
              onOpen={this.onOpen}>
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column"
                      nextLabel={`Config NetworkAttachmentDefinition`} next={this.configNetworkAttachmentDefinition}>
            <SubTitle title={`type`}/>
            <Select
              required
              value={this.config.type || 'macvlan'}
              options={['macvlan']}
              onChange={(value) =>
                this.config.type = value.value
              }
            />
            <SubTitle title={`master`}/>
            <Input
              required
              value={this.config.master}
              onChange={(value) =>
                this.config.master = value
              }
            />
            <SubTitle title={`mode`}/>
            <Select
              required
              value={this.config.mode}
              options={['bridge']}
              onChange={(value) =>
                this.config.mode = value.value
              }
            />
            <SubTitle title={`IPAM type`}/>
            <Select
              required
              value={this.config.ipam?.type}
              options={['host-local']}
              onChange={(value) =>
                this.config.ipam.type = value.value
              }
            />
            <SubTitle title={`IPAM RangeStart`}/>
            <IPInput
              value={this.config.ipam?.rangeStart}
              onChange={(value: string) => {
                console.log(value)
                this.config.ipam.rangeStart = value
              }}/>
            <SubTitle title={`IPAM RangeEnd`}/>
            <IPInput
              value={this.config.ipam?.rangeEnd}
              onChange={(value: string) => {
                this.config.ipam.rangeEnd = value
              }}/>
            <SubTitle title={`IPAM SubNet`}/>
            <IPInput
              value={this.config.ipam?.subnet}
              isIPv4CIDR
              onChange={(value: string) => {
                this.config.ipam.subnet = value
              }}/>
          </WizardStep>
        </Wizard>
      </Dialog>
    )
  }
}