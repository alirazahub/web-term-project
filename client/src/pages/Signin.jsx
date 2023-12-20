import React, { useState } from 'react';
import { Form, Input, Button, notification } from 'antd';
import axios from 'axios';
import key from '../key';
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom';

const Signin = () => {
  const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
  // eslint-disable-next-line no-unused-vars
    const [cookies, setCookie] = useCookies(['x-auth-admin']);

  const handleLogin = async (values) => {
    setLoading(true);
    try {
        const response = await axios.post(`${key}/api/admin/login`, values);
      if (response?.data?.status) {
        setCookie('x-auth-admin', response?.data?.token, {
            path: '/',
            maxAge: 60 * 60 * 24,
            sameSite: true,
        });
        notification.success({
          message: 'Login Successful',
          description: 'Welcome to the admin panel!',
        });
        navigate('/users');
        // Redirect or perform any other actions after successful login
      } else {
        // Failed login
        notification.error({
          message: 'Login Failed',
          description: response?.data?.message,
        });
      }
    } catch (error) {
      console.error('Error during login:', error);
        notification.error({
            message: 'Login Failed',
            description: error?.response?.data?.message,
        });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-lg">
        <Form
          name="admin_login_form"
          initialValues={{ remember: true }}
          onFinish={handleLogin}
        >
          {/* Add your form fields here, for example: */}
          <h2 className="text-xl font-bold mb-4 text-center">Admin Login</h2>
          <Form.Item
            name="email"
            rules={[{ required: true, message: 'Please enter your email!', type: 'email' }]}
          >
            <Input
              placeholder="Email"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item
            name="password"
            rules={[{ required: true, message: 'Please enter your password!' }]}
          >
            <Input.Password
              placeholder="Password"
              className="w-full px-3 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              loading={loading}
              className="w-full py-2 rounded-md bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-700"
            >
              Login
            </Button>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default Signin;
