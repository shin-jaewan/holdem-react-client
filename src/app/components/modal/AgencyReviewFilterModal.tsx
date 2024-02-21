import { Errors } from "@contexts/ErrorContext"
import { AgencyModel } from "@model/AgencyModel"
import { PaginationModel } from "@model/PaginationModel"
import { AgencyReviewService } from "@services/AgencyReviewService"
import { AgencyReviewStatusType } from "@type/AgencyReviewStatusType"
import { AgencyReviewType } from "@type/AgencyReviewType"
import { AgencyStatusType } from "@type/AgencyStatusType"
import { Button, Checkbox, Col, DatePicker, Form, Modal, Radio, Row, Space, Tag, Typography } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { map } from "lodash-es"
import React, { FunctionComponent, useState } from "react"

interface IProps {
    show: boolean
    onCompleted: (page: PaginationModel.Paging<AgencyModel.IAgencyReviewModel>, minCreateDate: Date, maxCreateDate: Date, minReviewDate: Date, maxReviewDate: Date, agencyReviewType: AgencyReviewType, agencyStatusTypes: AgencyStatusType[], reviewStatusTypes: AgencyReviewStatusType[], isFilter: boolean) => void
    onClosed: (minCreateDate: Date, maxCreateDate: Date, minReviewDate: Date, maxReviewDate: Date, agencyReviewType: AgencyReviewType, agencyStatusTypes: AgencyStatusType[], reviewStatusTypes: AgencyReviewStatusType[], isFilter: boolean) => void
    keyword: string
    minCreateDate: Date
    maxCreateDate: Date
    minReviewedDate: Date
    maxReviewedDate: Date
    agencyReviewType: AgencyReviewType
    agencyStatusTypes: AgencyStatusType[]
    reviewStatusTypes: AgencyReviewStatusType[]
}

export const AgencyReviewFilterModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, keyword, minCreateDate, maxCreateDate, minReviewedDate, maxReviewedDate, agencyReviewType, agencyStatusTypes, reviewStatusTypes } = props

    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [types, setTypes] = useState<CheckboxValueType[]>([])

    const [isFilter, setIsFilter] = useState<boolean>(false)

    const [selectedAgencyStatusTypes, setSelectedAgencyStatusTypes] = useState<CheckboxValueType[]>([])
    const [selectedReviewStatusTypes, setSelectedReviewStatusTypes] = useState<CheckboxValueType[]>([])
    const agencyTypes = ['정상', '휴업', '폐업']
    const reviewTypes = ['완료', '대기중', '거절', '취소']

    const agencyStatusTypeArray: AgencyStatusType[] = []
    const reviewStatusTypeArray: AgencyReviewStatusType[] = []

    const fn_Closed = () => {
        const pIsFilter = getIsFilter({ minCreateDate: minCreateDate, maxCreateDate: maxCreateDate, minReviewedDate: minReviewedDate, maxReviewedDate: maxReviewedDate, reviewType: agencyReviewType, agencyStatusTypes: agencyStatusTypeArray, reviewStatusTypes: reviewStatusTypeArray })
        onClosed(minCreateDate, maxCreateDate, minReviewedDate, maxReviewedDate, agencyReviewType, agencyStatusTypes, reviewStatusTypes, pIsFilter)
    }

    const getIsFilter = ({ ...values }: any) => {
        let isReturn = false

        if (values.minCreateDate || values.maxCreateDate || values.minReviewedDate || values.maxReviewedDate || values.agencyReviewType || (values.agencyStatusTypes.length > 0) || (values.reviewStatusTypes.length > 0)) {
            isReturn = true
        }
        setIsFilter(isReturn)

        return isReturn
    }

    const getAgencyStatusType = (typeString: string) => {
        switch (typeString) {
            case '정상':
                return AgencyStatusType.영업
            case '휴업':
                return AgencyStatusType.휴업
            case '폐업':
                return AgencyStatusType.정지
            default:
                return null
        }
    }

    const getReviewStatusTypes = (typeString: string) => {
        switch (typeString) {
            case '완료':
                return AgencyReviewStatusType.수락
            case '대기중':
                return AgencyReviewStatusType.대기중
            case '거절':
                return AgencyReviewStatusType.거절
            case '취소':
                return AgencyReviewStatusType.취소
            default:
                return null
        }
    }

    const agencyColor = (title: string) => {
        switch (title) {
            case '정상':
                return '#20C997'
            case '휴업':
                return '#F59F00'
            case '폐업':
                return '#868E96'
            case '취소':
            default:
                return '#868E96'
        }
    }

    const color = (title: string) => {
        switch (title) {
            case '완료':
                return '#20C997'
            case '대기중':
                return '#4263EB'
            case '거절':
                return '#F03E3E'
            case '취소':
            default:
                return '#868E96'
        }
    }

    const 사업자등록번호 = (color: string, title: string) => {
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

    const 수락여부 = (color: string, title: string) => {
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

    const search = async (keyword: string, page: number = 0) => {
        setLoading(true)

        form.validateFields().then(async (values) => {
            map(selectedReviewStatusTypes, (u) => {
                reviewStatusTypeArray.push(getReviewStatusTypes(u.toString()))
            })
            map(selectedAgencyStatusTypes, (u) => {
                agencyStatusTypeArray.push(getAgencyStatusType(u.toString()))
            })

            let agencyReviewType: AgencyReviewType
            switch (values.agencyReviewType) {
                case true:
                    agencyReviewType = AgencyReviewType.등록
                    break
                case false:
                    agencyReviewType = AgencyReviewType.변경
                    break
                default:
                    agencyReviewType = null
                    break
            }

            let lMinCreateDate: Date = null
            let lMaxCreateDate: Date = null
            if (values.createAt != null) {
                lMinCreateDate = values.createAt[0].format("YYYY-MM-DD")
                lMaxCreateDate = values.createAt[1].format("YYYY-MM-DD")
            }

            let lMinReviewDate: Date = null
            let lMaxReviewDate: Date = null
            if (values.reviewedDate != null) {
                lMinReviewDate = values.reviewedDate[0].format("YYYY-MM-DD")
                lMaxReviewDate = values.reviewedDate[1].format("YYYY-MM-DD")
            }

            const response = await AgencyReviewService.search({ minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, minReviewedDate: lMinReviewDate, maxReviewedDate: lMaxReviewDate, reviewType: agencyReviewType, agencyStatusTypes: agencyStatusTypeArray, reviewStatusTypes: reviewStatusTypeArray, keyword: keyword, page: page })
            if (response.status === 200) {
                const pIsFilter = getIsFilter({ minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, minReviewedDate: lMinReviewDate, maxReviewedDate: lMaxReviewDate, reviewType: agencyReviewType, agencyStatusTypes: agencyStatusTypeArray, reviewStatusTypes: reviewStatusTypeArray })
                setLoading(false)
                onCompleted(response.data.result, lMinCreateDate, lMaxCreateDate, lMinReviewDate, lMaxReviewDate, agencyReviewType, agencyStatusTypeArray, reviewStatusTypeArray, pIsFilter)
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
                                form.resetFields()
                                setTypes([])
                                setSelectedReviewStatusTypes([])
                                setSelectedAgencyStatusTypes([])
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
                form={form}
                layout="vertical"
                style={{ marginTop: '2em' }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>구분</Typography.Text>
                            <Form.Item
                                name="agencyReviewType"
                                style={{ marginBottom: 0 }}
                            >
                                <Radio.Group>
                                    <Radio value={''}>
                                        <Typography.Text>전체</Typography.Text>
                                    </Radio>
                                    <Radio value={true}>
                                        <Typography.Text>승인</Typography.Text>
                                    </Radio>
                                    <Radio value={false}>
                                        <Typography.Text>변경</Typography.Text>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>신청일자</Typography.Text>
                            <Form.Item
                                name="range"
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
                            <Typography.Text>사업자 등록번호</Typography.Text>
                            <Form.Item
                                name="agencyStatusTypes"
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <Checkbox
                                        onChange={(e: CheckboxChangeEvent) => {
                                            setSelectedAgencyStatusTypes(e.target.checked ? agencyTypes : [])
                                        }}
                                        checked={agencyTypes.length === selectedAgencyStatusTypes.length}
                                    >
                                        전체
                                    </Checkbox>
                                    {agencyTypes.map((v) => {
                                        return (
                                            <Checkbox
                                                key={v}
                                                value={v}
                                                checked={selectedAgencyStatusTypes.includes(v)}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    setSelectedAgencyStatusTypes(e.target.checked ? [...selectedAgencyStatusTypes, v] : selectedAgencyStatusTypes.filter(t => t !== v))
                                                }}
                                            >
                                                {사업자등록번호(agencyColor(v), v)}
                                            </Checkbox>
                                        )
                                    })}
                                </Space>
                            </Form.Item>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>처리일자</Typography.Text>
                            <Form.Item
                                name="reviewedDate"
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
                            <Typography.Text>수락여부</Typography.Text>
                            <Form.Item
                                name="reviewStatusTypes"
                                style={{ marginBottom: 0 }}
                            >
                                <Space>
                                    <Checkbox
                                        onChange={(e: CheckboxChangeEvent) => {
                                            setSelectedReviewStatusTypes(e.target.checked ? reviewTypes : [])
                                        }}
                                        checked={reviewTypes.length === selectedReviewStatusTypes.length}
                                    >
                                        전체
                                    </Checkbox>
                                    {reviewTypes.map((v) => {
                                        return (
                                            <Checkbox
                                                key={v}
                                                value={v}
                                                checked={selectedReviewStatusTypes.includes(v)}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    setSelectedReviewStatusTypes(e.target.checked ? [...selectedReviewStatusTypes, v] : selectedReviewStatusTypes.filter(t => t !== v))
                                                }}
                                            >
                                                {수락여부(color(v), v)}
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