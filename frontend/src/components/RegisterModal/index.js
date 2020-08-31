import React, { useState } from "react";
import { Form, Input, notification, Modal } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { api } from "../../services/api";

export default function RegisterModal(props) {
  const [passwordValidation, setPasswordValidation] = useState({
    validateStatus: null,
    errorMsg: null,
  });

  const [usernameValidation, setUsernameValidation] = useState({
    validateStatus: null,
    errorMsg: null,
  });

  const [loading, setLoading] = useState(false);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: "100%" },
  };

  const [form] = Form.useForm();
  function validatePassword(pass) {
    if (pass) {
      return pass.match(/^(?=.*[0-9])(?=.{6,20}$)(?=.*[a-zA-Z])([a-zA-Z0-9]+)$/)
        ? setPasswordValidation({
            validateStatus: "success",
            errorMsg: null,
          })
        : setPasswordValidation({
            validateStatus: "error",
            errorMsg: "Your password must contain a character and one number",
          });
    }
  }

  function validateUsername(username) {
    if (username) {
      return username.match(
        /^(?=.{5,20}$)(?![_.])(?!.*[_.]{2})[a-zA-Z0-9._]+(?<![_.])$/
      )
        ? setUsernameValidation({
            validateStatus: "success",
            errorMsg: null,
          })
        : setUsernameValidation({
            validateStatus: "error",
            errorMsg: "Your username must contain a character and one number",
          });
    }
  }

  async function onFinish(values) {
    if (
      usernameValidation.validateStatus !== "success" ||
      passwordValidation.validateStatus !== "success"
    ) {
      return alert("Fill the fields as requested");
    }
    setLoading(!loading);
    try {
      await api.post("/register", values);
      notification["success"]({
        message: "Successfully registered",
        description: "You succesfully registered",
      });
      props.setVisible(false);
      setLoading(!loading);
    } catch (err) {
      notification["error"]({
        message: "An error ocurred",
        description: err.response.data.error.message,
      });
    }
  }

  return (
    <Modal
      title="Register"
      visible={props.visible}
      onOk={form.submit}
      onCancel={() => props.setVisible(false)}
      confirmLoading={loading}
    >
      <Form
        {...layout}
        name="basic"
        onValuesChange={(value) =>
          value.password
            ? validatePassword(value.password)
            : validateUsername(value.username)
        }
        form={form}
        onFinish={onFinish}
      >
        <Form.Item
          name="username"
          rules={[{ required: true, message: "Please input your Username!" }]}
          validateStatus={usernameValidation.validateStatus}
          help={usernameValidation.errorMsg}
        >
          <Input
            prefix={<UserOutlined className="site-form-item-icon" />}
            placeholder="Username"
          />
        </Form.Item>
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: "Please input your Password!",
            },
          ]}
          validateStatus={passwordValidation.validateStatus}
          help={passwordValidation.errorMsg}
        >
          <Input
            prefix={<LockOutlined className="site-form-item-icon" />}
            type="password"
            placeholder="Password"
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}
