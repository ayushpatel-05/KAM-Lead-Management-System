"use client"
import React, { useState } from 'react'
import { Button, Checkbox, Form, Grid, Input, Typography, message } from "antd";
import { LockOutlined, MailOutlined } from "@ant-design/icons";
import { PiSignInFill } from "react-icons/pi";
import { AppDispatch } from '../../redux/configureStore';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/modules/auth/authAPI';
import { useRouter } from "next/navigation";


const { useBreakpoint } = Grid;
const { Text, Title, Link } = Typography;

// type Props = {}

const Login = () => {
  
  const router = useRouter();
    const screens = useBreakpoint();
    const dispatch = useDispatch<AppDispatch>();
    const [loading, setLoading] = useState(false);

    const onFinish =async (values: { email: string; password: string; remember: true }) => {
      console.log("Received values of form: ", values);
      setLoading(true);
      try {
        const resultAction = await dispatch(login(values)).unwrap();
        message.success(`Welcome, ${resultAction.data.user.firstName}!`);
        // Redirect to dashboard or another page
        router.push("/");
      } catch (error) {
        console.log(error);
        message.error("Login failed. Please check your credentials.");
      } finally {
        setLoading(false);
      }
    };
    return (
        <section className={`flex items-center justify-center ${screens.sm ? "min-h-screen" : "auto"} bg-gray-100 py-12 md:py-24`}>
          <div className="w-[380px] mx-auto px-6 py-12 bg-white shadow-lg rounded-lg">
            <div className="mb-8">
              <PiSignInFill size={30}></PiSignInFill>
    
              <Title level={3} className="text-xl md:text-2xl font-semibold">Sign in</Title>
              <Text className="text-gray-600">Welcome back! Please enter your details below to sign in.</Text>
            </div>
            <Form
              name="normal_login"
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              layout="vertical"
              requiredMark="optional"
            >
              <Form.Item
                name="email"
                rules={[
                  {
                    type: "email",
                    required: true,
                    message: "Please input your Email!",
                  },
                ]}
              >
                <Input
                  prefix={<MailOutlined />}
                  placeholder="Email"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500"
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
                <Input.Password
                  prefix={<LockOutlined />}
                  type="password"
                  placeholder="Password"
                  className="border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
              </Form.Item>
              <Form.Item>
                <Form.Item name="remember" valuePropName="checked" noStyle>
                  <Checkbox className="text-sm">Remember me</Checkbox>
                </Form.Item>
                <a href="" className="text-sm text-blue-500 float-right">Forgot password?</a>
              </Form.Item>
              <Form.Item className="mb-0">
                <Button block type="primary" htmlType="submit" className="bg-blue-500 hover:bg-blue-600">
                  Log in
                </Button>
                <div className="mt-4 text-center">
                  <Text className="text-gray-600 text-sm">Don't have an account?</Text>
                  <Link href="/signup" className="text-blue-500 text-sm">Sign up now</Link>
                </div>
              </Form.Item>
            </Form>
          </div>
        </section>
      );
}

export default Login