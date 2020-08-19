import { observer } from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import { ActionMeta } from "react-select/src/types";
import { TaskResourceDetails } from "./task-resource-details";
import {TaskResources} from "../../api/endpoints";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: true;

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class ResourcesDetail extends React.Component<Props> {

  // @observable value: TaskResources = this.props.value || { inputs: [], outputs: [] };
  @computed get value(): TaskResources {
    return this.props.value || { inputs: [], outputs: [] };
  }

  render() {
    return (
      <>
        <TaskResourceDetails
          value={this.value.inputs}
          title={"Resource Inputs"}
          onChange={(value) => {
            this.value.inputs = value;
          }}
        />
        <br/>
        <TaskResourceDetails
          value={this.value.outputs}
          title={"Resource Outputs"}
          onChange={(value) => {
            this.value.outputs = value;
          }}
        />
      </>
    );
  }
}
