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
} from "../../api/endpoints";
import {IPInput} from "../ip";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {Icon} from "../icon";
import {stopPropagation} from "../../utils";
import {createMuiTheme, Grid, Paper} from "@material-ui/core";
import {ThemeProvider} from "@material-ui/core/styles";
import {Select} from "../select";

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
export class AddNetworkAttachmentDefinitionDialog extends React.Component<Props> {

  @observable static isOpen = false;
  @observable name: string = "";
  @observable config: NetworkAttachmentDefinitionConfig = networkAttachmentDefinitionConfig;
  @observable routes: { [key: string]: string }[] = [{"dst": "0.0.0.0/0"}];

  static open() {
    AddNetworkAttachmentDefinitionDialog.isOpen = true;
  }

  static close() {
    AddNetworkAttachmentDefinitionDialog.isOpen = false;
  }

  reset () {
    this.config = networkAttachmentDefinitionConfig;
    this.name = "";
  }

  close = () => {
    AddNetworkAttachmentDefinitionDialog.close();
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

  addNetworkAttachmentDefinition = async () => {
    try {
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
      <ThemeProvider theme={theme}>
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