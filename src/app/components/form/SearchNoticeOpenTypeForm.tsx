import { Col, Form, Select } from "antd";
import { map } from "lodash";
import React from "react";
import { ISearchFormBaseProps, SearchFormBase } from "./SearchFormBase";
import { NoticeOpenType } from "@type/NoticeOpenType";
import { ConfigModel } from "@config/ConfigModel";

interface IProps extends ISearchFormBaseProps {
}

export class SearchNoticeOpenTypeForm extends SearchFormBase<IProps> {
    constructor(props: IProps) {
        super(props);
    }

    private types: Array<ConfigModel.SelectOption<NoticeOpenType>> = [
        { text: "전체공개", value: NoticeOpenType.전체공개 },
        { text: "회원공개", value: NoticeOpenType.회원공개 },
        { text: "비공개", value: NoticeOpenType.비공개 },
        { text: "NONE", value: NoticeOpenType.NONE },
    ];

    render(): JSX.Element {
        const { name, label, placeholder } = this.props;

        return (
            <Col {...this.layout}>
                <Form.Item
                    // label={label || "공개 유형"}
                    name={name}
                    initialValue={""}
                >
                    <Select style={{ minWidth: 120, textAlign: 'left' }} placeholder={placeholder || "공개 유형을 선택해주세요"}>
                        <Select.Option value={""}>공개유형</Select.Option>
                        {map(this.types, (r, idx: number) => {
                            return (
                                <Select.Option key={idx} value={r.value}>{r.text}</Select.Option>
                            );
                        })}
                    </Select>
                </Form.Item>
            </Col>
        );
    }
}