import "./injector-details.scss";

import React from "react";
import { disposeOnUnmount, observer } from "mobx-react";
import { reaction } from "mobx";
import { Trans } from "@lingui/macro";
import { DrawerItem } from "../drawer";
import { injectorStore } from "./injectors.store";
import { KubeObjectDetailsProps } from "../kube-object";
import { injectorApi, Injector } from "../../api/endpoints";
import { apiManager } from "../../api/api-manager";
// import { stoneStore} from "../+workloads-stones"

interface Props extends KubeObjectDetailsProps<Injector> {
}

@observer
export class InjectorDetails extends React.Component<Props> {
  @disposeOnUnmount
  clean = reaction(() => this.props.object, () => {
    injectorStore.reset();
  });

  componentDidMount() {
  }

  componentWillUnmount() {
    injectorStore.reset();
  }

  render() {
    const { object: injector } = this.props;
    if (!injector) return null
    const ownerRef = injector.getOwnerRefs()[0];
    return (
      <div className="InjectorDetails">
        <DrawerItem name={<Trans>Owner Type</Trans>}>
          {
            <>{ownerRef.kind}</>
          }
        </DrawerItem>

        <DrawerItem name={<Trans>Owner</Trans>}>
          {
            <>{ownerRef.namespace} / {ownerRef.name}</>

          }
        </DrawerItem>
      </div>
    )
  }
}

apiManager.registerViews(injectorApi, {
  Details: InjectorDetails
})