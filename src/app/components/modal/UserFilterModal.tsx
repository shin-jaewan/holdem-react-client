import { Errors } from "@contexts/ErrorContext"
import { PaginationModel } from "@model/PaginationModel"
import { UserModel } from "@model/UserModel"
import { UserService } from "@services/UserService"
import { Button, Col, Form, InputNumber, Modal, Row, Space, Typography } from "antd"
import React, { FunctionComponent, useState } from "react"

interface IProps {
    show: boolean
    onCompleted: (page: PaginationModel.Paging<UserModel.IAgentUserModel>, minArticleCount: number, maxArticleCount: number, minArticleFindCount: number, maxArticleFindCount: number, isFilter: boolean) => void
    onClosed: (minArticleCount: number, maxArticleCount: number, minArticleFindCount: number, maxArticleFindCount: number, isFilter: boolean) => void
    keyword: string
    minArticleCount: number
    maxArticleCount: number
    minArticleFindCount: number
    maxArticleFindCount: number
}

export const UserFilterModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, minArticleCount, maxArticleCount, minArticleFindCount, maxArticleFindCount, keyword } = props

    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [isFilter, setIsFilter] = useState<boolean>(false)

    const fn_Closed = () => {
        const pIsFilter = getIsFilter({ minArticleCount: minArticleCount, maxArticleCount: maxArticleCount, minArticleFindCount: minArticleFindCount, maxArticleFindCount: maxArticleFindCount })
        onClosed(minArticleCount, maxArticleCount, minArticleFindCount, maxArticleFindCount, pIsFilter)
    }

    const getIsFilter = ({ ...values }: any) => {
        let isReturn = false

        if (values.minArticleCount || values.maxArticleCount || values.minArticleFindCount || values.maxArticleFindCount) {
            isReturn = true
        }
        setIsFilter(isReturn)

        return isReturn
    }

    const search = async (keyword: string, page: number = 0) => {
        setLoading(true)

        form.validateFields().then(async (values) => {
            const minArticleCountl = values.minArticleCount as number
            const maxArticleCountl = values.maxArticleCount as number
            const minArticleFindCountl = values.minArticleFindCount as number
            const maxArticleFindCountl = values.maxArticleFindCount as number

            // console.log(minArticleCountl)
            // console.log(maxArticleCountl)
            // console.log(minArticleFindCountl)
            // console.log(maxArticleFindCountl)

            // const response = await UserService.Agent.search({ ...values, minArticleCount: minArticleCountl, maxArticleCount: maxArticleCountl, minArticleFindCount: minArticleFindCountl, maxArticleFindCount: maxArticleFindCountl, keyword: keyword, page: page })
            const response = await UserService.Agent.search({ ...values, keyword: keyword, page: page })
            if (response.status === 200) {
                const pIsFilter = getIsFilter({ minArticleCount: minArticleCountl, maxArticleCount: maxArticleCountl, minArticleFindCount: minArticleFindCountl, maxArticleFindCount: maxArticleFindCountl })
                setLoading(false)
                onCompleted(response.data.result, minArticleCountl, maxArticleCountl, minArticleFindCountl, maxArticleFindCountl, pIsFilter)
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
                </Space >
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
                            <Typography.Text>공동중개</Typography.Text>
                            <Space split={'~'}>
                                <Form.Item
                                    name="minArticleCount"
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber addonAfter={'개'} />
                                </Form.Item>
                                <Form.Item
                                    name="maxArticleCount"
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber addonAfter={'개'} />
                                </Form.Item>
                            </Space>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>매물찾습니다</Typography.Text>
                            <Space split={'~'}>
                                <Form.Item
                                    name="minArticleFindCount"
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber addonAfter={'개'} />
                                </Form.Item>
                                <Form.Item
                                    name="maxArticleFindCount"
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber addonAfter={'개'} />
                                </Form.Item>
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Modal >
    )
}