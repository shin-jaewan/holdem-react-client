import { Errors } from "@contexts/ErrorContext"
import { UserService } from "@services/UserService"
import { WebappService } from "@services/WebappService"
import Patterns from "@statics/patterns"
import { Button, Col, Form, Input, Modal, Row, Select, Space, message } from "antd"
import React, { Dispatch, FunctionComponent, SetStateAction, useState } from "react"

interface IProps {
    show: boolean,
    onClosed: () => void
    onSuccess: () => void
}

export const RegisterUserModal: FunctionComponent<IProps> = (props) => {
    const { show, onClosed, onSuccess, } = props

    const [form] = Form.useForm()

    const [isLoading, setLoading] = useState<boolean>(false)
    const [isLoginIdExist, setLoginIdExist] = useState<boolean>(true)
    const [isPhoneExist, setPhoneExist] = useState<boolean>(true)
    const [isEmailExist, setEmailExist] = useState<boolean>(true)
    const [messageApi, contextHolder] = message.useMessage();

    const handleSubmit = async () => {
        Modal.confirm({
            title: '회원을 추가 하시겠습니까?',
            okText: "확인",
            cancelText: "취소",
            onOk: async () => {
                setLoading(true);
                form
                    .validateFields()
                    .then(async (values) => {
                        if (values.password !== values.passwordConfirm) {
                            messageApi.error('비밀번호와 비밀번호 확인이 같지않습니다. 다시 입력해 주세요')
                            setLoading(false)
                            return
                        }
                        let birthday = values?.birthday || null;
                        if (birthday) {
                            const regex = /^(\d{4})(\d{2})(\d{0,6})$/;
                            birthday = birthday.replace(regex, (_: any, p1: any, p2: any, p3: any) => {
                                if (p3) {
                                    return `${p1}-${p2}-${p3}`;
                                } else {
                                    return `${p1}-${p2}`;
                                }
                            });
                        }
                        const bindModel = {
                            ...values,
                            birthday,
                        }

                        const response = await UserService.Agent.create(bindModel)
                        if (response.status === 200) {
                            messageApi.info('회원이 생성되었습니다.')
                            onSuccess();
                            onClosed();
                        } else {
                            Errors.FormError(form, response.data)
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

    const handleExist = async (key: string, handler: any, callback: Dispatch<SetStateAction<boolean>>, error: string) => {
        setLoading(true)
        form
            .validateFields([key])
            .then(async (values) => {
                const response = await handler(values[key])
                if (response.status === 200) {
                    if (response.data.result) {
                        messageApi.info(error)
                    } else {
                        callback(response.data.result)
                    }
                } else {
                    Errors.FormError(form, response.data)
                }
                setLoading(false)
            })
            .catch((e) => {
                console.log('error', e)
                setLoading(false)
            })
    }

    return (
        <Modal
            title='회원 추가하기'
            open={show}
            onOk={async () => {
                handleSubmit()
            }}
            onCancel={onClosed}
        >
            {contextHolder}
            <Row justify={'center'} align={'middle'}>
                <Col
                    style={{
                        textAlign: 'center',
                    }}
                    span={24}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        style={{ marginTop: '3em' }}
                    >
                        <Form.Item
                            label="아이디"
                            name="loginId"
                            rules={[{ required: true, message: "아이디를 입력하세요" }]}
                        >
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    placeholder="아이디를 입력하세요"
                                    onChange={() => {
                                        setLoginIdExist(true)
                                    }}
                                />
                                {isLoginIdExist && (
                                    <Button
                                        type="primary"
                                        loading={isLoading}
                                        onClick={() => {
                                            handleExist(
                                                'loginId',
                                                WebappService.existLoginId,
                                                setLoginIdExist,
                                                '존재하는 아이디입니다. 다른 아이디를 입력해 주세요.'
                                            )
                                        }}
                                    >
                                        중복체크
                                    </Button>
                                )}
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item
                            label="비밀번호"
                            name="password"
                            rules={[
                                { required: true, message: "비밀번호를 입력하세요" },
                                { min: 8, message: "8글자 이상 입력해 주세요" },
                                { max: 20, message: "20글자 이하로 입력해 주세요" },
                                { pattern: Patterns.password, message: "영문 대소문자/숫자/특수문자 2가지 이상 조합(8~20자)해 주세요" },
                            ]}
                        >
                            <Input.Password
                                placeholder="비밀번호를 입력하세요"
                            />
                        </Form.Item>
                        <Form.Item
                            label="비밀번호 확인"
                            name="passwordConfirm"
                            rules={[
                                { required: true, message: "비밀번호 확인을 입력하세요" },
                                { min: 8, message: "8글자 이상 입력해 주세요" },
                                { max: 20, message: "20글자 이하로 입력해 주세요" },
                                ({ getFieldValue }) => ({
                                    validator(_, value) {
                                        if (!value || getFieldValue('password') === value) {
                                            return Promise.resolve();
                                        }
                                        return Promise.reject(new Error('비밀번호가 일치하지 않습니다. 확인해 주세요'));
                                    },
                                }),
                            ]}
                        >
                            <Input.Password
                                placeholder="비밀번호 확인을 입력하세요"
                            />
                        </Form.Item>
                        <Form.Item
                            label="이름"
                            name="userName"
                            rules={[{ required: true, message: "이름을 입력하세요" }]}
                        >
                            <Input
                                placeholder="이름을 입력하세요"
                            />
                        </Form.Item>
                        <Form.Item
                            label="휴대폰번호"
                            name="mobilePhone"
                            rules={[{ required: true, message: "휴대폰번호를 입력하세요" }]}
                        >
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    style={{ width: '100%' }}
                                    placeholder="휴대폰번호를 입력하세요(숫자만)"
                                    onChange={() => {
                                        setPhoneExist(true)
                                    }}
                                />
                                {isPhoneExist && (
                                    <Button
                                        type="primary"
                                        loading={isLoading}
                                        onClick={() => {
                                            handleExist(
                                                'mobilePhone',
                                                WebappService.existPhone,
                                                setPhoneExist,
                                                '존재하는 휴대폰번호입니다. 다른 휴대폰번호를 입력해 주세요.'
                                            )
                                        }}
                                    >
                                        중복체크
                                    </Button>
                                )}
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item
                            label="이메일"
                            name="email"
                            rules={[{ required: true, message: "이메일을 입력하세요" }]}
                        >
                            <Space.Compact style={{ width: '100%' }}>
                                <Input
                                    placeholder="이메일을 입력하세요"
                                    onChange={() => {
                                        setEmailExist(true)
                                    }}
                                />
                                {isEmailExist && (
                                    <Button
                                        type="primary"
                                        loading={isLoading}
                                        onClick={() => {
                                            handleExist(
                                                'email',
                                                WebappService.existEmail,
                                                setEmailExist,
                                                '존재하는 이메일입니다. 다른 이메일을 입력해 주세요.'
                                            )
                                        }}
                                    >
                                        중복체크
                                    </Button>
                                )}
                            </Space.Compact>
                        </Form.Item>
                        <Form.Item
                            name="genderType"
                            label="성별"
                        >
                            <Select style={{ minWidth: 120, textAlign: 'left' }} defaultValue={'NONE'}>
                                <Select.Option value={"NONE"}>NONE</Select.Option>
                                <Select.Option value={"여자"}>여자</Select.Option>
                                <Select.Option value={"남자"}>남자</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            label="생년월일"
                            name="birthday"
                            rules={[{ max: 8, min: 8, message: "생년월일을 입력해주세요" }]}
                        >
                            <Input
                                placeholder="YYYYMMDD"
                                maxLength={8}
                            />
                        </Form.Item>
                    </Form>
                </Col>
            </Row>
        </Modal>
    )
}