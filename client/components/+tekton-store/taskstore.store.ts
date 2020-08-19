import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { tektonStoreApi, TektonStore } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class TaskStoreStore extends KubeObjectStore<TektonStore> {
  api = tektonStoreApi;
}

export const tektonStore = new TaskStoreStore();
apiManager.registerStore(tektonStoreApi, tektonStore);
