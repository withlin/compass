import {observer} from "mobx-react";
import React from "react";
import {computed, observable} from "mobx";
import {SubTitle} from "../layout/sub-title";
import {Input} from "../input";
import {_i18n} from "../../i18n";
import {ActionMeta} from "react-select/src/types";
import {backend, Backend} from "./common";
import {ServicesSelect} from "../+network-services/services-select";
import {NamespaceSelect} from "../+namespaces/namespace-select";
import {Trans} from "@lingui/macro";

interface Props<T = any> extends Partial<Props> {
  value?: T;
  themeName?: "dark" | "light" | "outlined";

  onChange?(value: T, meta?: ActionMeta<any>): void;
}

@observer
export class BackendDetails extends React.Component<Props> {

  static defaultProps = {
    value: backend
  }
  // @observable value: Backend = this.props.value || backend;
  @observable namespace: string = "";
  @computed get value(): Backend{
    return this.props.value || backend;
  }

  render() {
    return (
      <>
        <SubTitle title={<Trans>Service Namespace</Trans>}/>
        <NamespaceSelect
          required autoFocus
          value={this.namespace}
          onChange={value => this.namespace = value.value}
        />
        <SubTitle title={<Trans>Backend Service Name</Trans>}/>
        <ServicesSelect
          value={this.value.serviceName}
          namespace={this.namespace}
          onChange={value => this.value.serviceName = value.value}
        />
        <SubTitle title={<Trans>Backend Service Port</Trans>}/>
        <Input
          value={String(this.value.servicePort)}          
          onChange={value => this.value.servicePort = Number(value)}
        />
      </>
    )
  }
}