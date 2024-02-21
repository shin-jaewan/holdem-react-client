import { Errors } from "@contexts/ErrorContext"
import { ArticleModel } from "@model/ArticleModel"
import { PaginationModel } from "@model/PaginationModel"
import { RegionModel } from "@model/RegionModel"
import { ArticleService } from "@services/ArticleService"
import { RegionService } from "@services/RegionService"
import { ArticleCategoryMainType } from "@type/ArticleCategoryMainType"
import { Button, Checkbox, Col, DatePicker, Form, InputNumber, Modal, Radio, Row, Select, Space, Tag, Typography } from "antd"
import { CheckboxChangeEvent } from "antd/es/checkbox"
import { CheckboxValueType } from "antd/es/checkbox/Group"
import { findIndex, map } from "lodash-es"
import React, { FunctionComponent, useEffect, useState } from "react"

interface IProps {
    show: boolean
    onCompleted: (page: PaginationModel.Paging<ArticleModel.IArticleModel>, articleCategoryMainTypes: ArticleCategoryMainType[], minAdDate: Date, maxAdDate: Date, minCreateDate: Date, maxCreateDate: Date, opened: boolean, siDoCodes: string[], siGunGuCodes: string[], eupMyeonDongCodes: string[], regionsParam: Array<{ sido?: string, sigungu?: string, eupMyeonDong?: string }>, isFilter: boolean) => void
    onClosed: (articleCategoryMainTypes: ArticleCategoryMainType[], minAdDate: Date, maxAdDate: Date, minCreateDate: Date, maxCreateDate: Date, opened: boolean, siDoCodes: string[], siGunGuCodes: string[], eupMyeonDongCodes: string[], regionsParam: Array<{ sido?: string, sigungu?: string, eupMyeonDong?: string }>, isFilter: boolean) => void
    keyword: string
    articleCategoryMainTypes: ArticleCategoryMainType[]
    minAdDate: Date
    maxAdDate: Date
    minCreateDate: Date
    maxCreateDate: Date
    opened: boolean
    siDoCodes: string[]
    siGunGuCodes: string[]
    eupMyeonDongCodes: string[]
    regionsParam: Array<{ sido?: string, sigungu?: string, eupMyeonDong?: string }>
}

export const ArticleFilterModal: FunctionComponent<IProps> = (props) => {
    const { show, onCompleted, onClosed, keyword, articleCategoryMainTypes, minAdDate, maxAdDate, minCreateDate, maxCreateDate, opened, siDoCodes, siGunGuCodes, eupMyeonDongCodes, regionsParam } = props

    const [form] = Form.useForm()
    const [isLoading, setLoading] = useState<boolean>(false)
    const [regions, setRegions] = useState<Array<{ sido?: string, sigungu?: string, eupMyeonDong?: string }>>([
        { sido: null, sigungu: null, eupMyeonDong: null }
    ])

    const [isFilter, setIsFilter] = useState<boolean>(false)
    const [types, setTypes] = useState<CheckboxValueType[]>([])
    const values = ['아파트', '아파트(분양권)', '오피스텔', '오피스텔(분양권)', '단독/다가구', '연립/다세대', '상가', '사무실', '토지', '건물(빌딩, 숙박, 상가, 공장, 창고, 기타 등)']

    const articleCategoryMainTypeArray: ArticleCategoryMainType[] = []
    const siDoCodeArray: string[] = []
    const siGunGuCodeArray: string[] = []
    const eupMyeonDongArray: string[] = []

    const fn_Closed = () => {
        const pIsFilter = getIsFilter({ articleCategoryMainTypes: articleCategoryMainTypeArray, minAdDate: minAdDate, maxAdDate: maxAdDate, minCreateDate: minCreateDate, maxCreateDate: maxCreateDate, opened: opened, siDoCodes: siDoCodeArray, siGunGuCodes: siGunGuCodeArray, eupMyeonDongCodes: eupMyeonDongArray })
        onClosed(articleCategoryMainTypes, minAdDate, maxAdDate, minCreateDate, maxCreateDate, opened, siDoCodes, siGunGuCodes, eupMyeonDongCodes, regions, pIsFilter)
    }

    const getIsFilter = ({ ...values }: any) => {
        let isReturn = false

        if ((articleCategoryMainTypes.length > 0) || values.minAdDate || values.maxAdDate || values.minCreateDate || values.maxCreateDate || opened || (values.siDoCodes.length > 0) || (values.siGunGuCodes.length > 0) || (values.eupMyeonDongCodes.length > 0)) {
            isReturn = true
        }
        setIsFilter(isReturn)

        return isReturn
    }

    const getArticleCategoryMainType = (typeString: string) => {
        switch (typeString) {
            case '아파트':
                return ArticleCategoryMainType.아파트
            case '아파트(분양권)':
                return ArticleCategoryMainType.아파트_분양권
            case '오피스텔':
                return ArticleCategoryMainType.오피스텔
            case '오피스텔(분양권)':
                return ArticleCategoryMainType.오피스텔_분양권
            case '단독/다가구':
                return ArticleCategoryMainType.단독_다가구
            case '연립/다세대':
                return ArticleCategoryMainType.연립_다세대
            case '상가':
                return ArticleCategoryMainType.상가
            case '사무실':
                return ArticleCategoryMainType.사무실
            case '토지':
                return ArticleCategoryMainType.토지
            case '건물(빌딩, 숙박, 상가, 공장, 창고, 기타 등)':
                return ArticleCategoryMainType.건물
            default:
                return null
        }
    }

    const search = async (keyword: string, page: number = 0) => {
        setLoading(true)

        form.validateFields().then(async (values) => {
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

            map(types, (u) => {
                articleCategoryMainTypeArray.push(getArticleCategoryMainType(u.toString()))
            })
            let opened: boolean
            switch (values.isOpen) {
                case 1:
                    opened = true
                    break
                case 2:
                    opened = false
                    break
                default:
                    opened = null
                    break
            }

            let lMinCreateDate: Date = null
            let lMaxCreateDate: Date = null
            if (values.createAt != null) {
                lMinCreateDate = values.createAt[0].format("YYYY-MM-DD")
                lMaxCreateDate = values.createAt[1].format("YYYY-MM-DD")
            }

            let lMinAdDate: Date = null
            let lMaxAdDate: Date = null
            if (values.advertizeAt != null) {
                lMinAdDate = values.advertizeAt[0].format("YYYY-MM-DD")
                lMaxAdDate = values.advertizeAt[1].format("YYYY-MM-DD")
            }

            const response = await ArticleService.search({ opened: opened, minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, minAdDate: lMinAdDate, maxAdDate: lMaxAdDate, articleCategoryMainTypes: articleCategoryMainTypeArray, siDoCodes: siDoCodeArray, siGunGuCodes: siGunGuCodeArray, eupMyeonDongCodes: eupMyeonDongArray, keyword: keyword, page: page })
            if (response.status === 200) {
                const pIsFilter = getIsFilter({ opened: opened, minCreateDate: lMinCreateDate, maxCreateDate: lMaxCreateDate, minAdDate: lMinAdDate, maxAdDate: lMaxAdDate, articleCategoryMainTypes: articleCategoryMainTypeArray, siDoCodes: siDoCodeArray, siGunGuCodes: siGunGuCodeArray, eupMyeonDongCodes: eupMyeonDongArray })
                setLoading(false)
                onCompleted(response.data.result, articleCategoryMainTypeArray, lMinAdDate, lMaxAdDate, lMinCreateDate, lMaxCreateDate, opened, siDoCodeArray, siGunGuCodeArray, eupMyeonDongArray, regions, pIsFilter)
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
                                setTypes([])
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
                                                        ...regions
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
                            <Typography.Text>매물종류</Typography.Text>
                            <Form.Item
                                name="view"
                                style={{ marginBottom: 0 }}
                            >
                                <Space wrap>
                                    <Checkbox
                                        onChange={(e: CheckboxChangeEvent) => {
                                            setTypes(e.target.checked ? values : [])
                                        }}
                                        checked={values.length === types.length}
                                    >
                                        전체
                                    </Checkbox>
                                    {values.map((v) => {
                                        return (
                                            <Checkbox
                                                key={v}
                                                value={v}
                                                checked={types.includes(v)}
                                                onChange={(e: CheckboxChangeEvent) => {
                                                    setTypes(e.target.checked ? [...types, v] : types.filter(t => t !== v))
                                                }}
                                            >
                                                {v}
                                            </Checkbox>
                                        )
                                    })}
                                </Space>
                            </Form.Item>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical">
                            <Typography.Text>광고</Typography.Text>
                            <Form.Item
                                name="isOpen"
                                style={{ marginBottom: 0 }}
                            >
                                <Radio.Group>
                                    <Radio value={null}>
                                        <Typography.Text>전체</Typography.Text>
                                    </Radio>
                                    <Radio value={1}>
                                        <Tag color='#E7F5FF'>
                                            <Typography.Text style={{ color: '#4263EB' }}>ON</Typography.Text>
                                        </Tag>
                                    </Radio>
                                    <Radio value={2}>
                                        <Tag color='#E9ECEF'>
                                            <Typography.Text style={{ color: '#868E96' }}>OFF</Typography.Text>
                                        </Tag>
                                    </Radio>
                                </Radio.Group>
                            </Form.Item>
                        </Space>
                    </Col>
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>등록일</Typography.Text>
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
                    <Col span={24}>
                        <Space direction="vertical" style={{ width: '100%' }}>
                            <Typography.Text>최근광고일</Typography.Text>
                            <Form.Item
                                name="advertizeAt"
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