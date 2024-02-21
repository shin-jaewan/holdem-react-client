import { Errors } from "@contexts/ErrorContext"
import { UserModel } from "@model/UserModel"
import { AdministratorService } from "@services/AdministratorService"
import { AdministratorRoleType } from "@type/AdministratorRoleType"
import { UserRoleType } from "@type/UserRoleType"
import { Button, Col, Descriptions, Form, Modal, Radio, Row, Space, Spin, Typography } from "antd"
import React, { FunctionComponent, useState } from "react"

interface IProps {
    administrator: UserModel.IAdministratorUserModel
    onCompleted: () => void
    onClosed: () => void
}

export const ChangeAdministratorUserRoleStatusModal: FunctionComponent<IProps> = (props) => {
    const { administrator, onCompleted, onClosed } = props

    const [isLoading, setLoading] = useState<boolean>(false)
    const [form] = Form.useForm()

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
                        const response = await AdministratorService.changeStatus({ userId: administrator.id, ...values })
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

    return (
        <Modal
            centered
            open={true}
            title={`운영자 상태 변경`}
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
                <Row>
                    <Col span={24}>
                        <Descriptions bordered size='middle' style={{ marginTop: 12, }} labelStyle={{ width: 180 }} column={1}>
                            <Descriptions.Item label={'번호'}>{administrator.id}</Descriptions.Item>
                            <Descriptions.Item label={'아이디'}>{administrator.loginId}</Descriptions.Item>
                            <Descriptions.Item label={'현재 상태'}>
                                {(() => {
                                    let color = '#868E96';

                                    switch (administrator.administratorRoleType) {
                                        case AdministratorRoleType.프롭라인_퇴사:
                                            color = '#000'
                                            break
                                        case AdministratorRoleType.프롭라인_관리자:
                                            color = '#20C997'
                                            break
                                        case AdministratorRoleType.프롭라인_직원:
                                            color = '#4263EB'
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
                                            <Typography.Text>{administrator.administratorRoleType?.replaceAll('_', ' ')}</Typography.Text>
                                        </Space>
                                    )
                                })()}
                            </Descriptions.Item>
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
                                name="administratorRoleType"
                                rules={[{ required: true, message: "상태를 선택하세요" }]}
                            >
                                <Radio.Group>
                                    <Radio value={AdministratorRoleType.프롭라인_퇴사}>
                                        <Space>
                                            <div
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: '#000'
                                                }}
                                            />
                                            <Typography.Text>퇴사</Typography.Text>
                                        </Space>
                                    </Radio>
                                    <Radio value={AdministratorRoleType.프롭라인_미인증_회원}>
                                        <Space>
                                            <div
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: '#868E96'
                                                }}
                                            />
                                            <Typography.Text>미인증</Typography.Text>
                                        </Space>
                                    </Radio>
                                    <Radio value={AdministratorRoleType.프롭라인_직원}>
                                        <Space>
                                            <div
                                                style={{
                                                    width: 8,
                                                    height: 8,
                                                    borderRadius: 4,
                                                    backgroundColor: '#4263EB'
                                                }}
                                            />
                                            <Typography.Text>직원</Typography.Text>
                                        </Space>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Form>
                    </Col>
                </Row>
            </Spin>
        </Modal>
    )
}