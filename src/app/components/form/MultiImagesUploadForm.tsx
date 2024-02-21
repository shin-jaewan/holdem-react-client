import { Utilities } from "@utils/Utilities"
import { Button, Col, Row, Upload } from "antd"
import UploadList from "antd/es/upload/UploadList"
import { UploadChangeParam, UploadFile } from "antd/lib/upload/interface"
import React from "react"

interface IProps {
    title?: string
    path: string
    photos?: Array<UploadFile>
    onUploaded: (info: UploadChangeParam<UploadFile<any>>) => void
    onDeleted?: (photo: UploadFile) => void
}

export const MultiImagesUploadForm = (props: IProps) => {
    const { title, path, photos, onUploaded, onDeleted } = props

    return (
        <Row>
            <Col>
                <Upload
                    action={path}
                    name="images"
                    multiple={true}
                    showUploadList={false}
                    maxCount={5}
                    onChange={onUploaded}
                    // onChange={(uploadedFile: UploadChangeParam<UploadFile<any>>) => {
                    //     onUploaded(uploadedFile)
                    //     console.log("test::Id::" + uploadedFile.file.response?.result?.id)
                    // }}
                >
                    {/* <Button type="primary">{title || '이미지 등록  '}</Button> */}
                    {photos.length < 5 && (
                        <Button ghost type="primary">{title || '이미지 등록'}</Button>
                    )}
                </Upload>
                {photos && (
                    <div className={Utilities.isMobile() ? "mobile-upload-image" : "upload-image"}>
                        {photos.map((photo, i) => {
                            return (
                                <UploadList
                                    key={i}
                                    showDownloadIcon={false}
                                    listType={"picture"}
                                    onPreview={(file) => {
                                        if (file.url) {
                                            window.open(file.url)
                                        } else {
                                            window.open(file.response.url)
                                        }
                                    }}
                                    onRemove={(photo) => { onDeleted(photo) }}
                                    locale={{}}
                                    items={[photo]}
                                />
                            );
                        })}
                    </div>
                )}
            </Col>
        </Row>
    )
}