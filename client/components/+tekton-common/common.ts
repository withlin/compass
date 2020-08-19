import { EnvVar } from "../+deploy-container";
import { TaskResources } from "../../api/endpoints/tekton-task.api";

export interface PipelineParams {
  name: string;
  type?: string;
  description?: string;
  default?: string;
}

export interface PipelineResources {
  name: string;
  type: string;
}

export interface TaskStep {
  name: string;
  image: string;
  args: string[];
  command: string[];
  env: EnvVar[];
  // workspaces: Workspace[];
  workingDir: string;
  // results: Result[];
  script: string;
}

export interface Workspace {
  name: string;
  description: string;
  mountPath: string;
}

export interface VolumeMount {
  name: string;
  mountPath: string;
}

export interface Result {
  name: string;
  description: string;
}

export interface Params {
  name: string;
  value: string;
}

export interface ResourceDeclaration {
  // Name declares the name by which a resource is referenced in the
  // definition. Resources may be referenced by name in the definition of a
  // Task's steps.
  name: string;
  // Type is the type of this resource;
  type: string;
  // Description is a user-facing description of the declared resource that may be
  // used to populate a UI.
  // +optional
  description?: string;
  // TargetPath is the path in workspace directory where the resource
  // will be copied.
  // +optional
  targetPath?: string;
  // Optional declares the resource as optional.
  // By default optional is set to false which makes a resource required.
  // optional: true - the resource is considered optional
  // optional: false - the resource is considered required (equivalent of not specifying it)
  optional?: boolean;
}

export const resources: TaskResources = {
  inputs: [],
  outputs: [],
};

export const taskResources: ResourceDeclaration = {
  name: "",
  type: "",
  description: "",
  targetPath: "",
};

export const pipelineParams: PipelineParams = {
  name: "",
  type: "",
  description: "",
  default: "",
};

export const pipelineResources: PipelineResources = {
  name: "",
  type: "",
};

export const taskStep: TaskStep = {
  name: "",
  image: "",
  args: [],
  command: [],
  env: [],
  // workspaces: [],
  workingDir: "",
  // results: [],
  script: "",
};

export const workspace: Workspace = {
  name: "",
  description: "",
  mountPath: "",
};

export const volumeMount: VolumeMount = {
  name: "",
  mountPath: "",
};

export const result: Result = {
  name: "",
  description: "",
};

export const params: Params = {
  name: "",
  value: "",
};
