import MainLogo from '@assets/image/logo/main_logo.png'
import GroupOrange from '@assets/svg/menu/group-orange.svg'
import Group from '@assets/svg/menu/group.svg'
import HouseOrange from '@assets/svg/menu/house-orange.svg'
import House from '@assets/svg/menu/house.svg'
import ReportOrange from '@assets/svg/menu/report-orange.svg'
import Report from '@assets/svg/menu/report.svg'
import SearchOrange from '@assets/svg/menu/search-orange.svg'
import Search from '@assets/svg/menu/search.svg'
import SettingOrange from '@assets/svg/menu/setting-orange.svg'
import Setting from '@assets/svg/menu/setting.svg'
import UserOrange from '@assets/svg/menu/user-orange.svg'
import User from '@assets/svg/menu/user.svg'
import { NavigationKey } from '@config/NavigationKey'
import { Path } from '@config/Path'
import { Col, Menu, Row, Typography } from 'antd'
import React, { FunctionComponent } from 'react'
import { Link } from 'react-router-dom'

interface IProps {
    navigationKey?: string
    openKey?: string
}


export const Navigation: FunctionComponent<IProps> = (props) => {
    const { navigationKey, openKey } = props

    function getItem(
        label: React.ReactNode,
        key?: React.Key | null,
        icon?: React.ReactNode,
        children?: any[],
    ): any {
        return {
            key,
            icon,
            children,
            label,
        } as any;
    }

    return (
        <Row>
            <Col
                span={24}
                style={{
                    textAlign: 'center',
                    borderRight: '1px solid #0505050f',
                    paddingTop: 20,
                    paddingBottom: 20,
                }}
            >
                <Typography.Link href='/'>
                    <img src={MainLogo} width={'70%'} style={{ maxWidth: 180 }} />
                </Typography.Link>
            </Col>
            <Col
                className='menu'
                span={24}
                style={{
                    height: '100vh',
                    borderInlineEnd: '1px solid rgba(5, 5, 5, 0.06)'
                }}
            >
                <Menu
                    defaultSelectedKeys={[navigationKey, openKey]}
                    defaultOpenKeys={[navigationKey]}
                    mode="inline"
                    items={[
                        getItem(
                            NavigationKey.agency.label,
                            NavigationKey.agency.key,
                            <img src={navigationKey === NavigationKey.agency.key ? HouseOrange : House} width={22} />,
                            [
                                getItem(
                                    <Link to={Path.agency.search}>
                                        {NavigationKey.agency.sub.management.label}
                                    </Link>,
                                    NavigationKey.agency.sub.management.key,
                                ),
                                getItem(
                                    <Link to={Path.agency.review}>
                                        {NavigationKey.agency.sub.review.label}
                                    </Link>,
                                    NavigationKey.agency.sub.review.key,
                                ),
                                getItem(
                                    <Link to={Path.agency.new_source}>
                                        {NavigationKey.agency.sub.source.label}
                                    </Link>,
                                    NavigationKey.agency.sub.source.key,
                                ),
                            ],
                        ),
                        getItem(
                            <Link to={Path.user.agent.search}>
                                {NavigationKey.user.label}
                            </Link>,
                            NavigationKey.user.key,
                            <img src={navigationKey === NavigationKey.user.key ? UserOrange : User} width={22} />,
                        ),
                        getItem(
                            NavigationKey.article.label,
                            NavigationKey.article.key,
                            <img src={navigationKey === NavigationKey.article.key ? GroupOrange : Group} width={22} />,
                            [
                                getItem(
                                    <Link to={Path.article.search}>
                                        {NavigationKey.article.sub.search.label}
                                    </Link>,
                                    NavigationKey.article.sub.search.key,
                                ),
                                getItem(
                                    <Link to={Path.building.search}>
                                        {NavigationKey.article.sub.building.label}
                                    </Link>,
                                    NavigationKey.article.sub.building.key,
                                ),
                            ],
                        ),
                        getItem(
                            <Link to={Path.findings.search}>
                                {NavigationKey.finding.label}
                            </Link>,
                            NavigationKey.finding.key,
                            <img src={navigationKey === NavigationKey.finding.key ? SearchOrange : Search} width={22} />,
                        ),
                        getItem(
                            <Link to={Path.report.search}>
                                {NavigationKey.report.label}
                            </Link>,
                            NavigationKey.report.key,
                            <img src={navigationKey === NavigationKey.report.key ? ReportOrange : Report} width={22} />,
                        ),
                        getItem(
                            NavigationKey.setting.label,
                            NavigationKey.setting.key,
                            <img src={navigationKey === NavigationKey.setting.key ? SettingOrange : Setting} width={22} />,
                            [
                                getItem(
                                    <Link to={Path.administrator.search}>
                                        {NavigationKey.setting.sub.administrator.label}
                                    </Link>,
                                    NavigationKey.setting.sub.administrator.key,
                                ),
                                getItem(
                                    <Link to={Path.notice.search}>
                                        {NavigationKey.setting.sub.notice.label}
                                    </Link>,
                                    NavigationKey.setting.sub.notice.key,
                                ),
                            ],
                        ),
                    ]}
                />
            </Col>
        </Row>
    )
}