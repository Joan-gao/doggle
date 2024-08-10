import React, { useEffect, useState } from "react";
import { Modal } from "antd";
import { useHistory } from "react-router-dom";
import { Button, Form, Input, Select } from "antd";
import axios from "axios";
import { DatePicker } from "antd";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);
const { Option } = Select;

const LoginReminder = () => {
  const [open, setOpen] = useState(false);
  const history = useHistory();
  const showModal = () => {
    setOpen(true);
  };
  useEffect(() => {
    showModal();
  }, []);
  const handleCancel = () => {
    setOpen(false);
  };

  const handleOk = () => {
    // history.push("/sign-in");
    setOpen(false);
  };

  return (
    <Modal title="Reminder" open={open} onOk={handleOk} onCancel={handleCancel}>
      <p>Please Login First</p>
    </Modal>
  );
};

export default LoginReminder;
