import * as React from "react";
import { RouteComponentProps } from "react-router-dom";
import { Redirect, Route, Switch } from "react-router";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { Trans } from "@lingui/macro";
import { namespaceStore } from "../+namespaces/namespace.store";
import { Gateways } from "../+istio-gateway/gateway"
import { VirtualServices } from "../+istio-virtualservice/virtual-service"
import { DestinationRules } from "../+istio-destinationrule/destination-rule"
import { ServiceEntrys } from "../+istio-service-entry/service-entry"
import { WorkloadEntrys } from "../+istio-workload-entry/workload-entry"
import {
    istioGatewayRoute, istioGatewayURL, istioVirtualServiceURL, istioDestinationRuleURL, istioServiceEnrtyURL, istioWorkloadEntryURL, istioServiceEnrtyRoute, istioDestinationRuleRoute, istioWorkloadEntryRoute, istioVirtualServiceRoute
} from "./istio.route";

interface Props extends RouteComponentProps { }

export class Istio extends React.Component<Props> {
    static get tabRoutes(): TabRoute[] {
        const query = namespaceStore.getContextParams();
        return [
            {
                title: <Trans>Gateway</Trans>,
                component: Gateways,
                url: istioGatewayURL({ query }),
                path: istioGatewayRoute.path,
            },
            {
                title: <Trans>VirtualService</Trans>,
                component: VirtualServices,
                url: istioVirtualServiceURL({ query }),
                path: istioVirtualServiceRoute.path,
            },
            {
                title: <Trans>DestinationRule</Trans>,
                component: DestinationRules,
                url: istioDestinationRuleURL({ query }),
                path: istioDestinationRuleRoute.path,
            },
            {
                title: <Trans>ServiceEntry</Trans>,
                component: ServiceEntrys,
                url: istioServiceEnrtyURL({ query }),
                path: istioServiceEnrtyRoute.path,
            },
            {
                title: <Trans>WorkloadEntry</Trans>,
                component: WorkloadEntrys,
                url: istioWorkloadEntryURL({ query }),
                path: istioWorkloadEntryRoute.path,
            },
        ];
    }

    render() {
        const tabRoutes = Istio.tabRoutes;
        return (
            <MainLayout tabs={tabRoutes}>
                <Switch>
                    {tabRoutes.map((route, index) => (
                        <Route key={index} {...route} />
                    ))}
                    <Redirect to={tabRoutes[0].url} />
                </Switch>
            </MainLayout>
        );
    }
}
