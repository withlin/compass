import { observable } from "mobx";
import { autobind } from "../../utils";
import { KubeObjectStore } from "../../kube-object.store";
import { injectorApi } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";
import { Injector } from "../../api/endpoints";

@autobind()
export class InjectorsStore extends KubeObjectStore<Injector> {
  api = injectorApi

  getInjector(injector: Injector) {
    return injectorStore.items.find(item =>
      item.getName() === injector.getName() &&
      item.getNs() === injector.getNs()
    )
  }

  reset() {
  }
}

export const injectorStore = new InjectorsStore();
apiManager.registerStore(injectorApi, injectorStore);
