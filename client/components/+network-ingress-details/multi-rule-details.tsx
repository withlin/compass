import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Collapse} from "../collapse";
import {Button} from "../button";
import {RuleDetails} from "./rule-details";
import {Rule, rule} from "./common";
import {_i18n} from "../../i18n";
import {Trans} from "@lingui/macro";
import {Icon} from "../icon";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class MultiRuleDetails extends React.Component<Props> {

  // @observable value: Rule[] = this.props.value || [];
  @computed get value(): Rule[] {
    return this.props.value || [];
  }

  add() {
    this.value.push(rule)
  }

  remove = (index: number) => {
    this.value.splice(index, 1)
  }

  render() {

    const genExtra = (index: number) => {
      return (
        <Icon
          material={"delete_outline"}
          style={{color: '#ff4d4f'}}
          onClick={(event) => {
            this.remove(index);
            event.preventDefault();
            event.stopPropagation();
          }}
        />
      );
    }

    return (
      <div>
        <Button primary onClick={() => this.add()}><span>{_i18n._("Add Rule")}</span></Button>
        <br/>
        <br/>
        {this.value.length > 0 ?
          this.value.map((item, index) => {
            return (
              <Collapse panelName={<Trans>Rule</Trans>} extraExpand={genExtra(index)} key={"rule" + index}>
                <RuleDetails value={this.value[index]} onChange={value => this.value[index] = value}/>
              </Collapse>
            );
          }) : null
        }
      </div>
    )
  }
}