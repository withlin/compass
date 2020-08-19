import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {Data} from "./common";
import {stopPropagation} from "../../utils";
import {Grid} from "@material-ui/core";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class ConfigMapDataDetails extends React.Component<Props> {

  // @observable value: Data[] = this.props.value || [];
  @computed get value(): Data[] {
    return  this.props.value || [];
  }

  add = () => {
    this.value.push({key: "", value: ""});
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  rData(index: number) {
    return (
      <>
        <Grid container spacing={5} direction={"row"} zeroMinWidth>
          <Grid item xs={11} direction={"row"} zeroMinWidth>
            <Grid container spacing={5} direction={"row"} zeroMinWidth>
              <Grid item xs zeroMinWidth>
                <Input
                  required={true}
                  placeholder={_i18n._(t`Key`)}
                  value={this.value[index].key}
                  onChange={value => this.value[index].key = value}
                />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Input
                  required={true}
                  multiLine={true}
                  multiple={true}
                  placeholder={_i18n._(t`Value`)}
                  value={this.value[index].value}
                  onChange={value => this.value[index].value = value}
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
              <Trans>Data</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        {this.value.map((item, index) => {
          return this.rData(index);
        })}
      </>
    )
  }
}