import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { destinationRuleApi, DestinationRule } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class DestinationRuleStore extends KubeObjectStore<DestinationRule> {
  api = destinationRuleApi;
}

export const destinationRuleStore = new DestinationRuleStore();
apiManager.registerStore(destinationRuleApi, destinationRuleStore);
