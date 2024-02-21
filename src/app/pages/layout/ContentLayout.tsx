import { Col, Layout, Row, Typography } from "antd"
import React, { FunctionComponent, ReactNode } from "react"

interface IProps {
    children?: ReactNode
    align?: "middle" | "top" | "bottom" | "stretch"
}

export const ContentLayout: FunctionComponent<IProps> = ({
    align = "middle",
    children,
}) => {
    return (
        <Layout style={{ minHeight: "100vh" }}>
            <Row justify={"center"} align={align} style={{ height: '100vh' }}>
                <Col {...{ xs: 0, sm: 0, md: 0, lg: 24, xl: 24, xxl: 24, }}>
                    {children}
                </Col>
                <Col {...{ xs: 24, sm: 24, md: 24, lg: 0, xl: 0, xxl: 0, }} style={{ textAlign: 'center', marginTop: 100, }}>
                    <Typography.Title level={2}>
                        PC 환경에서 이용해 주세요
                    </Typography.Title>
                </Col>
            </Row>
        </Layout>
    )
}