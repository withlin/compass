import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {Input} from "../input";
import {ActionMeta} from "react-select/src/types";
import {SubTitle} from "../layout/sub-title";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {WorkspaceBinding} from "../../api/endpoints";
import {PersistentVolumeClaimVolumeSource} from "../../api/endpoints";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  disable?: boolean

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

export const pvc: PersistentVolumeClaimVolumeSource = {
  claimName: "",
  readOnly: false,
};

export const workspaceBinding: WorkspaceBinding = {
  name: "",
  subPath: "",
  persistentVolumeClaim: pvc,
};

@observer
export class PipelineRunWorkspaces extends React.Component<Props> {

  static defaultProps = {
    disable: false
  }

  // @observable value: WorkspaceBinding[] = this.props.value || [];
  @computed get value(): WorkspaceBinding[] {
    return this.props.value || [];
  }

  add = () => {
    this.value.push(workspaceBinding);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  rWorkspaces(index: number) {
    return (
      <>
        <br/>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs={3} zeroMinWidth>
            <Input
              placeholder={"Name"}
              value={this.value[index].name}
              onChange={(value) => (this.value[index].name = value)}
            />
          </Grid>
          <Grid item xs={4} zeroMinWidth>
            <Input
              placeholder={"SubPath"}
              value={this.value[index].subPath}
              onChange={(value) =>
                (this.value[index].subPath = value)
              }
            />
          </Grid>
          <Grid item xs={4} zeroMinWidth>
            <Input
              placeholder={"PersistentVolumeClaimName"}
              value={
                this.value[index].persistentVolumeClaim.claimName
              }
              onChange={(value) =>
                (this.value[
                  index
                  ].persistentVolumeClaim.claimName = value)
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
      </>
    )
  }

  render() {

    const {disable} = this.props;

    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>WorkSpaces</Trans>
              {!disable ?
                <>
                  &nbsp;&nbsp;
                  <Icon material={"edit"} className={"editIcon"} onClick={event => {
                    stopPropagation(event);
                    this.add()
                  }} small/>
                </> : null}
            </>
          }>
        </SubTitle>
        {this.value.map((item: any, index: number) => {
          return this.rWorkspaces(index);
        })}
      </>
    );
  }
}
