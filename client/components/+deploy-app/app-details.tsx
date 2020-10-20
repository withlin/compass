import {ActionMeta} from "react-select/src/types";
import {observer} from "mobx-react";
import React from "react";
import {SubTitle} from "../layout/sub-title";
import {t, Trans} from "@lingui/macro";
import {Select, SelectOption} from "../select";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {Icon} from "../icon";
import {computed, observable} from "mobx";
import {app, App} from "./common";
import {systemName} from "../input/input.validators";

interface Props<T = any> extends Partial<Props> {
  showIcons?: boolean;
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class AppDetails extends React.Component<Props> {

  // @observable value: App = this.props.value || app;
  @computed get value(): App {
    return this.props.value || app;
  }

  get typeOptions() {
    return [
      "Stone",
      // "Water",
      // "Deployment",
      // "Statefulset"
    ]
  }

  render() {
    return (
      <>
        <SubTitle title={<Trans>App Type 2121</Trans>}/>
        <Select
          options={this.typeOptions}
          value={this.value.type}
          onChange={v => this.value.type = v.value}
        />
        <SubTitle title={<Trans>App Name</Trans>}/>
        <Input
          autoFocus required
          validators={systemName}
          placeholder={_i18n._(t`Name`)}
          value={this.value.name}
          onChange={v => this.value.name = v}
        />
      </>
    )
  }
}