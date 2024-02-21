import MainLogo from '@assets/image/logo/main_logo.png'
import { useAuth } from '@hooks/Auth'
import { GameModel } from '@model/GameModel'
import { UserModel } from '@model/UserModel'
import { ContentLayout } from '@pages/layout/ContentLayout'
import { GameService } from '@services/GameService'
import { Button, Col, Form, Row } from 'antd'
import React, { FunctionComponent, useEffect, useState } from 'react'

export const Home: FunctionComponent = () => {
    const [form] = Form.useForm()
    const { host, hostAuth, guest, guestAuth } = useAuth()

    const [isLoading, setLoading] = useState<boolean>(false)
    const [game, setGame] = useState<GameModel.IGame>(null)

    useEffect(() => {
        console.log(host)
    }, [])

    const signUp = async () => {
        const model: UserModel.IHost = {
            이름: "jwshin",
            닉네임: "nick name",
            이메일: 'email@email.com',
            비밀번호: '12341234',
            휴대폰: '010-1234-1234',
            권한: "HOST",
        }

        const profile = await hostAuth.signUp(model)
        console.log(profile)
    }

    const login = async () => {
        const email = "email@email.com";
        const password = "12341234";

        const profile = await hostAuth.login(email, password)
        console.log(profile)
    }

    const profile = async () => {
        console.log(host)
    }

    const updateProfile = async () => {
        const profile = await hostAuth.update()
        console.log(profile)
    }

    const create = async () => {
        if (host) {
            const model: GameModel.IGame = {
                대회명: `첫번째 게임대회 - ${(new Date).getHours}`,
                일시: new Date(),
                장소: '프롭라인 개발실',
                hostId: host.id
            }

            const game = await GameService.Host.create(model)
            setGame(game)

            console.log(game)
        }
    }

    const update = async () => {
        if (host && game) {
            game.대회소개 = `변경되었음 - ${new Date()}`
            const result = await GameService.Host.update(game)
            setGame(result)
            console.log(result)
        }
    }

    const gameList = async () => {
        const gameList = await GameService.ALL.list()
        console.log(gameList)
    }

    const apply = async () => {
        if (!game) return;

        const model: UserModel.IGuest = {
            닉네임: '닉네임',
            휴대폰: '010-1234-1234',
            이메일: '010-1234-1234@email.com',
            비밀번호: '12341234',
            권한: 'GUEST'
        }

        // 게임 신청
        const gameId = game.id
        let guest1 = await GameService.Guest.apply(gameId, model)
        console.log(guest1)

        // // 회원 가입
        const guest2 = await guestAuth.signUp(model)
        console.log(guest2)
    }

    return (
        <ContentLayout>
            <Row justify={'center'} align={'middle'}>
                <Col
                    // {...{ lg: 24, xl: 24, xxl: 7, }}
                    style={{
                        textAlign: 'center',
                        padding: 50,
                        border: '1px solid #E9ECEF',
                        borderRadius: 16,
                    }}
                >
                    <img src={MainLogo} width={640} />
                    <Row gutter={[8, 8]} style={{ marginTop: "3em" }}>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={signUp} > 회원가입 </Button>
                        </Col>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={login} > 로그인</Button>
                        </Col>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={profile} > 프로필</Button>
                        </Col>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={updateProfile} > 프로필 갱신</Button>
                        </Col>
                    </Row>
                    <Row gutter={[8, 8]} style={{ marginTop: "3em" }}>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={create} > 게임생성 </Button>
                        </Col>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={update} > 게임변경 </Button>
                        </Col>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={gameList} > 게임목록 </Button>
                        </Col>
                        <Col span={6}>
                            <Button block type="primary" size='large' loading={isLoading} onClick={apply} > 게임신청</Button>
                        </Col>
                    </Row>
                </Col>
            </Row>
        </ContentLayout>
    )
}
