import React from "react";
import { UploadOutlined } from "@ant-design/icons";
import { Button, message, Upload } from "antd";
const props = {
  name: "file",
  crossOriginIsolated: false,
  action: "http://127.0.0.1:5000/upload",
  headers: {
    authorization: "authorization-text",
    "Access-Control-Allow-Origin": "*",
  },
  onChange(info) {
    if (info.file.status !== "uploading") {
      console.log(info.file, info.fileList);
    }
    if (info.file.status === "done") {
      message.success(`${info.file.name} file uploaded successfully`);
    } else if (info.file.status === "error") {
      message.error(`${info.file.name} file upload failed.`);
    }
  },
};
const UploadFile = () => (
  <Upload {...props} className="pb-4">
    <Button icon={<UploadOutlined />}>Click to Upload</Button>
  </Upload>
);
export default UploadFile;
