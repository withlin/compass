import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { serviceEntryApi, ServiceEntry } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class ServiceEntryStore extends KubeObjectStore<ServiceEntry> {
  api = serviceEntryApi;
}

export const serviceEntryStore = new ServiceEntryStore();
apiManager.registerStore(serviceEntryApi, serviceEntryStore);
