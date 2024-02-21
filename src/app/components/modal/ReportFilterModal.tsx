import { Errors } from "@contexts/ErrorContext"
import { PaginationModel } from "@model/PaginationModel"
import { ReportModel } from "@model/ReportModel"
import { ReportService } from "@services/ReportService"
import { ComplainStatusType } from "@type/ComplainStatusType"
import { ComplainType } from "@type/ComplainType"
import { Button, Checkbox, Col, DatePicker, Form, Modal, Radio, Row, Space, Typography } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { map } from "lodash-es"
import React, { FunctionComponent, useState } from "react"

interface IProps {
    show: boolean
    onCompleted: (page: PaginationModel.Paging<ReportModel.IReportArticleModel>, complainType: ComplainType, complainStatusTypes: ComplainStatusType[], minCreateDate: Date, maxCreateDate: Date, minCloseDate: Date, maxCloseDate: Date, isFilter: boolean) => void
    onClosed: (complainType: ComplainType, complainStatusTypes: ComplainStatusType[], minCreateDate: Date, maxCreateDate: Date, minCloseDate: Date, maxCloseDate: Date, isFilter: boolean) => void
    keyword: string
    complainType: ComplainType
    complainStatusTypes: ComplainStatusType[]
    minCreateDate: Date
    maxCreateDate: Date
    minCloseDate: Date
    maxCloseDate: Date
}

export const ReportFilterModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, keyword, complainType, complainStatusTypes, minCreateDate, maxCreateDate, minCloseDate, maxCloseDate } = props

    const [formFilter] = Form.useForm()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [types, setTypes] = useState<CheckboxValueType[]>([])
    const complainStatusTypeArray: ComplainStatusType[] = []
    const [isFilter, setIsFilter] = useState<boolean>(false)

    const values = ['완료', '확인중', '대기']

    const color = (title: string) => {
        switch (title) {
            case '완료':
                return '#20C997'
            case '확인중':
                return '#4263EB'
            case '대기':
            default:
                return '#868E96'
        }
    }

    const 상태여부 = (color: string, title: string) => {
        return (
            <Space>
                <div
                    style={{
                        width: 8,
                        height: 8,
                        borderRadius: 4,
                        backgroundColor: color
                    }}
                />
                <Typography.Text>{title}</Typography.Text>
            </Space>
        )
    }

    const fn_Closed = () => {
        const pIsFilter = getIsFilter({ complainType: complainType, complainStatusTypes: complainStatusTypeArray, minCreateDate: minCreateDate, maxCreateDate: maxCreateDate, minCloseDate: minCloseDate, maxCloseDate: maxCloseDate, })
        onClosed(complainType, complainStatusTypes, minCreateDate, maxCreateDate, minCloseDate, maxCloseDate, pIsFilter)
    }

    const getIsFilter = ({ ...values }: any) => {
        let isReturn = false

        if (values.complainType || values.minCreateDate || values.maxCreateDate || values.minCloseDate || values.maxCloseDate || (values.complainStatusTypes.length > 0)) {
            isReturn = true
        }
        setIsFilter(isReturn)

        return isReturn
    }

    const getComplainStatusType = (complainStatusTypeString: string) => {
        switch (complainStatusTypeString) {
            case '완료':
                return ComplainStatusType.완료
            case '확인중':
                return ComplainStatusType.확인중
            case '대기':
                return ComplainStatusType.대기중
            default:
                return null
        }
    }

    const search = async (keyword: string, page: number = 0) => {
        setLoading(true)

        formFilter.validateFields().then(async (values) => {
            map(types, (u) => {
                complainStatusTypeArray.push(getComplainStatusType(u.toString()))
            })
            let complainType: ComplainType
            switch (values.view) {
                case 1:
                    complainType = ComplainType.공동중개
                    break
                case 2:
                    complainType = ComplainType.매물찾기
                default:
            }

            let lMinCreateDate: Date = null
            let lMaxCreateDate: Date = null
            if (values.reportedAt != null) {
                lMinCreateDate = values.reportedAt[0].format("YYYY-MM-DD")
                lMaxCreateDate = values.reportedAt[1].format("YYYY-MM-DD")
            }

            let lMinCloseDate: Date = null
            let lMaxCloseDate: Date = null
            if (values.completedAt != null) {
                lMinCloseDate = values.completedAt[0].format("YYYY-MM-DD")
                lMaxCloseDate = values.completedAt[1].format("YYYY-MM-DD")
            }

            const response = await ReportService.search({ minCloseDate: lMinCloseDate, maxCloseDate: lMaxCloseDate, minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, complainType: complainType, complainStatusTypes: complainStatusTypeArray, keyword: keyword, page: page })
            if (response.status === 200) {
                setLoading(false)
                const pIsFilter = getIsFilter({ minCloseDate: lMinCloseDate, maxCloseDate: lMaxCloseDate, minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, complainType: complainType, complainStatusTypes: complainStatusTypeArray })
                onCompleted(response.data.result, complainType, complainStatusTypeArray, lMinCreateDate, lMaxCreateDate, lMinCloseDate, lMaxCloseDate, pIsFilter)
            } else {
                setLoading(false)
                Errors.AjaxError(response.data)
            }
        })
            .catch((e) => {
                console.log('error', e)
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return (
        <Modal
            centered
            open={show}
            maskClosable={false}
            destroyOnClose={true}
            onCancel={fn_Closed}
            closeIcon={false}
            title={(
                <Row>
                    <Col span={12}>
                        <Typography.Title level={2}>상세필터</Typography.Title>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                        <Typography.Link
                            onClick={() => {
                                formFilter.resetFields()
                                setTypes([])
                            }}
                        >
                            <Typography.Text type="secondary" underline>초기화</Typography.Text>
                        </Typography.Link>
                    </Col>
                </Row>
            )}
            footer={(
                <Space style={{ marginTop: '1em' }}>
                    <Button loading={isLoading} danger onClick={fn_Closed}>
                        취소
                    </Button>
                    <Button loading={isLoading} type="primary" onClick={() => search(keyword)}>
                        설정
                    </Button>
                </Space>
            )}
            width={'50%'}
        >
            <Form
                form={formFilter}
                layout="vertical"
                style={{ marginTop: '2em' }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>매물종류</Typography.Text>
                            <Form.Item
                                name="view"
                                style={{ marginBottom: 0 }}
                            >
                                <Radio.Group>
                                    <Radio value={null}>
                                        <Typography.Text>전체</Typography.Text>
                                    </Radio>
                                    <Radio value={1}>
                                        <Typography.Text>{'공동중개'}</Typography.Text>
                                    </Radio>
                                    <Radio value={2}>
                                        <Typography.Text>{'매물찾습니다'}</Typography.Text>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>신고일</Typography.Text>
                            <Form.Item
                                name="reportedAt"
                                style={{ marginBottom: 0 }}
                            >
                                <DatePicker.RangePicker
                                    style={{ minWidth: 400 }}
                                    placeholder={['YY.MM.DD', 'YY.MM.DD']}
                                />
                            </Form.Item>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>완료일</Typography.Text>
                            <Form.Item
                                name="completedAt"
                                style={{ marginBottom: 0 }}
                            >
                                <DatePicker.RangePicker
                                    style={{ minWidth: 400 }}
                                    placeholder={['YY.MM.DD', 'YY.MM.DD']}
                                />
                            </Form.Item>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>상태</Typography.Text>
                            <Form.Item
                                name="view"
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <Checkbox
                                        onChange={(e: CheckboxChangeEvent) => {
                                            setTypes(e.target.checked ? values : [])
                                        }}
                                        checked={values.length === types.length}
                                    >
                                        전체
                                    </Checkbox>
                                    {values.map((v) => {
                                        return (
                                            <Checkbox
                                                key={v}
                                                value={v}
                                                checked={types.includes(v)}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    setTypes(e.target.checked ? [...types, v] : types.filter(t => t !== v))
                                                }}
                                            >
                                                {상태여부(color(v), v)}
                                            </Checkbox>
                                        )
                                    })}
                                </Space>
                            </Form.Item>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}