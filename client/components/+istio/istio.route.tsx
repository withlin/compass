import { RouteProps } from "react-router";
import { buildURL } from "../../navigation";
import { Istio } from "./istio";

export const istioRoute: RouteProps = {
    get path() {
        return Istio.tabRoutes.map(({ path }) => path).flat();
    },
};

export const istioGatewayRoute: RouteProps = {
    path: "/istio/gateway",
};

export const istioVirtualServiceRoute: RouteProps = {
    path: "/istio/virtualservice",
};

export const istioDestinationRuleRoute: RouteProps = {
    path: "/istio/destinationrule",
};

export const istioServiceEnrtyRoute: RouteProps = {
    path: "/istio/serviceenrty",
};

export const istioWorkloadEntryRoute: RouteProps = {
    path: "/istio/workloadentry",
};


export const istioGatewayURL = buildURL(istioGatewayRoute.path);
export const istioVirtualServiceURL = buildURL(istioVirtualServiceRoute.path);
export const istioDestinationRuleURL = buildURL(istioDestinationRuleRoute.path);
export const istioServiceEnrtyURL = buildURL(istioServiceEnrtyRoute.path);
export const istioWorkloadEntryURL = buildURL(istioWorkloadEntryRoute.path);
