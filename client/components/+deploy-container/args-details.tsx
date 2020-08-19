import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {computed, observable, toJS} from "mobx";
import {args} from "./common";
import {Grid} from "@material-ui/core";
import {autobind, stopPropagation} from "../../utils";

interface ArgsProps<T = any> extends Partial<ArgsProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T): void;
}

@observer
export class ArgsDetails extends React.Component<ArgsProps> {

  @computed get value(): string[] {
    return this.props.value || args;
  }

  add = () => {
    this.props.value.push("");
  }

  remove = (index: number) => {
    this.props.value.splice(index, 1);
  }

  render() {

    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>Arguments</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                this.add();
                stopPropagation(event);
              }} small/>
            </>
          }>
        </SubTitle>
        {this.value.map((item: any, index: number) => {
          return (
            <Grid container spacing={5} alignItems={"center"} direction={"row"}>
              <Grid item xs={11} zeroMinWidth>
                <Input
                  className="item"
                  placeholder={_i18n._(t`Arguments`)}
                  title={this.value[index]}
                  value={this.value[index]}
                  onChange={value => {
                    this.value[index] = value
                  }}
                />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Icon
                  small
                  tooltip={_i18n._(t`Remove`)}
                  className="remove-icon"
                  material="clear"
                  onClick={(event) => {
                    this.remove(index);
                  }}
                />
              </Grid>
            </Grid>
          )
        })}
      </>
    )
  }
}