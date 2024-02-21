import { DownOutlined } from '@ant-design/icons'
import { Path } from '@config/Path'
import { useAuth } from '@hooks/Auth'
import { useOverlay } from '@toss/use-overlay'
import LocalStorageUtility from '@utils/LocalStorageUtility'
import { Col, Dropdown, Modal, Row, Space, Typography } from 'antd'
import React, { FunctionComponent, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export const Header: FunctionComponent = () => {
    const navigator = useNavigate()
    const { user, handler, } = useAuth()
    const overlay = useOverlay();

    return (
        <Row align={'middle'}>
            <Col span={24} style={{ paddingTop: 20, paddingBottom: 20, textAlign: 'right', paddingRight: 20, borderBottom: '1px solid #0505050f', }}>
                <Dropdown menu={{
                    items: [
                        {
                            key: 1,
                            label: (
                                <Typography.Link
                                    onClick={() => {
                                        overlay.open(({ isOpen, close }) => (
                                            <Modal
                                                open={isOpen}
                                                onOk={() => {
                                                    handler.logout()
                                                }}
                                                onCancel={close}
                                            >
                                                <p>로그아웃 하시겠습니까?</p>
                                            </Modal>
                                        ));
                                    }}
                                >
                                    로그아웃
                                </Typography.Link>
                            ),
                        },
                        {
                            key: 2,
                            label: (
                                <Link to={Path.user.change_profile}>회원정보</Link>
                            ),
                        },
                        {
                            key: 3,
                            label: (
                                <Link to={Path.user.password}>비밀번호 변경</Link>
                            ),
                        }
                    ]
                }}>
                    <Space>
                        <Typography.Text>v1.0.1</Typography.Text>
                        <Typography.Text strong>{user?.user?.userName}</Typography.Text>
                        <DownOutlined />
                    </Space>
                </Dropdown>
            </Col>
        </Row>
    )
}