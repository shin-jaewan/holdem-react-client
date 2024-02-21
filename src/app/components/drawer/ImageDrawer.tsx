import { ImageModel } from "@model/ImageModel"
import { Utilities } from "@utils/Utilities"
import { Col, Drawer, Image, Row, Space } from "antd"
import { map } from "lodash-es"
import React, { FunctionComponent } from "react"

interface IProps {
    images: Array<ImageModel>
    onClosed: () => void
}

export const ImageDrawer: FunctionComponent<IProps> = (props) => {
    const { images = [], onClosed } = props
    return (
        <Drawer
            title="사진목록"
            open={images?.length > 0}
            width={Utilities.isMobile() ? "100%" : "40%"}
            destroyOnClose={true}
            bodyStyle={{ textAlign: "center" }}
            onClose={onClosed}
        >
            <Row gutter={[ 8, 8 ]}>
                {map(images, (p) => {
                    return (
                        <Col key={p.id}>
                            <Space>
                                <Image
                                    key={p.id}
                                    src={p.largeUrl}
                                />
                            </Space>
                        </Col>
                    )
                })}
            </Row>
        </Drawer>
    )
}