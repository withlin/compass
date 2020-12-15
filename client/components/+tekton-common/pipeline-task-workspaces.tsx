import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {Trans} from "@lingui/macro";
import {WorkspacePipelineTaskBinding} from "../../api/endpoints";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

export const workspacePipelineTaskBinding: WorkspacePipelineTaskBinding = {
  name: "",
  workspace: "",
};

@observer
export class PipelineTaskWorkSpaces extends React.Component<Props> {

  // @observable value: WorkspacePipelineTaskBinding[] = this.props.value || [];
  @computed get value(): WorkspacePipelineTaskBinding[] {
    return this.props.value || [];
  }

  add = () => {
    this.value.push(workspacePipelineTaskBinding);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  render() {
    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>WorkSpaces</Trans>
              &nbsp;&nbsp;
              <Icon
                material="add_circle"
                className="add_circle"
                onClick={event => {
                  stopPropagation(event);
                  this.add()
                }}
              />
            </>
          }>
        </SubTitle>
        {this.value.map((item: any, index: number) => {
          return (
            <div>
              <div key={index}>
                <Grid container spacing={5} alignItems="center" direction="row">
                  <Grid item xs={5} zeroMinWidth>
                    <Input
                      placeholder={"Name"}
                      value={this.value[index].name}
                      onChange={(value) => (this.value[index].name = value)}
                    />
                  </Grid>
                  <Grid item xs={5} zeroMinWidth>
                    <Input
                      placeholder={"workspace"}
                      value={this.value[index].workspace}
                      onChange={(value) =>
                        (this.value[index].workspace = value)
                      }
                    />
                  </Grid>
                  <Grid item xs zeroMinWidth>
                    <Icon
                      small
                      tooltip={<Trans>Remove</Trans>}
                      className="remove-icon"
                      material="clear"
                      onClick={(e) => {
                        this.remove(index);
                        e.stopPropagation();
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
              <br/>
            </div>
          );
        })}
      </>
    );
  }
}
