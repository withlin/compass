import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { pipelineRunApi, PipelineRun } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";
import { tektonGraphStore } from "../+tekton-graph/tekton-graph.store";
import { initData } from "../+tekton-graph/graphs";
import { taskRunStore } from "../+tekton-taskrun";

@autobind()
export class PipelineRunStore extends KubeObjectStore<PipelineRun> {
  api = pipelineRunApi;

  getTaskRunName(pipelineRun: PipelineRun): string[] {
    if (pipelineRun?.status == undefined) {
      return [];
    }
    if (pipelineRun?.status?.taskRuns == undefined) {
      return [];
    }
    return (
      Object.keys(pipelineRun?.status?.taskRuns)
      .map((item: any) => {
        return item;
      })
      .slice() || []
    );
  }

  getTaskRun(names: string[]): any {
    let taskMap: any = new Map<string, any>();
    names.map((name: string) => {
      const currentTask = taskRunStore.getByName(name);
      if (currentTask?.spec !== undefined) {
        taskMap[currentTask.spec.taskRef.name] = currentTask;
      }
    });

    return taskMap;
  }

  getNodeData(pipelineRun: PipelineRun) {
    let graphName: string = "";
    pipelineRun.getAnnotations().filter((item) => {
      const R = item.split("=");
      if (R[0] == "fuxi.nip.io/run-tektongraphs") {
        graphName = R[1];
      }
    });

    if (graphName) {
      try {
        return JSON.parse(tektonGraphStore.getByName(graphName).spec.data);
      } catch (e) {
        return initData;
      }
    }
    return initData;
  }

  getNodeSize(pipelineRun: PipelineRun) {
    let graphName: string = "";
    pipelineRun.getAnnotations().filter((item) => {
      const R = item.split("=");
      if (R[0] == "fuxi.nip.io/run-tektongraphs") {
        graphName = R[1];
      }
    });

    if (graphName) {
      try {
        const tektonGraph = tektonGraphStore.getByName(graphName)
        return { width: tektonGraph.spec?.width, height: tektonGraph.spec?.height }
      } catch (e) {
        return null;
      }
    }
    return null;
  }

}

export const pipelineRunStore = new PipelineRunStore();
apiManager.registerStore(pipelineRunApi, pipelineRunStore);
