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
import { Subset } from "../../api/endpoints/istio-destination-rule.api"
import { LabelDetails } from "./label"


interface Props<T = any> extends Partial<Props> {
    value?: T;
    themeName?: "dark" | "light" | "outlined";

    onChange?(value: T, meta?: ActionMeta<any>): void;
}


export interface Pair {
    key?: string;
    value?: string;
}

export interface SubSetDetail {
    name: string;
    pairs: Pair[];
}

export const defaultSubSetDetail: SubSetDetail = {
    name: "",
    pairs: [],
}


@observer
export class SubSetDetails extends React.Component<Props> {


    @computed get value(): SubSetDetail[] {
        return this.props.value || [];
    }


    add = () => {
        this.value.push(defaultSubSetDetail);
    };

    remove = (index: number) => {
        this.value.splice(index, 1);
    };

    renderSubSetDetail(index: number) {
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
                            </Grid>
                            <Grid item xs={12}>
                                <LabelDetails value={this.value[index].pairs} />
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
                            <Trans>SubSet</Trans>
              &nbsp;&nbsp;
              <Icon material={"edit"} className={"editIcon"} onClick={event => {
                                stopPropagation(event);
                                this.add()
                            }} small />
                        </>
                    }>
                </SubTitle>
                {this.value.map((item: any, index: number) => {
                    return this.renderSubSetDetail(index);
                })}
            </>
        );
    }

}
