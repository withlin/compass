import {autobind} from "../../utils";
import {KubeObjectStore} from "../../kube-object.store";
import {TektonWebHook, tektonWebHookApi} from "../../api/endpoints/tekton-webhook.api";
import {apiManager} from "../../api/api-manager";

@autobind()
export class TektonWebHookStore extends KubeObjectStore<TektonWebHook> {
  api = tektonWebHookApi;
}

export const tektonWebHookStore = new TektonWebHookStore();
apiManager.registerStore(tektonWebHookApi, tektonWebHookStore);