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
import {createMuiTheme, Grid, Paper} from "@material-ui/core";
import {Icon} from "../icon";
import {stopPropagation} from "../../utils";
import {ThemeProvider} from "@material-ui/core/styles";

const theme = createMuiTheme({
  overrides: {
    MuiExpansionPanelDetails: {
      root: {
        display: "gird",
      },
    },
    MuiPaper: {
      root: {
        color: "",
      },
    },
  },
});

interface Props extends DialogProps {
}

@observer
export class ConfigNetworkAttachmentDefinitionDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable static data: NetworkAttachmentDefinition = null;
  @observable name: string = "";
  @observable namespace: string = "";
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
    this.name = this.object.getName();
    this.namespace = this.object.getNs();
  }

  reset() {
    this.name = "";
    this.namespace = "";
    this.config = networkAttachmentDefinitionConfig;
    ConfigNetworkAttachmentDefinitionDialog.data = null;
  }

  close = () => {
    ConfigNetworkAttachmentDefinitionDialog.close();
    this.reset();
  }

  add = () => {
    this.config.plugins.push({
      type: "macvlan",
      mode: "bridge",
      ipam: {
        type: 'host-local',
        routes: [{"dst": "0.0.0.0/0"}]
      }
    });
  }

  remove = (index: number) => {
    this.config.plugins.splice(index, 1);
  }

  renderPlugin(index: number) {
    return (
      <Paper elevation={3} style={{padding: 25}}>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs={11} zeroMinWidth>
            <SubTitle title={`master`}/>
            <Input
              required
              value={this.config.plugins[index]?.master}
              onChange={(value) => this.config.plugins[index].master = value}
            />
            <SubTitle title={`type :`} children={'macvlan'}/>
            <SubTitle title={`mode :`} children={'bridge'}/>
            <SubTitle title={`IPAM type`}/>
            <Select
              value={this.config.plugins[index]?.ipam.type}
              options={['host-local', 'route-override']}
              onChange={(value) => this.config.plugins[index].ipam.type = value.value}
            />
            <SubTitle title={`IPAM RangeStart`}/>
            <IPInput
              value={this.config.plugins[index]?.ipam.rangeStart}
              onChange={(value: string) => {
                this.config.plugins[index].ipam.rangeStart = value
              }}/>
            <SubTitle title={`IPAM RangeEnd`}/>
            <IPInput
              value={this.config.plugins[index]?.ipam.rangeEnd}
              onChange={(value: string) => {
                this.config.plugins[index].ipam.rangeEnd = value
              }}/>
            <SubTitle title={`IPAM SubNet`}/>
            <IPInput
              value={this.config.plugins[index]?.ipam.subnet}
              isIPv4CIDR
              onChange={(value: string) => {
                this.config.plugins[index].ipam.subnet = value
              }}/>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Icon
              small
              tooltip={`Remove`}
              className="remove-icon"
              material="clear"
              onClick={(event) => {
                this.remove(index);
                stopPropagation(event);
              }}
            />
          </Grid>
        </Grid>
      </Paper>
    )
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
      <ThemeProvider theme={theme}>
        <Dialog {...dialogProps}
                className="ConfigNetworkAttachmentDefinitionDialog"
                isOpen={ConfigNetworkAttachmentDefinitionDialog.isOpen}
                close={this.close}
                onOpen={this.onOpen}>
          <Wizard header={header} done={this.close}>
            <WizardStep contentClass="flex gaps column"
                        nextLabel={`Config NetworkAttachmentDefinition`} next={this.configNetworkAttachmentDefinition}>
              <SubTitle title={`name :`} children={this.name} />
              <SubTitle title={`namespace :`} children={this.namespace} />
              <SubTitle
                title={
                  <>
                    Plugins
                    &nbsp;&nbsp;
                    <Icon material={"edit"} className={"editIcon"} onClick={event => {
                      this.add();
                      stopPropagation(event);
                    }} small/>
                  </>
                }>
              </SubTitle>
              {this.config.plugins?.map((item, index) => this.renderPlugin(index))}
            </WizardStep>
          </Wizard>
        </Dialog>
      </ThemeProvider>
    )
  }
}