import { PlusOutlined } from '@ant-design/icons'
import { ImageModel } from "@model/ImageModel"
import { Col, GetProp, Modal, Row, Upload, UploadFile, UploadProps, notification } from "antd"
import React, { FunctionComponent, useState } from "react"

interface IProps {
    show: boolean,
    onClosed: () => void
    onSuccess: (ids: string[]) => void
    images: Array<ImageModel>
}

type FileType = Parameters<GetProp<UploadProps, 'beforeUpload'>>[0];

export const ArticleImageManagementModal: FunctionComponent<IProps> = (props) => {
    const { show, onClosed, onSuccess, images, } = props

    const [api, contextHolder] = notification.useNotification()
    const [fileList, setFileList] = useState<UploadFile[]>(images.map(v => ({
        uid: v.id,
        name: '사진',
        status: 'done',
        url: v.url,
    })));
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [previewTitle, setPreviewTitle] = useState('');

    const handleChange: UploadProps['onChange'] = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const handlePreview = async (file: UploadFile) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj as FileType);
        }

        setPreviewImage(file.url || (file.preview as string));
        setPreviewOpen(true);
        setPreviewTitle(file.name || file.url!.substring(file.url!.lastIndexOf('/') + 1));
    };

    const getBase64 = (file: FileType): Promise<string> =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result as string);
            reader.onerror = (error) => reject(error);
        });



    const uploadButton = (
        <button style={{ border: 0, background: 'none' }} type="button">
            <PlusOutlined />
            <div style={{ marginTop: 8 }}>Upload</div>
        </button>
    );

    return (
        <Modal
            title='사진관리'
            open={show}
            onOk={async () => {
                const result = fileList.map(v => {
                    if (v?.response?.result[0]?.id) {
                        return v?.response?.result[0]?.id;
                    } else if (v.uid) {
                        return v.uid
                    }
                    return '';
                })
                onSuccess(result)
                onClosed();
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
                    <Upload
                        multiple
                        key={'asdf'}
                        action={"/api/images/articles"}
                        name="images"
                        listType="picture-card"
                        fileList={fileList}
                        onPreview={handlePreview}
                        onChange={handleChange}
                    >
                        {uploadButton}
                    </Upload>
                </Col>
            </Row>

            <Modal open={previewOpen} title={previewTitle} footer={null} onCancel={() => setPreviewOpen(false)}>
                <img alt="example" style={{ width: '100%' }} src={previewImage} />
            </Modal>
        </Modal>
    )
}