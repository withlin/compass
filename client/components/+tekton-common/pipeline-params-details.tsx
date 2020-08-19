import {observer} from "mobx-react";
import React from "react";
import {computed, observable, toJS} from "mobx";
import {ActionMeta} from "react-select/src/types";
import {Icon} from "../icon";
import {t, Trans} from "@lingui/macro";
import {Input} from "../input";
import {PipelineParams, pipelineParams} from "./common";
import {SubTitle} from "../layout/sub-title";
import {_i18n} from "../../i18n";
import {Select} from "../select";
import {Grid} from "@material-ui/core";
import {stopPropagation} from "../../utils";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  titleDisplay?: boolean
  disable?: boolean;

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class PipelineParamsDetails extends React.Component<Props> {

  static defaultProps = {
    titleDisplay: true,
    disable: false,
  }

  // @observable value: PipelineParams[] = this.props.value || [];
  @computed get value(): PipelineParams[] {
    return this.props.value || [];
  }

  get Options() {
    return [
      "string",
      "array"
    ];
  }

  add = () => {
    this.value.push(pipelineParams);
  };

  remove = (index: number) => {
    this.value.splice(index, 1);
  };

  rTab() {
    return (
      <>
        <br/>
        <Grid container spacing={5} direction="row">
          <Grid item xs={11} direction={"row"} zeroMinWidth>
            <Grid container spacing={5} direction={"row"} zeroMinWidth>
              <Grid item xs zeroMinWidth>
                <Trans>Name</Trans>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Trans>Type</Trans>
              </Grid>
              <Grid item xs zeroMinWidth>
                <Trans>Default</Trans>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs zeroMinWidth/>
        </Grid>
        <br/>
      </>
    )
  }

  rForm(index: number, disable: boolean) {
    return (
      <>
        <Grid container spacing={5} alignItems="center" direction="row">
          <Grid item xs={11} direction={"row"} zeroMinWidth>
            <Grid container spacing={5} direction={"row"} zeroMinWidth>
              <Grid item xs zeroMinWidth>
                <Input
                  disabled={disable}
                  value={this.value[index].name}
                  onChange={(value) => (this.value[index].name = value)}
                />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Select
                  isDisabled={disable}
                  value={this.value[index].type}
                  options={this.Options}
                  onChange={(value) => {
                    let result = toJS(value);
                    this.value[index].type = result.value;
                  }}
                />
              </Grid>
              <Grid item xs zeroMinWidth>
                <Input
                  disabled={disable}
                  value={this.value[index].default}
                  onChange={(value) => (this.value[index].default = value)}
                />
              </Grid>
            </Grid>
          </Grid>
          {!disable ?
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
            </Grid> : null}
        </Grid>
        <br/>
      </>
    )
  }

  render() {
    const {titleDisplay, disable} = this.props;
    return (
      <div className="params">
        <SubTitle className="fields-title" title={
          <>
            {titleDisplay ? <Trans>Pipeline Params</Trans> : ""}
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
          return this.rForm(index, disable);
        })}
      </div>
    );
  }
}
