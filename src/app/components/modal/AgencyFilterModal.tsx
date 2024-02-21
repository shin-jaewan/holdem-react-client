import { Errors } from "@contexts/ErrorContext"
import { AgencyModel } from "@model/AgencyModel"
import { PaginationModel } from "@model/PaginationModel"
import { RegionModel } from "@model/RegionModel"
import { AgencyService } from "@services/AgencyService"
import { RegionService } from "@services/RegionService"
import { AgencyStatusType } from "@type/AgencyStatusType"
import { SaEopJaStatusType } from "@type/SaEopJaStatusType"
import { Button, Col, DatePicker, Form, InputNumber, Modal, Radio, Row, Select, Space, Tag, Typography } from "antd"
import Checkbox, { CheckboxChangeEvent } from "antd/es/checkbox"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { findIndex, map } from "lodash-es"
import React, { FunctionComponent, useEffect, useState } from "react"

interface IProps {
    show: boolean
    onCompleted: (page: PaginationModel.Paging<AgencyModel.IAgencyModel>, minCreateDate: Date, maxCreateDate: Date, minAgencyMemberCount: number, maxAgencyMemberCount: number, saEopJaStatusTypes: SaEopJaStatusType[], agencyStatusTypes: AgencyStatusType[], siDoCodes: string[], siGunGuCodes: string[], eupMyeonDongCodes: string[], regionsParam: Array<{ sido?: string, sigungu?: string, eupMyeonDong?: string }>, isFilter: boolean) => void
    onClosed: (minCreateDate: Date, maxCreateDate: Date, minAgencyMemberCount: number, maxAgencyMemberCount: number, saEopJaStatusTypes: SaEopJaStatusType[], agencyStatusTypes: AgencyStatusType[], siDoCodes: string[], siGunGuCodes: string[], eupMyeonDongCodes: string[], regionsParam: Array<{ sido?: string, sigungu?: string, eupMyeonDong?: string }>, isFilter: boolean) => void
    keyword: string
    minCreateDate: Date
    maxCreateDate: Date
    minAgencyMemberCount: number
    maxAgencyMemberCount: number
    saEopJaStatusTypes: SaEopJaStatusType[]
    agencyStatusTypes: AgencyStatusType[]
    siDoCodes: string[]
    siGunGuCodes: string[]
    eupMyeonDongCodes: string[]
    regionsParam: Array<{ idx?: number, sido?: string, sigungu?: string, eupMyeonDong?: string }>
    searchCode: string
}

export const AgencyFilterModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, searchCode, keyword, minCreateDate, maxCreateDate, minAgencyMemberCount, maxAgencyMemberCount, saEopJaStatusTypes, agencyStatusTypes, siDoCodes, siGunGuCodes, eupMyeonDongCodes } = props

    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [regions, setRegions] = useState<Array<{ sido?: string, sigungu?: string, eupMyeonDong?: string }>>([
        { sido: null, sigungu: null, eupMyeonDong: null }
    ])

    const [isFilter, setIsFilter] = useState<boolean>(false)

    const [selectedSaEopJaStatusTypes, setSelectedAgencyStatusTypes] = useState<CheckboxValueType[]>([])
    const staticSaEopJaTypes = ['정상', '휴업', '폐업', '확인불가']
    const saEopJaStatusTypeArray: SaEopJaStatusType[] = []
    const agencyStatusTypeArray: AgencyStatusType[] = []
    const siDoCodeArray: string[] = []
    const siGunGuCodeArray: string[] = []
    const eupMyeonDongArray: string[] = []

    const fn_Closed = () => {
        const pIsFilter = getIsFilter({ searchCode: searchCode, minCreateDate: minCreateDate, maxCreateDate: maxCreateDate, minAgencyMemberCount: minAgencyMemberCount, maxAgencyMemberCount: maxAgencyMemberCount, agencyStatusTypes: agencyStatusTypeArray, siDoCodes: siDoCodeArray, siGunGuCodes: siGunGuCodeArray, eupMyeonDongCodes: eupMyeonDongArray })
        onClosed(minCreateDate, maxCreateDate, minAgencyMemberCount, maxAgencyMemberCount, saEopJaStatusTypes, agencyStatusTypes, siDoCodes, siGunGuCodes, eupMyeonDongCodes, regions, pIsFilter)
    }

    const getIsFilter = ({ ...values }: any) => {
        let isReturn = false

        if (values.minCreateDate || values.maxCreateDate || values.minAgencyMemberCount || values.maxAgencyMemberCount || (values.agencyStatusTypes.length > 0) || (values.siDoCodes.length > 0) || (values.siGunGuCodes.length > 0) || (values.eupMyeonDongCodes.length > 0)) {
            isReturn = true
        }
        setIsFilter(isReturn)

        return isReturn
    }

    const getAgencyStatusType = (typeString: string) => {
        switch (typeString) {
            case '정상':
                return AgencyStatusType.영업
            case '휴업':
                return AgencyStatusType.휴업
            case '폐업':
                return AgencyStatusType.정지
            case "확인불가":
                return AgencyStatusType.확인불가
            default:
                return null
        }
    }

    const agencyColor = (title: string) => {
        switch (title) {
            case '정상':
                return '#20C997'
            case '휴업':
                return '#F59F00'
            case '폐업':
                return '#868E96'
            case '취소':
            default:
                return '#868E96'
        }
    }

    const 사업자등록번호 = (color: string, title: string) => {
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
                <Typography.Text>{title}</Typography.Text>
            </Space>
        )
    }

    const search = async (keyword: string, page: number = 0) => {
        setLoading(true)

        form.validateFields().then(async (values) => {
            map(selectedSaEopJaStatusTypes, (u) => {
                agencyStatusTypeArray.push(getAgencyStatusType(u.toString()))
            })

            map(regions, (u) => {
                if (u.sido != null) {
                    siDoCodeArray.push(u.sido)
                }
                if (u.sigungu != null) {
                    siGunGuCodeArray.push(u.sigungu)
                }
                if (u.eupMyeonDong != null) {
                    eupMyeonDongArray.push(u.eupMyeonDong)
                }
            })

            let lMinCreateDate: Date = null
            let lMaxCreateDate: Date = null
            if (values.createAt != null) {
                lMinCreateDate = values.createAt[0].format("YYYY-MM-DD")
                lMaxCreateDate = values.createAt[1].format("YYYY-MM-DD")
            }

            const minAgencyMemberCount = values.minAgencyMemberCount
            const maxAgencyMemberCount = values.maxAgencyMemberCount

            const response = await AgencyService.search({ searchCode: searchCode, minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, minAgencyMemberCount: minAgencyMemberCount, maxAgencyMemberCount: maxAgencyMemberCount, saEopJaStatusTypes: saEopJaStatusTypeArray, agencyStatusTypes: agencyStatusTypeArray, siDoCodes: siDoCodeArray, siGunGuCodes: siGunGuCodeArray, eupMyeonDongCodes: eupMyeonDongArray, keyword: keyword, page: page })
            if (response.status === 200) {
                const pIsFilter = getIsFilter({ searchCode: searchCode, minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, minAgencyMemberCount: minAgencyMemberCount, maxAgencyMemberCount: maxAgencyMemberCount, saEopJaStatusTypes: saEopJaStatusTypeArray, agencyStatusTypes: agencyStatusTypeArray, siDoCodes: siDoCodeArray, siGunGuCodes: siGunGuCodeArray, eupMyeonDongCodes: eupMyeonDongArray })
                setLoading(false)
                onCompleted(response.data.result, lMinCreateDate, lMaxCreateDate, minAgencyMemberCount, maxAgencyMemberCount, saEopJaStatusTypeArray, agencyStatusTypeArray, siDoCodeArray, siGunGuCodeArray, eupMyeonDongArray, regions, pIsFilter)
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
                                setRegions([{ sido: null, sigungu: null, eupMyeonDong: null }])
                                setSelectedAgencyStatusTypes([])
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
                    <Button loading={isLoading} type="primary" onClick={() => search(keyword)}>
                        설정
                    </Button>
                </Space>
            )}
            width={'50%'}
        >
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
                                {regions.map((r, idx) => {
                                    return (
                                        <소재지
                                            key={`article-region-${idx}`}
                                            region={r}
                                            hasCreated={idx === 0 && regions.length < 3}
                                            hasDeleted={idx !== 0}
                                            onAdded={() => {
                                                if (regions.length < 3) {
                                                    setRegions([
                                                        { sido: null, sigungu: null, eupMyeonDong: null },
                                                        ...regions,
                                                    ])
                                                }
                                            }}
                                            onDeleted={() => {
                                                setRegions(regions.filter((_, i) => i !== idx))
                                            }}
                                            onSelected={(region) => {
                                                setRegions(regions.map((r, i) => { return i === idx ? region : r }))
                                            }}
                                        />
                                    )
                                })}
                            </Space>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>사업자 등록번호</Typography.Text>
                            <Space split={'~'}>
                                <Form.Item
                                    name="agencyStatusTypes"
                                    style={{ marginBottom: 0 }}
                                >
                                    <Space>
                                        <Checkbox
                                            onChange={(e: CheckboxChangeEvent) => {
                                                setSelectedAgencyStatusTypes(e.target.checked ? staticSaEopJaTypes : [])
                                            }}
                                            checked={staticSaEopJaTypes.length === selectedSaEopJaStatusTypes.length}
                                        >
                                            전체
                                        </Checkbox>
                                        {staticSaEopJaTypes.map((v) => {
                                            return (
                                                <Checkbox
                                                    key={v}
                                                    value={v}
                                                    checked={selectedSaEopJaStatusTypes.includes(v)}
                                                    onChange={(e: CheckboxChangeEvent) => {
                                                        setSelectedAgencyStatusTypes(e.target.checked ? [...selectedSaEopJaStatusTypes, v] : selectedSaEopJaStatusTypes.filter(t => t !== v))
                                                    }}
                                                >
                                                    {사업자등록번호(agencyColor(v), v)}
                                                </Checkbox>
                                            )
                                        })}
                                    </Space>
                                </Form.Item>
                            </Space>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>직원 수</Typography.Text>
                            <Space split={'~'}>
                                <Form.Item
                                    name="minAgencyMemberCount"
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber addonAfter={'명'} />
                                </Form.Item>
                                <Form.Item
                                    name="maxAgencyMemberCount"
                                    style={{ marginBottom: 0 }}
                                >
                                    <InputNumber addonAfter={'명'} />
                                </Form.Item>
                            </Space>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>등록일자</Typography.Text>
                            <Form.Item
                                name="createAt"
                                style={{ marginBottom: 0 }}
                            >
                                <DatePicker.RangePicker
                                    style={{ minWidth: 400 }}
                                    placeholder={['YY.MM.DD', 'YY.MM.DD']}
                                />
                            </Form.Item>
                        </Space>
                    </Col>
                </Row>
            </Form>
        </Modal>
    )
}

const 소재지 = ({
    region,
    hasCreated,
    hasDeleted,
    onAdded,
    onDeleted,
    onSelected,
}: {
    region: { sido?: string, sigungu?: string, eupMyeonDong?: string }
    hasCreated: boolean
    hasDeleted: boolean
    onAdded: () => void
    onDeleted: () => void
    onSelected: (region: { sido?: string, sigungu?: string, eupMyeonDong?: string }) => void
}) => {
    const [form] = Form.useForm()

    const [isLoading, setLoading] = useState(false)

    const [시도, set시도] = useState<Array<RegionModel.IRegionModel>>([])
    const [시군구, set시군구] = useState<Array<RegionModel.IRegionModel>>([])
    const [읍면동, set읍면동] = useState<Array<RegionModel.IRegionModel>>([])

    const get시도 = async (page: number = 0) => {
        setLoading(true)

        const response = await RegionService.시도()
        if (response.status === 200) {
            set시도(response.data.result)
            setLoading(false)
            if (region.sido) {
                form.setFieldsValue({
                    main: region.sido,
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
            result = [{ ...result[0], code: null, name: '전체', }, ...result,]
            set시군구(result)
            setLoading(false)
            form.setFieldsValue({
                sub: region.sigungu || null,
            })
        } else {
            setLoading(false)
            Errors.AjaxError(response.data)
        }
    }

    const get읍면동 = async (code: string) => {
        setLoading(true)

        const response = await RegionService.읍면동(code)
        if (response.status === 200) {
            let result = response.data.result as Array<RegionModel.IRegionModel>
            result = [{ ...result[0], code: null, name: '전체', }, ...result,]
            set읍면동(result)
            setLoading(false)
            form.setFieldsValue({
                reserve: region.eupMyeonDong || null,
            })
        } else {
            setLoading(false)
            Errors.AjaxError(response.data)
        }
    }

    useEffect(() => {
        if (region) {
            get시도()
            if (region.sido) {
                get시군구(region.sido)
            }
            if (region.sigungu) {
                get읍면동(region.sigungu)
            }
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

                            onSelected({ sido: e, sigungu: null, eupMyeonDong: null })
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
                        disabled={!region.sido}
                        style={{ minWidth: 180, }}
                        onChange={(e: string) => {
                            set읍면동([])
                            form.setFieldsValue({
                                reserve: null,
                            })
                            get읍면동(e)

                            onSelected({ ...region, sigungu: e, eupMyeonDong: null })
                        }}
                        options={시군구?.map((r) => {
                            return { value: r.code, label: r.name }
                        })}
                        placeholder={'시군구'}
                    />
                </Form.Item>
                <Form.Item
                    name="reserve"
                    style={{ marginBottom: 0 }}
                >
                    <Select
                        disabled={!region.sigungu}
                        style={{ minWidth: 180, }}
                        onChange={(e) => {
                            onSelected({ ...region, eupMyeonDong: e })
                        }}
                        options={읍면동?.map((r) => {
                            return { value: r.code, label: r.name }
                        })}
                        placeholder={'읍면동'}
                    />
                </Form.Item>
                {hasCreated && (
                    <Button
                        disabled={!region.sido}
                        onClick={() => {
                            onAdded && onAdded()
                            form.resetFields()
                        }}>추가</Button>
                )}
                {hasDeleted && (
                    <Button danger onClick={onDeleted}>삭제</Button>
                )}
            </Space>
        </Form>
    )
}