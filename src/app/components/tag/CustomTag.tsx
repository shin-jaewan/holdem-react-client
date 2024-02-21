import { Row, Tag, Typography } from "antd"
import React from "react"

interface IProps {
    theme?: 'green' | 'yellow' | 'gray'
    text: string
    width?: number
}

export const CustomTag = (props: IProps) => {
    const { theme = 'gray', text = '', width, } = props

    const colors = {
        green: { background: '#E6FCF5', color: '#20C997', },
        yellow: { background: '#FFF9DB', color: '#F59F00', },
        gray: { background: '#E9ECEF', color: '#868E96', },
    }

    const { background, color } = colors[theme];

    return (
        <Tag color={background} style={{ width: width || undefined, }}>
            <Row justify={'center'} align={'middle'}>
                <Typography.Text strong style={{ color, fontSize: 12, }}>
                    {text}
                </Typography.Text>
            </Row>
        </Tag>
    )
}