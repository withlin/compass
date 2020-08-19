import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Select} from "../select";
import {Input} from "../input";
import {computed, observable} from "mobx";
import {environment, Environment} from "./common";
import {SecretsSelect} from "../+config-secrets/secrets-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {ConfigMapsSelect} from "../+config-maps/config-maps-select";
import {ConfigMapsKeySelect} from "../+config-maps/config-maps-key-select";
import {SecretKeySelect} from "../+config-secrets/secret-key-select";
import {Grid, Paper} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class EnvironmentDetails extends React.Component<Props> {

  // @observable value: Environment[] = this.props.value || environment;
  @observable namespace: string = "";

  @computed get value(): Environment[] {
    return this.props.value || environment;
  }

  get selectOptions() {
    return [
      // "Custom",
      "ConfigMaps",
      "Secrets",
      // "Other"
    ]
  }

  add = () => {
    this.value.push({
      type: "ConfigMaps",
      envConfig: {}
    });
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  rCustom(index: number) {
    return (
      <>
        <SubTitle title={<Trans>Environment</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Environment`)}
          value={this.value[index].envConfig.name}
          onChange={value => this.value[index].envConfig.name = value}
        />
        <SubTitle title={<Trans>Value</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Value`)}
          value={this.value[index].envConfig.value}
          onChange={value => this.value[index].envConfig.value = value}
        />
      </>
    )
  }

  rConfigMaps(index: number) {
    return (
      <>
        <SubTitle title={<Trans>Environment</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Environment`)}
          value={this.value[index].envConfig.name}
          onChange={value => this.value[index].envConfig.name = value}
        />
        <br/>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs zeroMinWidth>
            <SubTitle title={<Trans>ConfigMap Namespace</Trans>}/>
            <NamespaceSelect
              required autoFocus
              value={this.namespace}
              onChange={value => this.namespace = value.value}
            />
          </Grid>
          <Grid item xs zeroMinWidth>
            <SubTitle title={<Trans>ConfigMap Name</Trans>}/>
            <ConfigMapsSelect
              required autoFocus
              value={this.value[index].envConfig.configName}
              namespace={this.namespace}
              onChange={value => this.value[index].envConfig.configName = value.value}
            />
          </Grid>
        </Grid>
        <SubTitle title={<Trans>ConfigMap Key</Trans>}/>
        <ConfigMapsKeySelect
          required autoFocus
          value={this.value[index].envConfig.configKey}
          name={this.value[index].envConfig.configName}
          onChange={value => this.value[index].envConfig.configKey = value.value}
        />
      </>
    )
  }

  rSecrets(index: number) {
    return (
      <div>
        <SubTitle title={<Trans>Environment</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Environment`)}
          value={this.value[index].envConfig.name}
          onChange={value => this.value[index].envConfig.name = value}
        />
        <br/>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs zeroMinWidth>
            <SubTitle title={<Trans>Secret Namespace</Trans>}/>
            <NamespaceSelect
              required autoFocus
              value={this.namespace}
              onChange={value => this.namespace = value.value}
            />
          </Grid>
          <Grid item xs zeroMinWidth>
            <SubTitle title={<Trans>Secret Name</Trans>}/>
            <SecretsSelect
              required autoFocus
              value={this.value[index].envConfig.secretName}
              namespace={this.namespace}
              onChange={value => this.value[index].envConfig.secretName = value.value}
            />
          </Grid>
        </Grid>
        <SubTitle title={<Trans>Secret Key</Trans>}/>
        <SecretKeySelect
          required autoFocus
          value={this.value[index].envConfig.secretKey}
          name={this.value[index].envConfig.secretName}
          onChange={value => this.value[index].envConfig.secretKey = value.value}
        />
      </div>
    )
  }

  rOther(index: number) {
    return (
      <div>
        <SubTitle title={<Trans>Command</Trans>}/>
        <Input
          required={true}
          placeholder={_i18n._(t`Command`)}
          multiLine={true}
          maxRows={5}
          value={this.value[index].envConfig.enterCommand}
          onChange={value => this.value[index].envConfig.enterCommand = value}
        />
      </div>
    )
  }

  render() {

    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>Environment</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        <div className="Environment">
          {this.value.map((item: any, index: number) => {
            return (
              <>
                <br/>
                <Paper elevation={3} style={{padding: 25}}>
                  <Grid container spacing={5} alignItems="center" direction="row">
                    <Grid item xs={11} zeroMinWidth>
                      <div key={index}>
                        <SubTitle title={<Trans>Environment Type</Trans>}/>
                        <Select
                          options={this.selectOptions}
                          value={this.value[index].type}
                          onChange={v => {
                            this.value[index].type = v.value
                          }}
                        />
                        <br/>
                        {this.value[index].type == "Custom" ? this.rCustom(index) : null}
                        {this.value[index].type == "ConfigMaps" ? this.rConfigMaps(index) : null}
                        {this.value[index].type == "Secrets" ? this.rSecrets(index) : null}
                        {this.value[index].type == "Other" ? this.rOther(index) : null}
                      </div>
                      <br/>
                    </Grid>
                    <Grid item xs zeroMinWidth style={{textAlign: "center"}}>
                      <Icon
                        style={{margin: "0.8vw, 0.9vh"}}
                        small
                        tooltip={_i18n._(t`Remove Environment`)}
                        className="remove-icon"
                        material="clear"
                        onClick={(e) => {
                          this.remove(index);
                          e.stopPropagation();
                        }}
                      />
                    </Grid>
                  </Grid>
                </Paper>
              </>
            )
          })}
        </div>
      </>
    )
  }
}