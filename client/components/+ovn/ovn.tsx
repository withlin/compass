import * as React from "react";
import {RouteComponentProps} from "react-router-dom";
import {Redirect, Route, Switch} from "react-router";
import {MainLayout, TabRoute} from "../layout/main-layout";
import {Trans} from "@lingui/macro";
import {namespaceStore} from "../+namespaces/namespace.store";
import {IPs, ipRoute, ipURL} from "../+ovn-ips";
import {SubNets, subNetURL, subNetRoute} from "../+ovn-subnets";

interface Props extends RouteComponentProps {
}

export class Ovn extends React.Component<Props> {
    static get tabRoutes(): TabRoute[] {
        const query = namespaceStore.getContextParams();
        return [
            {
                title: <Trans>IP</Trans>,
                component: IPs,
                url: ipURL({query}),
                path: ipRoute.path,
            },
            {
                title: <Trans>SubNet</Trans>,
                component: SubNets,
                url: subNetURL({query}),
                path: subNetRoute.path,
            },
        ];
    }

    render() {
        const tabRoutes = Ovn.tabRoutes;
        return (
            <MainLayout>
                <Switch>
                    {tabRoutes.map((route, index) => (
                        <Route key={index} {...route} />
                    ))}
                    <Redirect to={tabRoutes[0].url}/>
                </Switch>
            </MainLayout>
        );
    }
}
