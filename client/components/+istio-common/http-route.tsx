import { observer } from "mobx-react";
import React from "react";
import { computed, observable } from "mobx";
import { Input } from "../input";
import { ActionMeta } from "react-select/src/types";
import { SubTitle } from "../layout/sub-title";
import { Icon } from "../icon";
import { t, Trans } from "@lingui/macro";
import { _i18n } from "../../i18n";
import { Grid } from "@material-ui/core";
import { stopPropagation } from "../../utils";
import {
    HTTPRoute, Destination, HTTPFaultInjection,
    HTTPFaultInjection_Delay,
    HTTPFaultInjection_Abort,
    HTTPRetry,
    HTTPRewrite,
    Delegate,
    HTTPRedirect,
} from "../../api/endpoints/istio-virtual-service.api"
import { defaultHTTPRouteDestination } from "./http-route-destination"
import { HttpRouteDestinationDetail } from "../+istio-common/http-route-destination"
import { HttpMatchRequestDetail } from "../+istio-common/http-match-request"
import { HTTPRouteDestinationTmp } from "./http-route-destination"
import { HTTPMatchRequestTmp } from "./http-match-request"

interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(value: T, meta?: ActionMeta<any>): void;
}

export interface DestinationTmp extends Destination {
    portString: string
}

export const defaultDestination: DestinationTmp = {
    host: "",
    subset: "",
    portString: "",
}

export interface HTTPFaultInjection_DelayTmp extends HTTPFaultInjection_Delay {
    percentString: string
}


export const defaultDelay: HTTPFaultInjection_DelayTmp = {
    percentString: "",
    percentage: "",
    httpDelayType: "",
}


export interface HTTPFaultInjection_AbortTmp extends HTTPFaultInjection_Abort {
    percentageString: string;
}

export const defaultAbort: HTTPFaultInjection_AbortTmp = {
    errorType: "",
    percentageString: "",
}

export interface HTTPFaultInjectionTmp extends HTTPFaultInjection {
    defaultDelay: HTTPFaultInjection_DelayTmp;
    defaultAbort: HTTPFaultInjection_AbortTmp;
}


export const defautFault: HTTPFaultInjectionTmp = {
    defaultDelay: defaultDelay,
    defaultAbort: defaultAbort
}


export interface HTTPRetryTmp extends HTTPRetry {
    attemptsString: string;
    retryRemoteLocalitiesString: string,
}
export const defaultRetries: HTTPRetryTmp = {
    attemptsString: "",
    perTryTimeout: "",
    retryOn: "",
    retryRemoteLocalitiesString: "",

}

export const defaultRewrite: HTTPRewrite = {
    uri: "",
    authority: "",
}

export const defaultDelegate: Delegate = {
    name: "",
    namespace: "",
}

export interface HTTPRedirectTmp extends HTTPRedirect {
    redirectCodeString: string;
}

export const defaultRedirect: HTTPRedirectTmp = {
    uri: "",
    authority: "",
    redirectCodeString: "",
}

export interface HTTPRouteTmp extends HTTPRoute {
    mirrorPercentString: string;
    defaultMirror: DestinationTmp;
    defaultRetries: HTTPRetryTmp;
    defaultRedirect: HTTPRedirectTmp;
    defautFault: HTTPFaultInjectionTmp;
    defaultRoute: HTTPRouteDestinationTmp[];
    defaultMatch: HTTPMatchRequestTmp[];
}

export const defaultHttpPRoute: HTTPRouteTmp = {
    name: "",
    timeout: "",
    mirrorPercentString: "",
    mirrorPercentage: "",
    defaultMirror: defaultDestination,
    defautFault: defautFault,
    defaultRetries: defaultRetries,
    rewrite: defaultRewrite,
    delegate: defaultDelegate,
    defaultMatch: [],
    defaultRoute: [],
    defaultRedirect: defaultRedirect,
    // headers?: Headers;  not support now
    // corsPolicy?: CorsPolicy; not support now
}



@observer
export class HttpRouteRouteDetail extends React.Component<Props> {


    @computed get value(): HTTPRouteTmp[] {
        return this.props.value || [];
    }


    get typeOptions() {
        return ["true", "false"];
    }

    add = () => {
        this.value.push(defaultHttpPRoute);
    };

    remove = (index: number) => {
        this.value.splice(index, 1);
    };

    renderHttpRouteDetail(index: number) {
        return (
            <>
                <Grid container spacing={5} direction={"row"} >
                    <Grid item xs={11} direction={"row"} >
                        <Input
                            placeholder={"Name"}
                            value={this.value[index].name}
                            onChange={(value) => (this.value[index].name = value)}
                        />

                        <Input
                            placeholder={"Timeout"}
                            value={this.value[index].timeout}
                            onChange={(value) => (this.value[index].timeout = value)}
                        />

                        <Input
                            placeholder={"MirrorPercent"}
                            value={this.value[index].mirrorPercentString}
                            onChange={(value) => (this.value[index].mirrorPercentString = value)}
                        />
                        <Input
                            placeholder={"mirrorPercentage"}
                            value={this.value[index].mirrorPercentage}
                            onChange={(value) => (this.value[index].mirrorPercentage = value)}
                        />
                        <SubTitle
                            title={
                                <Trans>Mirror</Trans>
                            }>
                        </SubTitle>
                        <Input
                            placeholder={"Host"}
                            value={this.value[index].defaultMirror.host}
                            onChange={(value) => (this.value[index].defaultMirror.host = value)}
                        />
                        <Input
                            placeholder={"Subset"}
                            value={this.value[index].defaultMirror.subset}
                            onChange={(value) => (this.value[index].defaultMirror.subset = value)}
                        />
                        <Input
                            placeholder={"Port"}
                            value={this.value[index].defaultMirror.portString}
                            onChange={(value) => (this.value[index].defaultMirror.portString = value)}
                        />
                        <SubTitle
                            title={
                                <Trans>FaultDelay</Trans>
                            }>
                        </SubTitle>
                        <Input
                            placeholder={"HttpDelayType"}
                            value={this.value[index].defautFault.defaultDelay.httpDelayType}
                            onChange={(value) => (this.value[index].defautFault.delay.httpDelayType = value)}
                        />
                        <Input
                            placeholder={"Percent"}
                            value={this.value[index].defautFault.defaultDelay.percentString}
                            onChange={(value) => (this.value[index].defautFault.defaultDelay.percentString = value)}
                        />
                        <Input
                            placeholder={"Percentage"}
                            value={this.value[index].defautFault.defaultDelay.percentage}
                            onChange={(value) => (this.value[index].defautFault.defaultDelay.percentage = value)}
                        />
                        <SubTitle
                            title={
                                <Trans>FaultAbort</Trans>
                            }>
                        </SubTitle>
                        <Input
                            placeholder={"HttpDelayType"}
                            value={this.value[index].defautFault.defaultAbort.errorType}
                            onChange={(value) => (this.value[index].defautFault.defaultAbort.errorType = value)}
                        />
                        <Input
                            placeholder={"Percentage"}
                            value={this.value[index].defautFault.defaultAbort.percentageString}
                            onChange={(value) => (this.value[index].defautFault.defaultAbort.percentageString = value)}
                        />

                        <SubTitle
                            title={
                                <Trans>Retries</Trans>
                            }>
                        </SubTitle>
                        <Input
                            placeholder={"Attempts"}
                            value={this.value[index].defaultRetries.attemptsString}
                            onChange={(value) => { this.value[index].defaultRetries.attemptsString = value }}
                        />
                        <Input
                            placeholder={"PerTryTimeout"}
                            value={this.value[index].defaultRetries.perTryTimeout}
                            onChange={(value) => (this.value[index].defaultRetries.perTryTimeout = value)}
                        />
                        <Input
                            placeholder={"RetryOn"}
                            value={this.value[index].defaultRetries.retryOn}
                            onChange={(value) => (this.value[index].defaultRetries.retryOn = value)}
                        />
                        {/* TODO://不能输入 */}
                        <Input
                            placeholder={"RetryRemoteLocalities"}
                            value={this.value[index].defaultRetries.retryRemoteLocalitiesString}
                            onChange={(value) => {
                                this.value[index].defaultRetries.retryRemoteLocalitiesString = value
                            }}
                        />
                        <SubTitle
                            title={
                                <Trans>Rewrite</Trans>
                            }>
                        </SubTitle>
                        <Input
                            placeholder={"Authority"}
                            value={this.value[index].rewrite.authority}
                            onChange={(value) => (this.value[index].rewrite.authority = value)}
                        />
                        <Input
                            placeholder={"Uri"}
                            value={this.value[index].rewrite.uri}
                            onChange={(value) => (this.value[index].rewrite.uri = value)}
                        />
                        <SubTitle
                            title={
                                <Trans>Delegate</Trans>
                            }>
                        </SubTitle>
                        <Input
                            placeholder={"Name"}
                            value={this.value[index].delegate.name}
                            onChange={(value) => (this.value[index].delegate.name = value)}
                        />
                        <Input
                            placeholder={"Namespace"}
                            value={this.value[index].delegate.namespace}
                            onChange={(value) => (this.value[index].delegate.namespace = value)}
                        />
                        <SubTitle
                            title={
                                <Trans>Redirect</Trans>
                            }>
                        </SubTitle>
                        <Input
                            placeholder={"Authority"}
                            value={this.value[index].defaultRedirect.authority}
                            onChange={(value) => (this.value[index].defaultRedirect.authority = value)}
                        />
                        <Input
                            placeholder={"Uri"}
                            value={this.value[index].defaultRedirect.uri}
                            onChange={(value) => (this.value[index].defaultRedirect.uri = value)}
                        />
                        <Input
                            placeholder={"RedirectCode"}
                            value={this.value[index].defaultRedirect.redirectCodeString}
                            onChange={(value) => {
                                this.value[index].defaultRedirect.redirectCodeString = value
                            }}
                        />
                        <HttpRouteDestinationDetail value={this.value[index].defaultRoute} />
                        <HttpMatchRequestDetail value={this.value[index].defaultMatch} />

                    </Grid>
                    <Grid item xs zeroMinWidth>
                        <Icon
                            small
                            tooltip={_i18n._(t`Remove`)}
                            className="remove-icon"
                            material="clear"
                            onClick={(event) => {
                                this.remove(index);
                                stopPropagation(event)
                            }}
                        />
                    </Grid>
                </Grid>
            </>
        )
    }


    render() {
        return (
            <>
                <SubTitle
                    title={
                        <>
                            <Trans>HttpRoute</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                                stopPropagation(event);
                                this.add()
                            }} small />
                        </>
                    }>
                </SubTitle>
                {this.value.map((item: any, index: number) => {
                    return this.renderHttpRouteDetail(index);
                })}
            </>
        );
    }

}
