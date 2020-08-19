import {Secrets} from "../+config-secrets";
import { observable } from "mobx";

export class OpsSecrets extends Secrets  {
  @observable className = "OpsSecrets"
}

