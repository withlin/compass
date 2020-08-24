import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { pipelineResourceApi, PipelineResource } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class PipelineResourceStore extends KubeObjectStore<PipelineResource> {
  api = pipelineResourceApi;

  getStatuses(PipelineResources: PipelineResource[]) {
    const status = {
      sum: PipelineResources.length,
    };
    return status;
  }
}

export const pipelineResourceStore = new PipelineResourceStore();
apiManager.registerStore(pipelineResourceApi, pipelineResourceStore);
