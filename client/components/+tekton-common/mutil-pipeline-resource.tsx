import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {PipelineTaskInputResourceDetail} from "./pipeline-task-resources-details";
import {TaskResources} from "../../api/endpoints";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  divider?: boolean;
  disable?: boolean;

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

export const defaultTaskResources: TaskResources = {
  inputs: [],
  outputs: [],
};

@observer
export class MutilPipelineResource extends React.Component<Props> {

  static defaultProps = {
    divider: true,
    disable: true
  }

  // @observable value: TaskResources = this.props.value || defaultTaskResources;
  @computed get value(): TaskResources {
    return this.props.value || defaultTaskResources;
  }

  render() {

    const {disable} = this.props;

    return (
      <div>
        <PipelineTaskInputResourceDetail
          disable={disable}
          value={this.value.inputs}
          title={"Resource Inputs"}
          onChange={(value) => {
            this.value.inputs = value;
          }}
        />
        <br/>
        <PipelineTaskInputResourceDetail
          disable={disable}
          value={this.value.outputs}
          title={"Resource Outputs"}
          onChange={(value) => {
            this.value.outputs = value;
          }}
        />
      </div>
    );
  }
}
