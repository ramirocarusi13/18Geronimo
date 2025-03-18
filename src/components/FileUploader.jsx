import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const FileUploader = () => {
    const props = {
        name: 'file',
        action: 'http://127.0.0.1:8000/api/upload',
        headers: {
            authorization: 'Bearer your-token-here',
        },
        onChange(info) {
            if (info.file.status === 'done') {
                message.success(`${info.file.name} subido con éxito`);
            } else if (info.file.status === 'error') {
                message.error(`${info.file.name} falló al subir`);
            }
        },
    };

    return (
        <Upload {...props}>
            <Button icon={<UploadOutlined />}>Subir Foto/Video</Button>
        </Upload>
    );
};

export default FileUploader;
