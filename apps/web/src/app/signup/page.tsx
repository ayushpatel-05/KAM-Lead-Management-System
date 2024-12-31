"use client"
import React from 'react'
import { Button, Form, Grid, Input, Select, Typography } from "antd";
import { LockOutlined, MailOutlined, PhoneOutlined, UserOutlined  } from "@ant-design/icons";
import { CgProfile } from "react-icons/cg";

const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

// type Props = {}

const Signup = () => {

    const screens = useBreakpoint();

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };
    return (
        <section className={`flex items-center justify-center ${screens.sm ? "min-h-screen" : "auto"} bg-gray-100 py-12 md:py-24`}>
        <div className="w-[380px] mx-auto px-6 py-12 bg-white shadow-lg rounded-lg">
          <div className="text-center mb-8">
            <CgProfile size={30}></CgProfile>
  
            <Title level={3} className="text-xl md:text-2xl font-semibold">Sign up</Title>
            <Text className="text-gray-600">Join us! Create an account to get started.</Text>
          </div>
          <Form
            name="normal_signup"
            onFinish={onFinish}
            layout="vertical"
            requiredMark="optional"
          >
            <Form.Item
              name="firstName"
              rules={[{ required: true, message: "Please input your First Name!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="First Name"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
            <Form.Item
              name="lastName"
              rules={[{ required: true, message: "Please input your Last Name!" }]}
            >
              <Input
                prefix={<UserOutlined />}
                placeholder="Last Name"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
            <Form.Item
              name="email"
              rules={[{ type: "email", required: true, message: "Please input your Email!" }]}
            >
              <Input
                prefix={<MailOutlined />}
                placeholder="Email"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
            <Form.Item
              name="phone"
              rules={[{ required: true, message: "Please input your Phone Number!" }]}
            >
              <Input
                prefix={<PhoneOutlined />}
                placeholder="Phone"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
            <Form.Item
              name="role"
              rules={[{ required: true, message: "Please select your Role!" }]}
            >
              <Select
                placeholder="Select your role"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              >
                <Select.Option value="kam">KAM</Select.Option>
                <Select.Option value="sales">Sales</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              name="password"
              rules={[{ required: true, message: "Please input your Password!" }]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Password"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
            <Form.Item
              name="confirmPassword"
              dependencies={['password']}
              rules={[
                {
                  required: true,
                  message: "Please confirm your Password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue('password') === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(new Error('Passwords do not match!'));
                  },
                }),
              ]}
            >
              <Input.Password
                prefix={<LockOutlined />}
                type="password"
                placeholder="Confirm Password"
                className="border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </Form.Item>
            <Form.Item className="mb-0">
              <Button
                block
                type="primary"
                htmlType="submit"
                className="bg-blue-500 hover:bg-blue-600"
              >
                Sign up
              </Button>
              <div className="mt-4 text-center">
                <Text className="text-gray-600 text-sm">Already have an account?</Text>{" "}
                <Link href="/login" className="text-blue-500 text-sm">Sign in</Link>
              </div>
            </Form.Item>
          </Form>
        </div>
      </section>
      );
}

export default Signup