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
import { Port } from "../../api/endpoints";

interface Props<T = any> extends Partial<Props> {
    value?: T;
    name?: string;
    themeName?: "dark" | "light" | "outlined";

    onChange?(value: T, meta?: ActionMeta<any>): void;
}


export interface ServiceEntryPort {
    // A valid non-negative integer port number.
    number?: string
    // The protocol exposed on the port.
    // MUST BE one of HTTP|HTTPS|GRPC|HTTP2|MONGO|TCP|TLS.
    // TLS implies the connection will be routed based on the SNI header to
    // the destination without terminating the TLS connection.

    //TODO:Select instead of input
    protocol?: string;
    // Label assigned to the port.
    name?: string;
    // The port number on the endpoint where the traffic will be
    // received. Applicable only when used with ServiceEntries.
    targetPort?: string;
}

export const defaultServiceEntryPort: ServiceEntryPort = {
    number: "",
    protocol: "",
    name: "",
    targetPort: "",

}


@observer
export class ServiceEntryPortsDetails extends React.Component<Props> {


    @computed get value(): ServiceEntryPort[] {
        return this.props.value || [];
    }

    add = () => {
        this.value.push(defaultServiceEntryPort);
    };

    remove = (index: number) => {
        this.value.splice(index, 1);
    };

    renderPortDetail(index: number) {
        return (
            <>
                <Grid container spacing={5} direction={"row"} zeroMinWidth>
                    <Grid item xs={11} direction={"row"} zeroMinWidth>
                        <Grid container spacing={1} direction={"row"} zeroMinWidth>
                            <Grid item xs={12}>
                                <Input
                                    placeholder={"Name"}
                                    value={this.value[index].name}
                                    onChange={(value) => (this.value[index].name = value)}
                                />
                                <Input
                                    placeholder={"Protocol"}
                                    value={this.value[index].protocol}
                                    onChange={(value) => (this.value[index].protocol = value)}
                                />
                                <Input
                                    placeholder={"TargetPort"}
                                    value={this.value[index].targetPort}
                                    onChange={(value) => (this.value[index].targetPort = value)}
                                />
                                <Input
                                    placeholder={"Number"}
                                    value={this.value[index].number}
                                    onChange={(value) => (this.value[index].number = value)}
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
                            <Trans>Ports</Trans>
              &nbsp;&nbsp;
              <Icon material={"add_circle"} className={"add_circle"} onClick={event => {
                                stopPropagation(event);
                                this.add()
                            }} />
                        </>
                    }>
                </SubTitle>
                {this?.value?.map((item: any, index: number) => {
                    return this.renderPortDetail(index);
                })}
            </>
        );
    }

}
