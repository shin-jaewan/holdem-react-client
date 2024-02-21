import { Path } from "@config/Path"
import { Errors } from "@contexts/ErrorContext"
import { ReportModel } from "@model/ReportModel"
import { ReportService } from "@services/ReportService"
import { Button, Col, Descriptions, Form, Modal, Radio, Row, Space, Spin, Tag, Typography } from "antd"
import React, { FunctionComponent, useEffect, useState } from "react"

interface IProps {
    id: string
    show: boolean
    onCompleted: () => void
    onClosed: () => void
}

export const ChangeReportArticleStatusModal: FunctionComponent<IProps> = (props) => {
    const { id, show, onCompleted, onClosed } = props

    const [isLoading, setLoading] = useState<boolean>(false)
    const [report, setReport] = useState<ReportModel.IReportArticleModel>()

    const [form] = Form.useForm()

    const detail = async () => {
        setLoading(true)

        const response = await ReportService.detail(id)
        if (response.status === 200) {
            const result = response.data.result
            setReport(result)
            setLoading(false)
        } else {
            setLoading(false)
            Errors.AjaxError(response.data)
        }
    }

    const handleStatus = () => {
        Modal.confirm({
            title: `상태를 변경하시겠습니까?`,
            okText: "확인",
            cancelText: "취소",
            onOk: async () => {
                form
                    .validateFields()
                    .then(async (values) => {
                        setLoading(true)
                        const response = await ReportService.changeStatus({ complainId: id, ...values })
                        if (response.status === 200) {
                            onCompleted()
                        } else {
                            Errors.AjaxError(response.data)
                        }
                        setLoading(false)
                    })
                    .catch((e) => {
                        console.log('error', e)
                        setLoading(false)
                    })
            }
        })
    }

    useEffect(() => {
        detail()
    }, [])

    return (
        <Modal
            centered
            open={show}
            title={`신고 처리`}
            maskClosable={false}
            destroyOnClose={true}
            onCancel={() => { onClosed() }}
            footer={(
                <Space>
                    <Button loading={isLoading} danger onClick={() => { onClosed() }}>
                        취소
                    </Button>
                    <Button loading={isLoading} type="primary" onClick={handleStatus}>
                        설정
                    </Button>
                </Space>
            )}
            width={'50%'}
        >
            <Spin spinning={isLoading}>
                {report && (
                    <Row>
                        <Col span={24}>
                            <Descriptions bordered size='middle' style={{ marginTop: 12, }} labelStyle={{ width: 180 }} column={1}>
                                <Descriptions.Item label={'상태'}>
                                    {(() => {
                                        let color = '#868E96'
                                        switch (report.complainStatusType) {
                                            case '확인중':
                                                color = '#4263EB'
                                                break
                                            case '완료':
                                                color = '#20C997'
                                                break
                                        }

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
                                                <Typography.Text>{report.complainStatusType}</Typography.Text>
                                                {report.user && (
                                                    <Typography.Text style={{ color: '#868E96' }}>{`(${report.user?.userName})`}</Typography.Text>
                                                )}
                                            </Space>
                                        )
                                    })()}
                                </Descriptions.Item>
                                <Descriptions.Item label={'신고번호'}>{report.id}</Descriptions.Item>
                                <Descriptions.Item label={'매물 소유자 아이디'}>{report.articleCreator?.loginId}</Descriptions.Item>
                                <Descriptions.Item label={'매물 정보'}>
                                    {/* {(() => {
                                        const article = report.article ? report.article : report.articleFind

                                        return (
                                            <Space direction='vertical'>
                                                <Tag color='orange-inverse'>{article.articleCategoryMainType}</Tag>
                                                <Typography.Text>{`매물번호: ${article.id}`}</Typography.Text>
                                                {article.articleAddressInfo?.danJiMyeong && (
                                                    <Typography.Text>
                                                        {report.article.articleAddressInfo.danJiMyeong}
                                                    </Typography.Text>
                                                )}
                                                <Space>
                                                    <Typography.Text strong>{article.articleAddressInfo?.doRoMyeongJuSo}</Typography.Text>
                                                    {article.articleAddressInfo?.dong && (
                                                        <Typography.Text strong>{`${article.articleAddressInfo?.dong}동`}</Typography.Text>
                                                    )}
                                                    {article.articleAddressInfo?.ho && (
                                                        <Typography.Text strong>{`${article.articleAddressInfo?.ho}호`}</Typography.Text>
                                                    )}
                                                </Space>
                                            </Space>
                                        )
                                    })()} */}

                                    {report.articleFind && (
                                        <Space direction='vertical'>
                                            <Typography.Text>{`번호: ${report.articleFind.id}`}</Typography.Text>
                                            <Space>
                                                {report.articleFind.articleCategoryMainTypes?.map((r) => {
                                                    return (
                                                        <Tag color='blue-inverse'>{r.articleCategoryMainType}</Tag>
                                                    )
                                                })}
                                            </Space>
                                            <Typography.Text>{`제목: ${report.articleFind.title}`}</Typography.Text>
                                            <Space direction='vertical'>
                                                {report.articleFind?.articleFindRegions?.length > 0 && (
                                                    report.articleFind?.articleFindRegions?.map((r) => {
                                                        return (
                                                            <Typography.Text>
                                                                {`${r.regionDetail?.siDoName} ${r.regionDetail?.siGunGuName} ${r.regionDetail?.eupMyeonDongName} ${r.regionDetail?.liName ?? ''}`}
                                                            </Typography.Text>
                                                        )
                                                    })
                                                )}
                                            </Space>
                                        </Space>
                                    )}

                                    {report.article && (
                                        <Space direction='vertical'>
                                            <Tag color='orange-inverse'>{report.article.articleCategoryMainType}</Tag>
                                            <Typography.Text>{`매물번호: ${report.article.id}`}</Typography.Text>
                                            {report.article.articleAddressInfo?.danJiMyeong && (
                                                <Typography.Text>
                                                    {report.article.articleAddressInfo.danJiMyeong}
                                                </Typography.Text>
                                            )}
                                            <Space>
                                                <Typography.Text strong>{report.article.articleAddressInfo?.doRoMyeongJuSo}</Typography.Text>
                                                {report.article.articleAddressInfo?.dong && (
                                                    <Typography.Text strong>{`${report.article.articleAddressInfo?.dong}동`}</Typography.Text>
                                                )}
                                                {report.article.articleAddressInfo?.ho && (
                                                    <Typography.Text strong>{`${report.article.articleAddressInfo?.ho}호`}</Typography.Text>
                                                )}
                                            </Space>
                                        </Space>
                                    )}

                                </Descriptions.Item>
                                <Descriptions.Item label={'매물종류'}>
                                    {(() => {
                                        let color = '#555';
                                        switch (report.complainType) {
                                            case '매물찾기':
                                                color = '#20C997'
                                                break
                                            case '공동중개':
                                                color = '#4263EB'
                                                break
                                        }

                                        return <Typography.Text
                                            strong
                                            style={{ color: color }}
                                            className="cursor-pointer"
                                            onClick={() => {
                                                switch (report.complainType) {
                                                    case '매물찾기':
                                                        window.open(Path.findings.detail.replaceAll(':id', `${report?.articleFind?.id}`))
                                                        break
                                                    case '공동중개':
                                                        window.open(Path.user.agent.user_detail.replaceAll(':id', `${report?.article?.id}`))
                                                        break
                                                }
                                            }}
                                        >{report.complainType}</Typography.Text>
                                    })()}
                                </Descriptions.Item>
                                <Descriptions.Item label={'신고사유'}>{report.complainReasonType}</Descriptions.Item>
                                <Descriptions.Item label={'신고내용'} style={{ whiteSpace: 'pre-wrap' }}>{report.message}</Descriptions.Item>
                            </Descriptions>
                        </Col>
                        <Col span={24}>
                            <Form
                                form={form}
                                layout="vertical"
                                style={{ marginTop: '2em' }}
                            >
                                <Form.Item
                                    label="상태"
                                    name="complainStatusType"
                                    rules={[{ required: true, message: "상태를 선택하세요" }]}
                                >
                                    <Radio.Group>
                                        <Radio value={'대기중'}>
                                            <Space>
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#868E96'
                                                    }}
                                                />
                                                <Typography.Text>대기</Typography.Text>
                                            </Space>
                                        </Radio>
                                        <Radio value={'확인중'}>
                                            <Space>
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#4263EB'
                                                    }}
                                                />
                                                <Typography.Text>확인중</Typography.Text>
                                            </Space>
                                        </Radio>
                                        <Radio value={'완료'}>
                                            <Space>
                                                <div
                                                    style={{
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: 4,
                                                        backgroundColor: '#20C997'
                                                    }}
                                                />
                                                <Typography.Text>완료</Typography.Text>
                                            </Space>
                                        </Radio>
                                    </Radio.Group>
                                </Form.Item>
                            </Form>
                        </Col>
                    </Row>
                )}
            </Spin>
        </Modal>
    )
}