import { AgencyNewSourceBindingModel } from "@binding-model/AgencyNewSourceBindingModel"
import { Errors } from "@contexts/ErrorContext"
import { RegionModel } from "@model/RegionModel"
import { AgencyService } from "@services/AgencyService"
import { RegionService } from "@services/RegionService"
import { AgencyStatusType } from "@type/AgencyStatusType"
import { SaEopJaStatusType } from "@type/SaEopJaStatusType"
import { Button, Col, DatePicker, Form, Input, InputNumber, Modal, Radio, Row, Select, Space, Tag, Typography, message, notification } from "antd"
import React, { FunctionComponent, useEffect, useState } from "react"
import { InfoCircleOutlined } from '@ant-design/icons'
import { AgencyModel } from "@model/AgencyModel"
import { AgencySourceService } from "@services/AgencySourceService"

interface IProps {
    show: boolean
    onCompleted: (data: Array<AgencyModel.IAgencyNewSourceModel>, gaeSeolDeungRokBeonHo: string, saEopJaSangHo: string, jungGaeEopJaMyeong: string, regionParam: RegionModel.IRegionCodeModel) => void
    onClosed: (gaeSeolDeungRokBeonHo: string, saEopJaSangHo: string, jungGaeEopJaMyeong: string, regionParam: RegionModel.IRegionCodeModel) => void
    gaeSeolDeungRokBeonHo: string
    saEopJaSangHo: string
    jungGaeEopJaMyeong: string
    regionParam: RegionModel.IRegionCodeModel
}

export const AgencyNewSourceFilterModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, gaeSeolDeungRokBeonHo, saEopJaSangHo, jungGaeEopJaMyeong, regionParam } = props

    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [region, setRegion] = useState<RegionModel.IRegionCodeModel>(regionParam)
    // const [messageApi, contextHolder] = notification.useNotification()
    const [messageApi, contextHolder] = message.useMessage();

    const fn_Closed = () => {
        onClosed(gaeSeolDeungRokBeonHo, saEopJaSangHo, jungGaeEopJaMyeong, region)
    }

    const search = async () => {
        if (!region?.siGunGuCode) {
            messageApi.warning(`지역정보는 필수 값입니다.`);
            return
        }

        if (gaeSeolDeungRokBeonHo == null && saEopJaSangHo == null && jungGaeEopJaMyeong == null) {
            messageApi.warning(`최소 한개 이상의 상세 조건를 입력해주세요.`);
            return
        }

        setLoading(true)
        form.validateFields().then(async (values) => {
            const model: AgencyNewSourceBindingModel.ISearch = {
                siDoCode: region.siDoCode,
                siGunGuCode: region.siGunGuCode,
                gaeSeolDeungRokBeonHo: values.gaeSeolDeungRokBeonHo,
                saEopJaSangHo: values.saEopJaSangHo,
                jungGaeEopJaMyeong: values.jungGaeEopJaMyeong
            }

            const response = await AgencySourceService.searchNewSource(model)
            if (response.status === 200) {
                setLoading(false)
                onCompleted(response.data.result as Array<AgencyModel.IAgencyNewSourceModel>, gaeSeolDeungRokBeonHo, saEopJaSangHo, jungGaeEopJaMyeong, region)
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
            closeIcon={false}
            title={(
                <Row>
                    <Col span={12}>
                        <Typography.Title level={2}>상세필터</Typography.Title>
                    </Col>
                    <Col span={12} style={{ textAlign: 'end' }}>
                        <Typography.Link
                            onClick={() => {
                                form.resetFields()
                                setRegion({ siDoCode: null, siGunGuCode: null, eupMyeonDongCode: null })
                            }}
                        >
                            <Typography.Text type="secondary" underline>초기화</Typography.Text>
                        </Typography.Link>
                    </Col>
                </Row>
            )}
            footer={(
                <Space style={{ marginTop: '1em' }}>
                    <Button loading={isLoading} danger onClick={fn_Closed}>
                        취소
                    </Button>
                    <Button loading={isLoading} type="primary" onClick={() => search()}>
                        검색
                    </Button>
                </Space>
            )}
            width={'50%'}
        >
            {contextHolder}
            <Form
                form={form}
                layout="vertical"
                style={{ marginTop: '2em' }}
            >
                <Row gutter={[16, 16]}>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>소재지</Typography.Text>
                            <Space direction="vertical">
                                <소재지
                                    key={`article-region`}
                                    region={region}
                                    onSelected={(region) => {
                                        setRegion(region)
                                    }}
                                />
                            </Space>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Space split={' '}>
                                <Form.Item label="중개업소 상호" name="saEopJaSangHo" >
                                    <Input placeholder="상호" />
                                </Form.Item>
                                <Form.Item label="중개업소 대표자 이름" name="jungGaeEopJaMyeong" >
                                    <Input placeholder="대표자 이름" />
                                </Form.Item>
                                <Form.Item label="중개업소 등록번호" name="gaeSeolDeungRokBeonHo" >
                                    <Input placeholder="등록번호" />
                                </Form.Item>
                            </Space>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

const 소재지 = ({ region, onSelected }: {
    region: RegionModel.IRegionCodeModel
    onSelected: (region: RegionModel.IRegionCodeModel) => void
}) => {
    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState(false)

    const [시도, set시도] = useState<Array<RegionModel.IRegionModel>>([])
    const [시군구, set시군구] = useState<Array<RegionModel.IRegionModel>>([])

    const get시도 = async () => {
        setLoading(true)

        const response = await RegionService.시도()
        if (response.status === 200) {
            set시도(response.data.result)
            setLoading(false)
            if (region?.siDoCode) {
                form.setFieldsValue({
                    main: region.siDoCode,
                })
            }
        } else {
            setLoading(false)
            Errors.AjaxError(response.data)
        }
    }

    const get시군구 = async (code: string) => {
        setLoading(true)

        const response = await RegionService.시군구(code)
        if (response.status === 200) {
            let result = response.data.result as Array<RegionModel.IRegionModel>
            set시군구(result)
            setLoading(false)
            form.setFieldsValue({
                sub: region?.siGunGuCode || null,
            })
        } else {
            setLoading(false)
            Errors.AjaxError(response.data)
        }
    }

    useEffect(() => {
        if (!시도 || 시도.length == 0) {
            get시도()
        }

        if (region?.siDoCode) {
            get시군구(region.siDoCode)
        }
    }, [region])

    return (
        <Form
            form={form}
            layout="vertical"
        >
            <Space>
                <Form.Item
                    name="main"
                    style={{ marginBottom: 0 }}
                >
                    <Select
                        loading={isLoading}
                        style={{ minWidth: 180, }}
                        onChange={(e) => {
                            set시군구([])
                            form.setFieldsValue({
                                sub: null,
                                reserve: null,
                            })
                            get시군구(e)
                            onSelected({ siDoCode: e, siGunGuCode: null, eupMyeonDongCode: null })
                        }}
                        options={시도?.map((r) => {
                            return { value: r.code, label: r.name }
                        })}
                        placeholder={'시도'}
                    />
                </Form.Item>
                <Form.Item
                    name="sub"
                    style={{ marginBottom: 0 }}
                >
                    <Select
                        loading={isLoading}
                        disabled={!region?.siDoCode}
                        style={{ minWidth: 180, }}
                        onChange={(e: string) => {
                            onSelected({ ...region, siGunGuCode: e, eupMyeonDongCode: null })
                        }}
                        options={시군구?.map((r) => {
                            return { value: r.code, label: r.name }
                        })}
                        placeholder={'시군구'}
                    />
                </Form.Item>
            </Space>
        </Form>
    )
}