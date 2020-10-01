import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { virtualServiceApi, VirtualService } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class VirtualServiceStore extends KubeObjectStore<VirtualService> {
  api = virtualServiceApi;
}

export const virtualServiceStore = new VirtualServiceStore();
apiManager.registerStore(virtualServiceApi, virtualServiceStore);
