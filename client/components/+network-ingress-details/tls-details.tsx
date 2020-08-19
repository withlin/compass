import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {Tls, tls} from "./common";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {SecretsSelect} from "../+config-secrets/secrets-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {Button} from "../button";
import {TlsHostsDetails} from "./tls-hosts";
import {Grid, Paper} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class TlsDetails extends React.Component<Props> {

  // @observable value: Tls[] = this.props.value || [tls];
  @observable namespace: string = "";

  @computed get value(): Tls[] {
    return this.props.value || [tls];
  }

  add = () => {
    this.value.push(tls);
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  renderAdd() {
    return (
      <Icon
        small
        tooltip={_i18n._(t`Tls`)}
        material="edit"
        onClick={(e) => {
          this.add();
          e.stopPropagation();
        }}
      />
    )
  }

  rTLS(index: number) {
    return (
      <>
        <br/>
        <Paper elevation={3} style={{ padding: 25 }}>
          <Grid container spacing={5} alignItems="center" direction="row">
            <Grid item xs={11} zeroMinWidth>
              <TlsHostsDetails
                divider={true}
                value={this.value[index].hosts}
                onChange={value => this.value[index].hosts = value}
              />
              <SubTitle title={"Transport Layer Security Namespace"}/>
              <NamespaceSelect
                required autoFocus
                value={this.namespace}
                onChange={value => this.namespace = value.value}
              />
              <SubTitle title={"Transport Layer Security Secret Name"}/>
              <SecretsSelect
                required autoFocus
                value={this.value[index].secretName}
                namespace={this.namespace}
                onChange={value => this.value[index].secretName = value.value}
              />
            </Grid>
            <Grid item xs zeroMinWidth style={{textAlign: "center"}}>
              <Icon
                style={{margin: "0.8vw, 0.9vh"}}
                small
                tooltip={_i18n._(t`Remove`)}
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
  }

  render() {
    return (
      <>
        <Button primary onClick={() => this.add()}><span>Add Transport Layer Security</span></Button>
        <br/>
        {this.value.map((item, index) => {
          return this.rTLS(index);
        })}
      </>
    )
  }
}