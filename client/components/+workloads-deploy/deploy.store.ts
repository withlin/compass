import {autobind} from "../../utils";
import {KubeObjectStore} from "../../kube-object.store";
import {deployApi} from "../../api/endpoints";
import {apiManager} from "../../api/api-manager";
import {Deploy} from "../../api/endpoints";

@autobind()
export class DeployStore extends KubeObjectStore<Deploy> {
  api = deployApi

  getInjector(deploy: Deploy) {
    return deployStore.items.find(item =>
      item.getName() === deploy.getName() &&
      item.getNs() === deploy.getNs()
    )
  }

  reset() {
  }
}

export const deployStore = new DeployStore();
apiManager.registerStore(deployApi, deployStore);
