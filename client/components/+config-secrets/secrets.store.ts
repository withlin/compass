import { KubeObjectStore } from "../../kube-object.store";
import { autobind } from "../../utils";
import { Secret, opsSecretsApi,secretsApi } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";

@autobind()
export class SecretsStore extends KubeObjectStore<Secret> {
  api = secretsApi
}

export const secretsStore = new SecretsStore();
apiManager.registerStore(secretsApi, secretsStore);



@autobind()
export class OpsSecretsStore extends KubeObjectStore<Secret> {
  api = opsSecretsApi
}

export const opsSecretsStore = new OpsSecretsStore();
apiManager.registerStore(opsSecretsApi, opsSecretsStore);