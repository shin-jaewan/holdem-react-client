import { ColProps } from "antd/lib/grid/col"
import React from "react"

export interface ISearchFormBaseProps extends ColProps {
    name: string
    label?: string
    placeholder?: string
    progress?: boolean
    hasAll?: boolean
    isRequired?: boolean
    disable?: boolean
    hasSelect?: boolean
    layout?: { xs?: { span: number }, sm?: { span: number }, lg?: { span: number } }
}

interface ISearchFormBaseState { }

export class SearchFormBase<TProps extends ISearchFormBaseProps, TState extends ISearchFormBaseState = {}> extends React.Component<TProps, TState> {
    constructor(props: TProps) {
        super(props)
        this.layout = Object.assign({ xs: { span: 24 }, sm: { span: 24 }, lg: { span: 4 } } as ColProps, this.props.layout)
    }

    protected layout: ColProps = null
}