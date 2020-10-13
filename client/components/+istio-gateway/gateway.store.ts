import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { gateWayApi, Gateway } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class GatewayStore extends KubeObjectStore<Gateway> {
  api = gateWayApi;
}

export const gatewayStore = new GatewayStore();
apiManager.registerStore(gateWayApi, gatewayStore);
