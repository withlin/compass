import "./service-ports.scss"

import React from "react";
import { observer } from "mobx-react";
import { t } from "@lingui/macro";
import { Service, ServicePort } from "../../api/endpoints";
import { _i18n } from "../../i18n";
import { apiBase } from "../../api"
import { observable } from "mobx";
import { cssNames } from "../../utils";
import { Notifications } from "../notifications";
import { Spinner } from "../spinner"

interface Props {
  service: Service;
}

@observer
export class ServicePorts extends React.Component<Props> {
  @observable waiting = false;
  render() {
    const { service } = this.props;
    return (
      <div className={cssNames("ServicePorts", { waiting: this.waiting })}>
        {
          service.getPorts().map((port) => {
            return (
              <p key={port.toString()}>
                  {port.toString()}
              </p>
            );
          })}
      </div>
    );
  }
}
