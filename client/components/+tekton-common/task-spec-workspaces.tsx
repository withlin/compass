import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {WorkspaceDeclaration as Workspace} from "../../api/endpoints/tekton-task.api";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {_i18n} from "../../i18n";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

export const workspaces: Workspace = {
  name: "",
  description: "",
  mountPath: "",
  readOnly: false,
};

@observer
export class TaskSpecWorkSpaces extends React.Component<Props> {

  // @observable value: Workspace[] = this.props.value || [];
  @computed get value(): Workspace[] {
    return this.props.value || [];
  }

  get typeOptions() {
    return ["true", "false"];
  }

  add = () => {
    this.value.push(workspaces);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  rWorkSpace(index: number) {
    return (
      <>
        <Grid container spacing={5} direction={"row"} zeroMinWidth>
          <Grid item xs={11} direction={"row"} zeroMinWidth>
            <Grid container spacing={1} direction={"row"} zeroMinWidth>
              <Grid item xs zeroMinWidth>
                <Input
                  placeholder={"Name"}
                  value={this.value[index].name}
                  onChange={(value) => (this.value[index].name = value)}
                />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Input
                  placeholder={"MountPath"}
                  value={this.value[index].mountPath}
                  onChange={(value) =>
                    (this.value[index].mountPath = value)
                  }
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
              <Trans>WorkSpaces</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} small/>
            </>
          }>
        </SubTitle>
        {this.value.map((item: any, index: number) => {
          return this.rWorkSpace(index);
        })}
      </>
    );
  }

}
