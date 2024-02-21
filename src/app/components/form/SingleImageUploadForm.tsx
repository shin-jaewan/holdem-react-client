import { Utilities } from "@utils/Utilities"
import { Button, Col, Row, Typography, Upload } from "antd"
import UploadList from "antd/es/upload/UploadList"
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface"
import React from "react"

interface IProps {
    label?: string
    title?: string
    path: string
    photo?: UploadFile
    children?: React.ReactNode
    onUploaded: (info: UploadChangeParam<UploadFile<any>>) => void
    onDeleted?: (photo: UploadFile) => void
}

export const SingleImageUploadForm = (props: IProps) => {
    const { label, title, path, photo, children, onUploaded, onDeleted } = props

    return (
        <Row gutter={[8, 8]}>
            {label &&
                <Col span={24}>
                    <Typography.Text className="required">{label}</Typography.Text>
                </Col>
            }
            <Col span={24}>
                <Upload
                    action={path}
                    name="images"
                    multiple={false}
                    showUploadList={false}
                    onChange={(uploadedFile: UploadChangeParam<UploadFile<any>>) => {
                        onUploaded(uploadedFile)
                    }}
                    style={{ width: '100%' }}
                >
                    {children ? children : (
                        !photo && (
                            <Button ghost type="primary">{title || '이미지 등록'}</Button>
                        )
                    )}
                </Upload>

                {photo && (
                    <div className={Utilities.isMobile() ? "mobile-upload-image" : "upload-image"}>
                        <UploadList
                            showDownloadIcon={false}
                            listType={"picture"}
                            onPreview={(file) => {
                                if (file.url) {
                                    window.open(file.url)
                                } else {
                                    window.open(file.response.url)
                                }
                            }}
                            onRemove={onDeleted}
                            locale={{}}
                            items={[photo]}
                        />
                    </div>
                )}
            </Col>
        </Row>
    )
}