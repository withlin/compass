import "./config-task-dialog.scss";

import {observer} from "mobx-react";
import React from "react";
import {
  PipelineParams,
  TaskStep,
  taskStep,
  resources, TaskSpecWorkSpaces, PipelineParamsDetails, ResourcesDetail, MultiTaskStepDetails,
} from "../+tekton-common";
import {computed, observable, toJS} from "mobx";
import {Dialog} from "../dialog";
import {Wizard, WizardStep} from "../wizard";
import {Trans} from "@lingui/macro";
import {taskStore} from "./task.store";
import {TaskResources, Task} from "../../api/endpoints";
import {Notifications} from "../notifications";
import {WorkspaceDeclaration as Workspace} from "../../api/endpoints/tekton-task.api";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {systemName} from "../input/input.validators";
import {_i18n} from "../../i18n";
import {Collapse} from "../collapse";

interface Props<T = any> extends Partial<Props> {
  themeName?: "dark" | "light" | "outlined";
}

class Volume {
  name: string;
  emptyDir: any;
}

export interface TaskResult {
  taskName: string;
  pipelineParams: PipelineParams[];
  resources: TaskResources;
  taskSteps: TaskStep[];
  volumes?: Volume[];
  workspace?: Workspace[];
}

export const task: TaskResult = {
  taskName: "",
  pipelineParams: [],
  resources: resources,
  taskSteps: [taskStep],
  volumes: [],
  workspace: [],
};

@observer
export class ConfigTaskDialog extends React.Component<Props> {
  @observable value: TaskResult = task;
  @observable static isOpen = false;
  @observable static Data: Task = null;
  @observable static data: any;
  @observable name: string;
  @observable change: boolean;

  static open(task: Task) {
    ConfigTaskDialog.isOpen = true;
    ConfigTaskDialog.Data = task;
  }

  get task() {
    return ConfigTaskDialog.Data;
  }


  onOpen = async () => {
    this.value.taskName = this.task.metadata.name;
    this.value.resources = this.task.getResources();
    this.value.taskSteps = this.task.getSteps();
    this.value.workspace = this.task.getWorkspaces();
    this.value.volumes = this.task.getVolumes();
    this.value.pipelineParams = this.task.getParams();

  };

  static close() {
    ConfigTaskDialog.isOpen = false;
  }

  reset = async () => {
    this.value = task;
  }

  close = async () => {
    ConfigTaskDialog.close();
    await this.reset();
  };

  saveTask = async () => {
    const parms = toJS(this.value.pipelineParams);
    const resources = toJS(this.value.resources);
    const steps = toJS(this.value.taskSteps);
    const workspaces = toJS(this.value.workspace);
    const volumes = [{name: "build-path", emptyDir: {},}];

    try {
      this.task.metadata.name = this.value.taskName;
      this.task.spec.params = parms;
      this.task.spec.resources = resources;
      this.task.spec.workspaces = workspaces;
      this.task.spec.steps = steps;

      await taskStore.update(this.task, {...this.task});
      Notifications.ok(<>Task {this.value.taskName} save succeeded</>);
      await this.close();
    } catch (err) {
      Notifications.error(err);
    }
  };

  render() {
    const header = (<h5><Trans>Config Task</Trans></h5>);

    return (
      <Dialog
        isOpen={ConfigTaskDialog.isOpen}
        className="ConfigTaskDialog"
        onOpen={this.onOpen}
        close={this.close}
        pinned
      >
        <Wizard header={header} done={this.close}>
          <WizardStep contentClass="flex gaps column" next={this.saveTask}>
            <SubTitle title={<Trans>Task Name</Trans>}/>
            <Input
              required={true}
              validators={systemName}
              placeholder={_i18n._("Task Name")}
              value={this.value.taskName}
              onChange={(value) => (this.value.taskName = value)}
            />
            <br/>
            <TaskSpecWorkSpaces
              value={this.value.workspace}
              onChange={(value) => {
                this.value.workspace = value
              }}
            />
            <br/>
            <PipelineParamsDetails
              value={this.value.pipelineParams}
              onChange={(value) => {
                this.value.pipelineParams = value
              }}
            />
            <br/>
            <ResourcesDetail
              value={this.value.resources}
              onChange={(value) => {
                this.value.resources = value
              }}
            />
            <br/>
            <Collapse panelName={<Trans>TaskStep</Trans>} key={"TaskStep"}>
              <MultiTaskStepDetails
                value={this.value.taskSteps}
                onChange={(value) => {
                  this.value.taskSteps = value
                }}
              />
            </Collapse>
          </WizardStep>
        </Wizard>
      </Dialog>
    );
  }
}
