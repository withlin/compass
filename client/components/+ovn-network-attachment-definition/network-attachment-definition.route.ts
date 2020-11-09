import {RouteProps} from "react-router";
import {buildURL} from "../../navigation";

export const networkAttachmentDefinitionRoute: RouteProps = {
  path: "/network-attachment-definition"
}

export interface INetworkAttachmentDefinitionRouteParams {
}

export const networkAttachmentDefinitionURL = buildURL<INetworkAttachmentDefinitionRouteParams>(networkAttachmentDefinitionRoute.path)