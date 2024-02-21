import React from "react"

interface IProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src: string
}

export const SVGWrapper = (props: IProps) => {
    const { src, } = props

    return (
        <img {...props} src={src} style={{ ...props.style, cursor: 'pointer', }} />
    )
}