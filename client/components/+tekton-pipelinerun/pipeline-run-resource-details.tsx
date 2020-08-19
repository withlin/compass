import { observer } from "mobx-react";
import React from "react";
import { computed, observable } from "mobx";
import { ActionMeta } from "react-select/src/types";
import { Select } from "../select";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { PipelineResourceBinding, PipelineRef } from "../../api/endpoints";
import { SubTitle } from "../layout/sub-title";
import { _i18n } from "../../i18n";
import { Input } from "../input";
import { pipelineResourceStore } from "../+tekton-pipelineresource/pipelineresource.store";
import { Grid, Paper } from "@material-ui/core";
import { stopPropagation } from "../../utils";
import { configStore } from "../../config.store";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  disable?: boolean;
  namespace?: string;

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

export const pipelineRef: PipelineRef = {
  name: "",
};

export const pipelineRunResource: PipelineResourceBinding = {
  name: "",
  resourceRef: pipelineRef,
};

@observer
export class PipelineRunResourceDetails extends React.Component<Props> {

  static defaultProps = {
    disable: false
  }
  // @observable value: PipelineResourceBinding[] = this.props.value || [];
  @observable namespace: string = this.props.namespace;

  @computed get value(): PipelineResourceBinding[] {
    return this.props.value || [];
  }

  add = () => {
    this.value.push(pipelineRunResource);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  @computed get pipelineResourceOptions() {
    return [
      ...pipelineResourceStore
        .getAllByNs(configStore.getOpsNamespace())
        .map((item) => (item.getName()))
    ];
  }

  rResource(index: number, disable: boolean) {

    return (
      <>
        <br />
        <Paper elevation={3} style={{ padding: 25 }}>
          <Grid container spacing={5} alignItems="center" direction="row">
            <Grid item xs={11} zeroMinWidth>
              <SubTitle title={"Name"} />
              <Input
                disabled={disable}
                placeholder={_i18n._("Name")}
                value={this.value[index]?.name}
                onChange={(value) => (this.value[index].name = value)}
              />
              <SubTitle title={"Resource Reference"} />
              <Select
                value={this.value[index]?.resourceRef?.name}
                options={this.pipelineResourceOptions}
                onChange={(value) => {
                  this.value[index].resourceRef.name = value.value;
                }}
              />
            </Grid>
            {!disable ?
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
              </Grid> : null}
          </Grid>
        </Paper>
      </>
    )
  }

  render() {

    const { disable } = this.props;

    return (
      <>
        <SubTitle
          title={
            <>
              <Trans>Pipeline Run Resources</Trans>
              {!disable ?
                <>
                  &nbsp;&nbsp;
                  <Icon material={"edit"} className={"editIcon"} onClick={event => {
                    stopPropagation(event);
                    this.add()
                  }} small />
                </> : null}
            </>
          }>
        </SubTitle>
        {this.value.map((item, index) => {
          return this.rResource(index, disable);
        })}
      </>
    );
  }
}
