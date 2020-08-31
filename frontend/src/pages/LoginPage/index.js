import React, { useState, useEffect } from "react";
import { Card, Form, Input, Button, Checkbox, notification } from "antd";
import { Container } from "./styles";
import Header from "../../components/Header";
import RegisterModal from "../../components/RegisterModal";
import { UserOutlined, LockOutlined } from "@ant-design/icons";
import { api } from "../../services/api";

export default function LoginPage() {
  const [visible, setVisible] = useState(false);

  const [loading, setLoading] = useState(false);

  const [savedData, setSavedData] = useState({
    remember: false,
    username: "",
    password: "",
  });

  const [form] = Form.useForm();

  useEffect(() => {
    if (localStorage.isChecked) {
      setSavedData({
        remember: localStorage.isChecked,
        username: localStorage.username,
        password: localStorage.password,
      });
    }
  }, []);

  const layout = {
    labelCol: { span: 8 },
    wrapperCol: { span: "100%" },
  };
  const tailLayout = {
    wrapperCol: { offset: 8, span: 16 },
  };

  const onRegisterClick = () => {
    setVisible(true);
  };

  const onFinish = async (values) => {
    if (savedData.remember) {
      localStorage.username = values.username;
      localStorage.password = values.password;
      localStorage.isChecked = savedData.remember;
    } else {
      localStorage.clear();
    }
    setLoading(true);
    try {
      const { data } = await api.post("/login", {
        username: values.username,
        password: values.password,
      });

      setLoading(false);
      if (data.token) {
        notification["success"]({
          message: "Successfully logged",
          description: "You succesfully logged in",
        });
      }
    } catch (err) {
      setLoading(false);
      notification["error"]({
        message: "An error ocurred",
        description: err.response.data[0].message,
      });
    }
  };

  const onCheck = () => {
    const newData = savedData;
    newData["remember"] = !savedData.remember;
    console.log(newData);

    setSavedData(newData);
  };

  const initialValues = {
    remember: localStorage.isChecked,
    username: localStorage.username,
    password: localStorage.password,
  };

  return (
    <>
      <Header />
      <Container>
        <Card title="Login" style={{ width: 300 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Form
              {...layout}
              name="basic"
              initialValues={initialValues}
              onFinish={onFinish}
              form={form}
            >
              <Form.Item
                name="username"
                rules={[
                  { required: true, message: "Please input your Username!" },
                ]}
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
              >
                <Input
                  prefix={<LockOutlined className="site-form-item-icon" />}
                  type="password"
                  placeholder="Password"
                />
              </Form.Item>

              <Form.Item
                {...tailLayout}
                name="remember"
                valuePropName="checked"
                onChange={onCheck}
              >
                <Checkbox>Remember me</Checkbox>
              </Form.Item>

              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Button type="primary" htmlType="submit" loading={loading}>
                  Log in
                </Button>
                <Button
                  type="primary"
                  style={{ marginLeft: "5%" }}
                  onClick={onRegisterClick}
                >
                  Register
                </Button>
              </div>
            </Form>
          </div>
        </Card>
        <RegisterModal visible={visible} setVisible={setVisible} />
      </Container>
    </>
  );
}
