import {observer} from "mobx-react";
import React from "react";
import {observable} from "mobx";
import {createMuiTheme, Grid, Paper, ThemeProvider} from "@material-ui/core";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {t, Trans} from "@lingui/macro";
import {Icon} from "../icon";
import {stopPropagation} from "../../utils";
import {SubTitle} from "../layout/sub-title";
import {ActionMeta} from "react-select/src/types";
import {PipelineRunSelect} from "../+tekton-pipelinerun/pipelinerun-select";
import {Job, job} from "../../api/endpoints/tekton-webhook.api";
import {configStore} from "../../config.store";
import {pipelineRunStore} from "../+tekton-pipelinerun/pipelinerun.store";
import {ParamsDetails} from "../+tekton-common";

const theme = createMuiTheme({
  overrides: {
    MuiExpansionPanelDetails: {
      root: {
        display: "gird",
      },
    },
    MuiPaper: {
      root: {
        color: "",
      },
    },
  },
});

interface JobProps<T = any> extends Partial<JobProps> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class JobDetails extends React.Component<JobProps> {

  @observable value: Job[] = this.props.value || [];

  add = () => {
    this.value.push(job);
  }

  remove = (index: number) => {
    this.value.splice(index, 1);
  }

  get options(): string[] {
    let options: string[];
    if (configStore.getOpsNamespace() != '') {
      try {
        let items = pipelineRunStore.items.filter(item => item.getNs() == configStore.getOpsNamespace());
        options = items.map(item => item.getName());
      } catch (err) {
        options = [];
      }
    } else {
      options = [];
    }
    return options;
  }

  rJobs(index: number) {

    if (this.value[index].params == undefined) {
      this.value[index].params = [];
    }

    return (
      <>
        <br/>
        <Paper elevation={3} style={{padding: 25}}>
          <Grid container spacing={5} alignItems={"center"} direction={"row"}>
            <Grid item xs={11} zeroMinWidth>
              <SubTitle title={<Trans>Branch</Trans>}/>
              <Input
                placeholder={_i18n._(t`Branch`)}
                value={this.value[index].branch}
                onChange={value => this.value[index].branch = value}
              />
              <SubTitle title={<Trans>PipelineRun</Trans>}/>
              <PipelineRunSelect
                value={this.value[index].pipeline_run}
                options={this.options}
                onChange={value => this.value[index].pipeline_run = value.value}/>
              <ParamsDetails value={this.value[index].params} onChange={value => this.value[index].params = value}/>
            </Grid>
            <Grid item xs zeroMinWidth>
              <Icon
                small
                tooltip={_i18n._(t`Remove`)}
                className="remove-icon"
                material="clear"
                ripple="secondary"
                onClick={(event) => {
                  this.remove(index);
                  stopPropagation(event);
                }}
              />
            </Grid>
          </Grid>
        </Paper>
      </>
    )
  }

  render() {

    return (
      <ThemeProvider theme={theme}>
        <SubTitle
          title={
            <>
              <Trans>Job</Trans>
              &nbsp;&nbsp;
              <Icon material={"add_circle"} className={"add_circle"} onClick={event => {
                stopPropagation(event);
                this.add()
              }} />
            </>
          }>
        </SubTitle>
        {
          this.value?.map((item: any, index: number) => {
            return this.rJobs(index)
          })
        }
      </ThemeProvider>
    )
  }
}