import { observer } from "mobx-react";
import React from "react";
import { Dialog, DialogProps } from "../dialog";
import { observable } from "mobx";
import { Wizard, WizardStep } from "../wizard";
import { t, Trans } from "@lingui/macro";
import { SubTitle } from "../layout/sub-title";
import { Input } from "../input";
import { isUrl, systemName } from "../input/input.validators";
import { _i18n } from "../../i18n";
import { configStore } from "../../config.store";
import {
    VirtualServiceSpec, HTTPRoute, HTTPMatchRequest,
    HTTPFaultInjection,
    HTTPFaultInjection_Delay,
    HTTPFaultInjection_Abort,
    RouteDestination,
    Destination,
    HTTPRouteDestination,
    HTTPRedirect,
    Delegate,
    HTTPRewrite,
    HTTPRetry,
} from "../../api/endpoints/istio-virtual-service.api";
import { virtualServiceStore } from "./virtual-service.store";
import { Notifications } from "../notifications";
import { ServerDetail } from "../+istio-common/server"
import { virtualServiceApi } from "../../api/endpoints";
import { HostDetails } from "../+istio-common/hosts"
import { GatewayDetails } from "../+istio-common/gateway"
import { HttpRouteRouteDetail } from "../+istio-common/http-route";
import { HTTPRouteTmp } from "../+istio-common/http-route";
import { HTTPMatchRequestTmp } from "../+istio-common/http-match-request"

interface Props extends DialogProps {
}

export interface VirtualServiceDetail extends VirtualServiceSpec {
    name: string;
    defaultHttp: HTTPRouteTmp[];
}

export const defaultVirtualServiceDetail: VirtualServiceDetail = {
    name: "",
    hosts: [],
    gateways: [],
    // http: [],
    defaultHttp: [],
    // tls:[],
    tcp: [],
    exportTo: [],
}




export const defaultDelay: HTTPFaultInjection_Delay = {

    //     percentage: "",
    //     httpDelayType: "",
}


export const defaultAbort: HTTPFaultInjection_Abort = {

}

export const defautFault: HTTPFaultInjection = {
    delay: defaultDelay,
    abort: defaultAbort
}

export const defaultHTTPMatchRequest: HTTPMatchRequest = {
    name: "",
    // uri: "",
    // scheme: "",
    // method: "",
    // authority: "",
    // headers: new Map<string, string>(),
    // port: 0,
    // sourceLabels: new Map<string, string>(),
    // gateways: [],
    // sourceNamespace: "",
    // queryParams: new Map<string, string>(),
    // withoutHeaders?: Map<string, string>; not support it now

}

export const defaultDestination: Destination = {
    // host: "",
    // subset: "",
}



export const defaultHTTPRouteDestination: HTTPRouteDestination = {
    destination: defaultDestination,
    // headers: not support now
}

export const defaultRedirect: HTTPRedirect = {
    // uri: "",
    // authority: "",
}

export const defaultDelegate: Delegate = {
    // name: "",
    // namespace: "",
}


export const defaultRewrite: HTTPRewrite = {
    // uri: "",
    // authority: "",
}

export const defaultRetries: HTTPRetry = {
    // perTryTimeout: "",
    // retryOn: "",

}



@observer
export class VirtualServiceDialog extends React.Component<Props> {

    @observable static isOpen = false;
    @observable virtualServiceDetail: VirtualServiceDetail = defaultVirtualServiceDetail;


    static open() {
        VirtualServiceDialog.isOpen = true;
    }

    static close() {
        VirtualServiceDialog.isOpen = false;
    }

    close = async () => {
        VirtualServiceDialog.close();
        await this.reset();
    }

    reset = async () => {
        this.virtualServiceDetail = defaultVirtualServiceDetail;
    }

    addVirtualService = async () => {
        try {

            let resultHTTPRoutes: HTTPRoute[] = [];
            console.log(this.virtualServiceDetail?.defaultHttp);
            this.virtualServiceDetail?.defaultHttp?.map((item) => {

                let tmpHttpRoute: HTTPRoute = {};

                if (item?.defautFault !== undefined) {

                    let percentString = item?.defautFault?.defaultDelay?.percentString

                    if (item?.defautFault?.defaultDelay?.httpDelayType !== "" || percentString !== "" || item?.defautFault?.defaultDelay?.percentage !== "" || item?.defautFault?.defaultAbort?.errorType !== "" || item?.defautFault?.defaultAbort?.percentageString) {
                        tmpHttpRoute.fault = defautFault;
                        if (item?.defautFault?.defaultDelay?.httpDelayType !== "" && item?.defautFault?.defaultDelay?.httpDelayType !== undefined) {
                            tmpHttpRoute.fault.delay.httpDelayType = item?.defautFault?.defaultDelay?.httpDelayType;
                        }


                        if (percentString !== "" && percentString !== undefined) {
                            tmpHttpRoute.fault.delay.percent = Number(percentString);
                        }
                        if (item?.defautFault?.defaultDelay?.percentage !== "" && item?.defautFault?.defaultDelay?.percentage !== undefined) {
                            tmpHttpRoute.fault.delay.percentage = item?.defautFault?.defaultDelay?.percentage;
                        }

                        if (item?.defautFault?.defaultAbort?.errorType !== "" && item?.defautFault?.defaultAbort?.errorType !== undefined) {
                            tmpHttpRoute.fault.abort.errorType = item?.defautFault?.defaultAbort?.errorType;
                        }

                        percentString = item?.defautFault?.defaultAbort?.percentageString;
                        if (percentString !== "" && percentString !== undefined) {
                            tmpHttpRoute.fault.abort.percentage = percentString;
                        }
                    }

                }


                if (item.defaultMatch?.length > 0) {
                    tmpHttpRoute.match = [];
                }
                item?.defaultMatch?.map((match) => {

                    let m: HTTPMatchRequest;
                    m = defaultHTTPMatchRequest;
                    m.gateways = match.gateways;
                    m.headers = match.headers;
                    m.ignoreUriCase = match.ignoreUriCase;
                    m.method = match.method;
                    m.name = match.name;
                    const portValue = match.portString;
                    if (portValue !== "" && portValue !== undefined) {
                        m.port = Number(portValue)
                    }
                    m.queryParams = match.queryParams;
                    m.scheme = match.scheme;
                    m.sourceLabels = match.sourceLabels;
                    m.uri = match.uri;
                    m.withoutHeaders = match.withoutHeaders;
                    tmpHttpRoute.match.push(m)
                });
                if (item?.defaultRoute?.length > 0) {
                    tmpHttpRoute.route = [];
                }
                item?.defaultRoute?.map((route) => {
                    let r: RouteDestination;
                    r = defaultHTTPRouteDestination;
                    r.destination.host = route?.destinationTmp?.host;
                    let port = route?.destinationTmp?.portString;
                    if (port !== "" && port !== undefined) {
                        r.destination.port = Number(port);
                    }
                    r.destination.subset = route.destinationTmp.subset;
                    let weight = route.weightString;
                    if (weight !== "" && weight !== undefined) {
                        r.weight = Number(weight);
                    }

                    tmpHttpRoute.route.push(r);
                });

                if (item?.delegate?.namespace !== "" && item?.delegate?.name !== "") {
                    tmpHttpRoute.delegate = defaultDelegate;
                    tmpHttpRoute.delegate = item?.delegate;
                }


                // tmpHttpRoute.headers = item?.headers;
                if (item?.defaultRedirect !== undefined) {

                    let attempts = item?.defaultRetries?.attemptsString;
                    let retryRemoteLocalities = item?.defaultRetries?.retryRemoteLocalitiesString;

                    if (item?.defaultRedirect?.authority !== "" || item?.defaultRetries?.perTryTimeout !== "" || attempts !== "" || retryRemoteLocalities !== "") {

                        tmpHttpRoute.retries = defaultRetries;
                        if (item?.defaultRetries?.perTryTimeout !== "") {

                            tmpHttpRoute.retries.perTryTimeout = item?.defaultRetries?.perTryTimeout;
                        }



                        if (attempts !== "" && attempts !== undefined) {
                            tmpHttpRoute.retries.attempts = Number(attempts);
                        }

                        if (item?.defaultRetries?.retryOn !== "") {
                            tmpHttpRoute.retries.retryOn = item?.defaultRetries?.retryOn;
                        }


                        if ((retryRemoteLocalities !== "" && retryRemoteLocalities !== undefined)) {
                            if (retryRemoteLocalities === "true") {
                                tmpHttpRoute.retries.retryRemoteLocalities = true;
                            } else {
                                tmpHttpRoute.retries.retryRemoteLocalities = false;
                            }
                        }
                    }

                }

                if (item?.redirect !== undefined) {
                    let redirectCode = item?.defaultRedirect?.redirectCodeString;
                    if (item?.defaultRedirect?.authority !== "" || item?.defaultRedirect?.uri !== "" || redirectCode !== "") {
                        tmpHttpRoute.redirect = defaultRedirect;
                        if (item?.defaultRedirect?.authority !== "") {
                            tmpHttpRoute.redirect.authority = item?.defaultRedirect?.authority;
                        }
                        if (redirectCode !== "" && redirectCode !== undefined) {
                            tmpHttpRoute.redirect.redirectCode = Number(redirectCode);
                        }
                        if (item?.defaultRedirect?.uri !== "") {
                            tmpHttpRoute.redirect.uri = item?.defaultRedirect?.uri;
                        }
                    }
                }

                if (item?.rewrite?.authority !== "" && item?.rewrite?.uri !== "") {
                    tmpHttpRoute.rewrite = defaultRewrite;
                    tmpHttpRoute.rewrite = item?.rewrite;
                }


                let mirrorPort = item?.defaultMirror?.portString;
                if (item?.defaultMirror?.host !== "" || mirrorPort !== "" || item?.defaultMirror?.subset !== "" || item.mirrorPercentString !== "" || item?.timeout !== "" || item?.name !== "") {
                    tmpHttpRoute.mirror = defaultDestination;
                    tmpHttpRoute.mirror.host = item?.defaultMirror?.host;


                    if (mirrorPort !== "" && mirrorPort !== undefined) {
                        tmpHttpRoute.mirror.port = Number(mirrorPort);
                    }
                    tmpHttpRoute.mirror.subset = item?.defaultMirror?.subset;
                    if (item.mirrorPercentString !== "" && item.mirrorPercentString !== undefined) {
                        tmpHttpRoute.mirrorPercent = Number(item.mirrorPercentString);
                    }
                    if (item?.mirrorPercentage !== "" && item?.mirrorPercentage !== undefined) {
                        tmpHttpRoute.mirrorPercentage = item?.mirrorPercentage;
                    }
                    if (item?.timeout !== "" && item?.timeout !== undefined) {
                        tmpHttpRoute.timeout = item?.timeout;
                    }
                    if (item?.name !== "") {
                        tmpHttpRoute.name = item?.name;
                    }
                }


                tmpHttpRoute.name = item?.name;
                // tmpHttpRoute.corsPolicy = item?.corsPolicy;

                resultHTTPRoutes.push(tmpHttpRoute);



            })

            await virtualServiceApi.create(
                {
                    name: this.virtualServiceDetail.name,
                    namespace: configStore.getOpsNamespace(),
                    labels: new Map<string, string>().set(
                        "namespace",
                        configStore.getDefaultNamespace()
                    ),
                },
                {
                    spec: {
                        gateways: this.virtualServiceDetail.gateways,
                        http: resultHTTPRoutes,
                        hosts: this.virtualServiceDetail.hosts,
                    },
                }
            )
            Notifications.ok(
                <>VirtualService {name} succeeded</>
            );
            await this.close();
        } catch (err) {
            Notifications.error(err);
        }
    }

    render() {
        const header = <h5><Trans>VirtualService</Trans></h5>;

        return (
            <Dialog
                className="VirtualServiceDialog"
                isOpen={VirtualServiceDialog.isOpen}
                close={this.close}
                pinned
            >
                <Wizard header={header} done={this.close}>
                    <WizardStep contentClass="flex gaps column" next={this.addVirtualService}>
                        <Input
                            required={true}
                            placeholder={_i18n._("VirtualService Name")}
                            value={this.virtualServiceDetail.name}
                            onChange={(value) => (this.virtualServiceDetail.name = value)}
                        />

                        <HostDetails value={this.virtualServiceDetail.hosts} />
                        <GatewayDetails value={this.virtualServiceDetail.gateways} />
                        <HttpRouteRouteDetail value={this.virtualServiceDetail.defaultHttp} />
                    </WizardStep>
                </Wizard>
            </Dialog>
        )
    }
}