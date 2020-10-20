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
import { HTTPRouteDestination, Destination } from "../../api/endpoints/istio-virtual-service.api"



interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(value: T, meta?: ActionMeta<any>): void;
}

export interface DestinationTmp extends Destination {
    portString: string,
}

export const defaultDestination: DestinationTmp = {
    host: "",
    subset: "",
    portString: "",
}


export interface HTTPRouteDestinationTmp extends HTTPRouteDestination {
    destinationTmp: DestinationTmp,
    weightString: string,
}

export const defaultHTTPRouteDestination: HTTPRouteDestinationTmp = {
    destinationTmp: defaultDestination,
    weightString: "",
    // headers: not support now
}


@observer
export class HttpRouteDestinationDetail extends React.Component<Props> {


    @computed get value(): HTTPRouteDestinationTmp[] {
        return this.props.value || [];
    }


    get typeOptions() {
        return ["true", "false"];
    }

    add = () => {
        this.value.push(defaultHTTPRouteDestination);
    };

    remove = (index: number) => {
        this.value.splice(index, 1);
    };

    renderHttpRouteDetail(index: number) {
        return (
            <>
                <Grid container spacing={5} direction={"row"} zeroMinWidth>
                    <Grid item xs={11} direction={"row"} zeroMinWidth>
                        <Grid container spacing={1} direction={"row"} zeroMinWidth>

                            <Grid item xs={12}>
                                <Input
                                    placeholder={"Host"}
                                    value={this.value[index].destinationTmp.host}
                                    onChange={(value) => (this.value[index].destinationTmp.host = value)}
                                />
                                <Input
                                    placeholder={"Subset"}
                                    value={this.value[index].destinationTmp.subset}
                                    onChange={(value) => (this.value[index].destinationTmp.subset = value)}
                                />
                                <Input
                                    placeholder={"Port"}
                                    value={this.value[index].destinationTmp.portString}
                                    onChange={(value) => {
                                        this.value[index].destinationTmp.portString = value
                                    }
                                    }
                                />
                                <Input
                                    placeholder={"Weight"}
                                    value={this.value[index].weightString}
                                    onChange={(value) => (this.value[index].weightString = value)}
                                />
                            </Grid>

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
                            <Trans>Route</Trans>
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
