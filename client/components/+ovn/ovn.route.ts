import { RouteProps } from "react-router";
import { buildURL } from "../../navigation";
import { Ovn } from './ovn'

export const ovnRoute: RouteProps = {
  get path() {
    return Ovn.tabRoutes.map(({ path }) => path).flat()
  }
}

export const ovnVlanRoute: RouteProps = {
  path: "/ovn-vlan",
};

export const ovnURL = buildURL(ovnVlanRoute.path);
export const ovnVlanURL = buildURL(ovnVlanRoute.path);
