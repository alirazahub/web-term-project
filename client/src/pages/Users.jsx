import React, { useEffect, useState } from 'react'
import { Space, Table, Avatar, notification } from 'antd';
import { Link } from 'react-router-dom';
import { BsPlus } from "react-icons/bs";
import { MdDelete } from 'react-icons/md';
import key from '../key';
import axios from 'axios';
import { Modal, Form, Input, Select, Button } from 'antd';

const { Option } = Select;

const Users = () => {

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${key}/api/admin/all-users`);
                setData(res.data.users);
                setLoading(false);
            } catch (error) {
                console.log(error);
                setLoading(false);
                notification.error({
                    message: 'Error',
                    description: 'Something went wrong',
                });
            }
        }
        getData();
        //eslint-disable-next-line
    }, []);


    const handleDelete = async (id) => {
        try {
            const res = await axios.delete(`${key}/api/admin/delete-user/${id}`);
            if (res.data.status) {
                const newData = data.filter((item) => item._id !== id);
                setData(newData);
                notification.success({
                    message: 'Success',
                    description: res?.data?.message,
                });
            }
        } catch (error) {
            console.log(error);
            notification.error({
                message: 'Error',
                description: 'Something went wrong',
            });
        }
    }
    const columns = [
        {
            title: 'ID',
            dataIndex: '_id',
            key: "_id",
        },
        {
            title: 'PROFILE',
            dataIndex: 'name',
            render: (_, record) => (
                <Space>
                    <Avatar src={`${key}/images/${record?.image}`} />
                    <span className='capitalize'>{record?.firstName} {record?.lastName}</span>
                </Space>
            ),
        },
        {
            title: 'EMAIL',
            dataIndex: 'email',
        },
        {
            title: 'CITY',
            dataIndex: 'city',
            render: (city) => (
                <div className='capitalize'>
                    {city}
                </div>
            ),
        },
        {
            title: 'GENDER',
            key: 'gender',
            dataIndex: 'gender',
            render: (gender) => (
                <Space wrap>
                    {gender && (
                        <div
                            className={`${gender.toLowerCase() === 'male'
                                ? 'bg-orange-500'
                                : gender.toLowerCase() === 'female'
                                    ? 'bg-purple-500'
                                    : 'bg-gray-400'
                                } w-2 h-2 rounded-full mr-2`}
                        ></div>
                    )}
                    <div className='capitalize'>{gender}</div>
                </Space>
            )
        },
        {
            title: 'DELETE',
            key: "delete",
            render: (_, record) => (
                <Space>
                    <Link>
                        <MdDelete onClick={() => handleDelete(record?._id)} size={25} color='gray' />
                    </Link>
                </Space>
            ),
        },
    ];

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const handleOk = async () => {
        form
            .validateFields()
            .then(async(values) => {
                await axios.post(`${key}/api/admin/add-user`, values)
                .then(res => {
                    if(res.data.status){
                        notification.success({
                            message: 'Success',
                            description: res?.data?.message,
                        });
                        setModalVisible(false);
                        const newData = [...data];
                        newData.unshift(res?.data?.user);
                        setData(newData);
                    }else{
                        notification.error({
                            message: 'Error',
                            description: res?.data?.message,
                        });
                    }
                })
                form.resetFields();
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const onCancel = () => {
        setModalVisible(false);
    }

    return (
        <div className="sm:m-9 m-2">
            <Modal
                title="Add User"
                centered
                visible={modalVisible}
                footer={false}
                onCancel={onCancel}
                destroyOnClose
            >
                <Form form={form} layout="vertical" onFinish={handleOk}>
                    <Form.Item
                        name="firstName"
                        label="First Name"
                        rules={[{ required: true, message: 'Please enter the first name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="lastName"
                        label="Last Name"
                        rules={[{ required: true, message: 'Please enter the last name' }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="email"
                        label="Email"
                        rules={[
                            { required: true, message: 'Please enter the email' },
                            { type: 'email', message: 'Please enter a valid email address' },
                        ]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="gender"
                        label="Gender"
                        rules={[{ required: true, message: 'Please select the gender' }]}
                    >
                        <Select placeholder="Select gender">
                            <Option value="male">Male</Option>
                            <Option value="female">Female</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item
                        name="city"
                        label="City"
                        rules={[{ required: true, message: 'Please enter the city' }]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full" danger>
                            Add User
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className='flex justify-between bg-orange-100 p-3 items-center'>
                <div className='font-bold text-[23px]'>All Registerd Users</div>
                <button className="bg-primary py-1 px-3 pt-2 rounded-lg text-white flex" onClick={() => setModalVisible(true)}>
                    Add User <BsPlus size={25} />
                </button>
            </div>
            <div className="container mx-auto my-8">
                {loading ? (
                    <div className='flex justify-center items-center'>
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-primary"></div>
                    </div>
                ) : (
                    <Table
                        className='table-responsive'
                        showHeader={true}
                        size='middle'
                        columns={columns}
                        dataSource={data}
                        pagination={{ pageSize: 7 }}
                    />
                )}
            </div>
        </div>
    )
}

export default Users
