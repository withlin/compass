import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {ActionMeta} from "react-select/src/types";
import {Rule, rule} from "./common";
import {Input} from "../input";
import {PathsDetails} from "./paths-details";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class RuleDetails extends React.Component<Props> {

  // @observable value: Rule = this.props.value || rule
  @computed get value(): Rule {
    return this.props.value || rule;
  }

  render() {
    return (
      <>
        <SubTitle title={"Host"}/>
        <Input
          required={true}
          value={this.value.host}
          onChange={value => this.value.host = value}
        />
        <PathsDetails
          value={this.value.http.paths}
          onChange={value => this.value.http.paths = value}
        />
      </>
    )
  }
}