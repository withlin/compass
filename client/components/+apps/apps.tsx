import React from "react";
import store from 'store'
import { Redirect, Route, Switch } from "react-router";
import { Trans } from "@lingui/macro";
import { MainLayout, TabRoute } from "../layout/main-layout";
import { HelmCharts, helmChartsRoute, helmChartsURL } from "../+apps-helm-charts";
import { HelmReleases, releaseRoute, releaseURL } from "../+apps-releases";
import { namespaceStore } from "../+namespaces/namespace.store";
import { configStore } from "../../../client/config.store";
import { clusterURL } from "../+cluster/cluster.routes";
import { workloadsURL } from "../+workloads/workloads.route";


export class Apps extends React.Component {
  static get tabRoutes(): TabRoute[] {
    const query = namespaceStore.getContextParams();
    return [
      {
        title: <Trans>Charts</Trans>,
        component: HelmCharts,
        url: helmChartsURL(),
        path: helmChartsRoute.path,
      },
      {
        title: <Trans>Releases</Trans>,
        component: HelmReleases,
        url: releaseURL({ query }),
        path: releaseRoute.path,
      },
    ]
  }

  render() {
    let homeUrl = ''
    const userConifg = JSON.parse(localStorage.getItem('u_config'))
    if (userConifg) {
      const userConfig = store.get('u_config')
      if (userConfig) {
        configStore.setConfig(userConfig)
        let admin = userConfig.isClusterAdmin
        homeUrl = admin == 'true' ? clusterURL() : workloadsURL();
      }
      const tabRoutes = Apps.tabRoutes;
      return (
        <MainLayout className="Apps">
          <Switch>
            {tabRoutes.map((route, index) => <Route key={index} {...route} />)}
            <Redirect to={tabRoutes[0].url} />
          </Switch>
        </MainLayout>
      )
    }
  }
}
