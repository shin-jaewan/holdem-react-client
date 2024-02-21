import { Path } from "@config/Path"
import { Errors } from "@contexts/ErrorContext"
import { AgencyModel } from "@model/AgencyModel"
import { AgencyService } from "@services/AgencyService"
import { Button, Col, Descriptions, Divider, Form, Input, InputNumber, Modal, Row, Space, Table, Tag, Typography, message } from "antd"
import React, { FunctionComponent, useState } from "react"
import { Link } from "react-router-dom"

interface IProps {
    show: boolean
    onCompleted: () => void
    onClosed: () => void
    agencyId: number
    saEopJaSangHo: string
    doRoMyeongJuSo: string
    jungGaeEopJaMyeong: string
}

export const AgencyUserLinkModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, agencyId, saEopJaSangHo, doRoMyeongJuSo, jungGaeEopJaMyeong } = props

    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState(false)
    const [page, setPage] = useState<AgencyModel.IAgencyMemberModel[]>()

    const fn_Closed = () => {
        onClosed()
    }


    const search = async (page: number = 0) => {
        setLoading(true)

        form.validateFields().then(async (values) => {
            if (!values.loginId && !values.mobilePhone && !values.userName) {
                message.error("아이디, 휴대폰번호, 이름중 최소 한개 조건을 입력해주세요.", 2, () => { })
                return
            }
            
            const response = await AgencyService.candidates({ ...values, page: page, })
            if (response.status === 200) {
                setPage(response.data.result)
                setLoading(false)
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



    const agencyUserLink = async (userId: number) => {
        setLoading(true)

        form.validateFields().then(async (values) => {
            const response = await AgencyService.linkAgency({ agencyId: agencyId, userId: userId, page: page })
            if (response.status === 200) {
                search()
                message.info("연동완료하였습니다.", 2, () => { })
                setLoading(false)
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
            closeIcon={true}
            title={(
                <Row>
                    <Col span={12}>
                        <Typography.Title level={2}>관리자/구성원 연동</Typography.Title>
                    </Col>
                </Row>
            )}
            footer={(
                <Space style={{ marginTop: '1em' }}>
                </Space >
            )}
            width={'50%'}
        >
            <Form
                form={form}
                layout="vertical"
            >
                <Row>
                    <Col span={24} style={{ padding: 1, }}>
                        <Descriptions bordered size='middle' style={{ marginTop: 12, }} column={1}>
                            <Descriptions.Item labelStyle={{ width: 150, }} label={'상호'}>{saEopJaSangHo}</Descriptions.Item>
                            <Descriptions.Item labelStyle={{ width: 150, }} label={'대표자'}>{jungGaeEopJaMyeong}</Descriptions.Item>
                            <Descriptions.Item labelStyle={{ width: 150, }} label={'소재지'}>{doRoMyeongJuSo}</Descriptions.Item>
                        </Descriptions>
                    </Col>
                    <Col span={24}>
                        <Divider />
                    </Col>
                    <Col span={24}>
                        <Descriptions bordered size='middle' style={{ marginTop: 1, }} column={1}>
                            <Descriptions.Item labelStyle={{ width: 150, }} label={'아이디'} >
                                <Form.Item
                                    name="loginId"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ width: 150, }} label={'휴대폰번호'}>
                                <Form.Item
                                    name="mobilePhone"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                            </Descriptions.Item>
                            <Descriptions.Item labelStyle={{ width: 150, }} label={'이름'}>
                                <Form.Item
                                    name="userName"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Input style={{ width: '100%' }} />
                                </Form.Item>
                            </Descriptions.Item>
                        </Descriptions>

                    </Col>
                </Row>
                <Row>
                    <Col span={24}  >
                        <Space style={{ width: '100%', marginTop: '2em', marginBottom: '2em', alignItems: 'center', justifyContent: 'center', }}  >
                            <Button loading={isLoading} danger onClick={() => {
                                form.resetFields()
                            }}>
                                초기화
                            </Button>
                            <Button loading={isLoading} type="primary" onClick={() => search()}>
                                검색
                            </Button>
                        </Space >
                    </Col>
                </Row>
            </Form>
            <Row>
                <Col span={12}>
                    <Typography.Title level={3}>검색결과</Typography.Title>
                </Col>
            </Row>
            <Row>
                <Col span={24}>
                    <Table
                        rowKey={record => record.id}
                        // title={() => (
                        //     <Row>
                        //         <Col span={12}>
                        //             <strong>{`검색된 결과 총 ${page?.id ?? 0}개`}</strong>
                        //         </Col>
                        //     </Row>
                        // )}
                        // onRow={(record) => {
                        //     return {
                        //         onClick: () => {
                        //             // navigate(Path.agency.detail.replaceAll(':id', `${record.id}`))
                        //         },
                        //     }
                        // }}
                        pagination={false}
                        loading={isLoading}
                        // pagination={{
                        //     defaultCurrent: 1,
                        //     current: page?.currentPageIndex + 1,
                        //     total: page?.totalItemCount,
                        //     pageSize: page?.size,
                        //     onChange: async (page: number) => {
                        //         search(page - 1)
                        //     }
                        // }}
                        dataSource={page ?? []}
                        columns={[
                            {
                                title: "이름",
                                dataIndex: "userName",
                                key: "userName",
                                width: 150,
                            },
                            {
                                title: "아이디",
                                dataIndex: "loginId",
                                key: "loginId",
                                width: 100,
                                render: (id, record) => {
                                    return <Link
                                        target="_blank"
                                        to={Path.user.agent.user_detail.replaceAll(':id', `${record.id}`)}
                                    >
                                        <Typography.Text style={{ color: '#1677ff', }}>
                                            {id}
                                        </Typography.Text>
                                    </Link>
                                },
                            },
                            {
                                title: "휴대폰번호",
                                dataIndex: "mobilePhone",
                                key: "mobilePhone",
                                width: 100,
                            },
                            {
                                title: "상호",
                                dataIndex: "saEopJaSangHo",
                                key: "saEopJaSangHo",
                                width: 300,
                            },
                            {
                                title: '연동',
                                dataIndex: 'agency',
                                key: 'agency',
                                render: (number, record: AgencyModel.IAgencyMemberModel) => {
                                    let button = null
                                    if (record.agency?.saEopJaSangHo == null) {
                                        (
                                            button = <Button loading={isLoading} type="primary" onClick={() => agencyUserLink(record.id)}>
                                                연동
                                            </Button>
                                        )
                                    }
                                    else {
                                        button = <Tag>{record.agency?.saEopJaSangHo}</Tag>
                                    }

                                    return (
                                        <>
                                            {button}
                                        </>
                                    )
                                }
                            },
                        ]}
                    />
                </Col>
            </Row>
        </Modal >
    )
}