import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {PipelineTaskInputResource} from "../../api/endpoints";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";
  title?: string;
  disable?: boolean;

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

export const pipelineTaskInputResource: PipelineTaskInputResource = {
  name: "",
  resource: "",
};

@observer
export class PipelineTaskInputResourceDetail extends React.Component<Props> {

  static defaultProps = {
    title: "Pipeline Resources",
    disable: false
  };

  // @observable value: PipelineTaskInputResource[] = this.props.value || [];
  @computed get value(): PipelineTaskInputResource[] {
    return this.props.value || [];
  }

  add = () => {
    this.value.push(pipelineTaskInputResource);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  rTab() {
    return (
      <>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs={5} zeroMinWidth>
            <Trans>Name</Trans>
          </Grid>
          <Grid item xs={5} zeroMinWidth>
            <Trans>Resource</Trans>
          </Grid>
        </Grid>
        <br/>
      </>
    )
  }

  rForm(index: number, disable: boolean) {
    return (
      <>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs={5} zeroMinWidth>
            <Input
              placeholder={_i18n._(t`Name`)}
              disabled={true}
              value={this.value[index].name}
              onChange={(value) => {
                this.value[index].name = value;

              }}
            />
          </Grid>
          <Grid item xs={5} zeroMinWidth>
            <Input
              placeholder={_i18n._(t`Value`)}
              value={this.value[index].resource}
              onChange={(value) => {
                this.value[index].resource = value;
                console.log(this.value[index].resource);
              }}
            />
          </Grid>
          {!disable ?? <Grid item xs zeroMinWidth>
            <Icon
              small
              material="clear"
              onClick={(e) => {
                this.remove(index);
                e.stopPropagation();
              }}
            />
          </Grid>}
        </Grid>
        <br/>
      </>
    )
  }

  render() {
    const {title, disable} = this.props;
    return (
      <>
        <SubTitle
          title={
            <>
              {title}
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
        {this.value.length > 0 ? this.rTab() : null}
        {this.value.map((item: any, index: number) => {
          return this.rForm(index, disable)
        })}
      </>
    );
  }
}