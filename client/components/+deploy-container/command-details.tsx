import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {computed, observable} from "mobx";
import {commands} from "./common";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class CommandDetails extends React.Component<Props> {

  // @observable value: string[] = commands;
  @computed get value(): string[] {
    return this.props.value || commands;
  }

  add = () => {
    this.value.push("");
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  rCommand(index: number) {
    return (
      <>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs={11} zeroMinWidth>
            <Input
              className="item"
              placeholder={_i18n._(t`Command`)}
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
                stopPropagation(event)
              }}
            />
          </Grid>
        </Grid>
        <br/>
      </>
    )
  }

  render() {

    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>Command</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        {this.value.map((item: any, index: number) => {
          return this.rCommand(index);
        })}
      </>
    )
  }

}
