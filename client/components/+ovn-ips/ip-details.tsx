import React from "react";
import {observer} from "mobx-react";
import {KubeObjectDetailsProps} from "../kube-object";
import {apiManager} from "../../api/api-manager";
import {IP, ipApi} from "../../api/endpoints/ip.api";

interface Props extends KubeObjectDetailsProps<IP> {
}

@observer
export class IPDetails extends React.Component<Props> {

    render() {
        const {object: ip} = this.props;
        if (!ip) return;
        return (
            <>
            </>
        );
    }
}

apiManager.registerViews(ipApi, {
    Details: IPDetails,
});