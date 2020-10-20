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
import { HTTPMatchRequest } from "../../api/endpoints/istio-virtual-service.api"
import { SelectorDetails } from "./selector"



interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(value: T, meta?: ActionMeta<any>): void;
}

export interface HTTPMatchRequestTmp extends HTTPMatchRequest {
    portString?: string
}

export const defaultHTTPMatchRequest: HTTPMatchRequestTmp = {
    name: "",
    uri: "",
    scheme: "",
    method: "",
    authority: "",
    headers: new Map<string, string>(),
    // port: 0,
    portString: "",
    sourceLabels: new Map<string, string>(),
    gateways: [],
    sourceNamespace: "",
    queryParams: new Map<string, string>(),
    // withoutHeaders?: Map<string, string>; not support it now

}






@observer
export class HttpMatchRequestDetail extends React.Component<Props> {


    @computed get value(): HTTPMatchRequestTmp[] {
        return this.props.value || [];
    }


    get typeOptions() {
        return ["true", "false"];
    }

    add = () => {
        this.value.push(defaultHTTPMatchRequest);
    };

    remove = (index: number) => {
        this.value.splice(index, 1);
    };

    renderHttpRouteDetail(index: number) {
        return (
            <>
                <Grid container spacing={5} direction={"row"} >
                    <Grid item xs={11} direction={"row"} >
                        <Grid container spacing={1} direction={"row"} >

                            <Grid item xs={12}>
                                <Input
                                    placeholder={"Name"}
                                    value={this.value[index].name}
                                    onChange={(value) => (this.value[index].name = value)}
                                />
                                <Input
                                    placeholder={"Uri"}
                                    value={this.value[index].uri}
                                    onChange={(value) => (this.value[index].uri = value)}
                                />
                                <Input
                                    placeholder={"Scheme"}
                                    value={this.value[index].scheme}
                                    onChange={(value) => (this.value[index].scheme = value)}
                                />
                                <Input
                                    placeholder={"Method"}
                                    value={this.value[index].method}
                                    onChange={(value) => (this.value[index].method = value)}
                                />
                                <Input
                                    placeholder={"Authority"}
                                    value={this.value[index].authority}
                                    onChange={(value) => (this.value[index].authority = value)}
                                />
                                <Input
                                    placeholder={"Port"}
                                    value={this.value[index].portString}
                                    onChange={(value) => (this.value[index].portString = value)}
                                />
                                <Input
                                    placeholder={"SourceNamespace"}
                                    value={this.value[index].sourceNamespace}
                                    onChange={(value) => (this.value[index].sourceNamespace = value)}
                                />



                                {/* <SelectorDetails value={this.value[index].headers} name={"Headers"} />
                                <SelectorDetails value={this.value[index].sourceLabels} name={"SourceLabels"} />
                                <SelectorDetails value={this.value[index].queryParams} name={"QueryParams"} /> */}

                            </Grid>

                        </Grid>

                        <Grid item xs zeroMinWidth>

                        </Grid>


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
                            <Trans>Match</Trans>
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
