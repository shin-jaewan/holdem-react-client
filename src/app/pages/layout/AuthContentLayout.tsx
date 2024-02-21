import { Path } from "@config/Path"
import { useAuth } from "@hooks/Auth"
import { Col, Row } from "antd"
import React, { FunctionComponent, ReactNode, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { ContentLayout } from "./ContentLayout"
import { Header } from "./Header"
import { Navigation } from "./Navigation"

interface IProps {
    navigationKey?: string
    openKey?: string
    children?: ReactNode
}

export const AuthContentLayout: FunctionComponent<IProps> = ({
    navigationKey,
    openKey,
    children,
}) => {
    const navigator = useNavigate()
    const { user } = useAuth()

    useEffect(() => {
        // if (!user) {
        //     navigator(Path.account.login)
        // }
    }, [])

    return (
        <ContentLayout align='top'>
            <Row>
                <Col {...{ lg: 6, xl: 3, xxl: 3 }}>
                    <Navigation
                        navigationKey={navigationKey}
                        openKey={openKey}
                    />
                </Col>
                <Col {...{ lg: 18, xl: 21, xxl: 21 }}>
                    <Header />
                    {children}
                </Col>
            </Row >
        </ContentLayout>
    )
}