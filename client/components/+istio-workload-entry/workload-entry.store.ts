import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { workloadEntryApi, WorkloadEntry } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class WorkloadEntryStore extends KubeObjectStore<WorkloadEntry> {
  api = workloadEntryApi;
}

export const workloadEntryStore = new WorkloadEntryStore();
apiManager.registerStore(workloadEntryApi, workloadEntryStore);
