import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {computed, observable} from "mobx";
import {envVar, EnvVar} from "./common";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface EvnVarProps<T = any> extends Partial<EvnVarProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class EvnVarDetails extends React.Component<EvnVarProps> {

  // @observable value: EnvVar[] = this.props.value || [];
  @computed get value(): EnvVar[] {
    return this.props.value || [];
  }

  add = () => {
    this.value.push(envVar);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  rEnv(index: number) {
    return (
      <>
        <Grid container spacing={5} direction={"row"} zeroMinWidth>
          <Grid item xs={11} direction={"row"} zeroMinWidth>
            <Grid container spacing={5} direction={"row"} zeroMinWidth>
              <Grid item xs zeroMinWidth>
                <Input
                  className="item"
                  placeholder={_i18n._(t`Name`)}
                  title={this.value[index].name}
                  value={this.value[index].name}
                  onChange={(value) => {
                    this.value[index].name = value;
                  }}
                />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Input
                  className="item"
                  placeholder={_i18n._(t`Value`)}
                  title={this.value[index].value}
                  value={this.value[index].value}
                  onChange={(value) => {
                    this.value[index].value = value;
                  }}
                />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs zeroMinWidth>
            <Icon
              small
              tooltip={_i18n._(t`Remove`)}
              className="remove-icon"
              material="clear"
              onClick={(event) => {
                this.remove(index);
                stopPropagation(event)
              }}
            />
          </Grid>
        </Grid>
      </>
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
        {this.value.map((item: any, index: number) => {
          return this.rEnv(index);
        })}
      </>
    );
  }
}
