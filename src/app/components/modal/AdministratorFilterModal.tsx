import { Errors } from "@contexts/ErrorContext"
import { PaginationModel } from "@model/PaginationModel"
import { UserModel } from "@model/UserModel"
import { AdministratorService } from "@services/AdministratorService"
import { AdministratorRoleType } from "@type/AdministratorRoleType"
import { UserRoleType } from "@type/UserRoleType"
import { Button, Checkbox, Col, DatePicker, Form, Modal, Row, Space, Typography } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { map } from "lodash-es"
import React, { FunctionComponent, useState } from "react"

interface IProps {
    show: boolean
    onCompleted: (page: PaginationModel.Paging<UserModel.IAdministratorUserModel>, administratorRoleTypes: AdministratorRoleType[], minCreateDate: Date, maxCreateDate: Date, isFilter: boolean) => void
    onClosed: (administratorRoleTypes: AdministratorRoleType[], minCreateDate: Date, maxCreateDate: Date, isFilter: boolean) => void
    keyword: string
    administratorRoleTypes: AdministratorRoleType[]
    minCreateDate: Date
    maxCreateDate: Date
}

export const AdministratorFilterModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, keyword, administratorRoleTypes, minCreateDate, maxCreateDate } = props

    const [formFilter] = Form.useForm()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [types, setTypes] = useState<CheckboxValueType[]>([])
    const administratorRoleTypesArray: AdministratorRoleType[] = []

    const values = ['재직', '미승인', '퇴사']

    const [isFilter, setIsFilter] = useState<boolean>(false)

    const getIsFilter = ({ ...values }: any) => {
        let isReturn = false

        if (values.minCreateDate || values.maxCreateDate || (values.userRoleTypes.length > 0)) {
            isReturn = true
        }
        setIsFilter(isReturn)

        return isReturn
    }

    const getUserRoleType = (userRoleTypeString: string) => {
        switch (userRoleTypeString) {
            case '재직':
                return AdministratorRoleType.프롭라인_직원
            case '미승인':
                return AdministratorRoleType.프롭라인_미인증_회원
            case '퇴사':
                return AdministratorRoleType.프롭라인_퇴사
            default:
                return AdministratorRoleType.프롭라인_관리자
        }
    }

    const fn_Closed = () => {
        const pIsFilter = getIsFilter({ minCreateDate: minCreateDate, maxCreateDate: maxCreateDate, administratorRoleTypes: administratorRoleTypesArray, })
        onClosed(administratorRoleTypes, minCreateDate, maxCreateDate, pIsFilter)
    }

    const color = (title: string) => {
        switch (title) {
            case '재직':
                return '#20C997'
            case '미승인':
                return '#4263EB'
            case '퇴사':
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

    const search = async (keyword: string, page: number = 0) => {
        setLoading(true)

        formFilter.validateFields().then(async (values) => {
            map(types, (u) => {
                administratorRoleTypesArray.push(getUserRoleType(u.toString()))
            })

            let lMinCreateDate: Date = null
            let lMaxCreateDate: Date = null
            if (values.reportedAt != null) {
                lMinCreateDate = values.reportedAt[0].format("YYYY-MM-DD")
                lMaxCreateDate = values.reportedAt[1].format("YYYY-MM-DD")
            }

            const response = await AdministratorService.search({ minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, administratorRoleTypes: administratorRoleTypesArray, keyword: keyword, page: page })

            if (response.status === 200) {
                setLoading(false)
                const pIsFilter = getIsFilter({ minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, userRoleTypes: administratorRoleTypesArray, })
                onCompleted(response.data.result, administratorRoleTypesArray, lMinCreateDate, lMaxCreateDate, pIsFilter)
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
            onCancel={() => fn_Closed()}
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
                    <Button loading={isLoading} danger onClick={() => fn_Closed()}>
                        취소
                    </Button>
                    <Button loading={isLoading} type="primary" onClick={() => search(keyword)}>
                        설정
                    </Button>
                </Space >
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
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>가입일</Typography.Text>
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
                        <Space direction="vertical">
                            <Typography.Text>상태</Typography.Text>
                            <Form.Item
                                name="userRoleType"
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
        </Modal >
    )
}