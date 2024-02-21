import MainLogo from '@assets/image/logo/main_logo.png'
import { useAuth } from '@hooks/Auth'
import { GameModel } from '@model/GameModel'
import { UserModel } from '@model/UserModel'
import { ContentLayout } from '@pages/layout/ContentLayout'
import { GameService } from '@services/GameService'
import { Button, Col, Form, Row } from 'antd'
import React, { FunctionComponent, useEffect, useState } from 'react'

export const Game: FunctionComponent = () => {
    const [form] = Form.useForm()

    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
    }, [])

    return (
        <ContentLayout>
            <Row justify={'center'} align={'middle'}>
                <Col
                    {...{ lg: 10, xl: 8, xxl: 7, }}
                    style={{
                        textAlign: 'center',
                        padding: 50,
                        border: '1px solid #E9ECEF',
                        borderRadius: 16,
                    }}
                >
                    <img src={MainLogo} width={240} />
                    <Row gutter={[8, 0]} style={{ marginTop: "3em" }}>
                    </Row>
                </Col>
            </Row>
        </ContentLayout>
    )
}
