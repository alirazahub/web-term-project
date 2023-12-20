import React, { useState } from 'react'
import { Space, Table, Avatar, Select, Dropdown, Upload, Input } from 'antd';
import { BsPlus, BsEye } from "react-icons/bs";
import { FiEdit } from 'react-icons/fi';
import { RxDotsVertical } from 'react-icons/rx';
import { Menu } from 'antd';
import { MdDelete } from 'react-icons/md';
import key from '../key';
import axios from 'axios';
import { Modal, Form, Button, notification } from 'antd';
import { useEffect } from 'react';



const { Option } = Select;
const Cast = () => {
    const subActionLinks = [
        {
            key: '1',
            label: 'View Details',
            icon: <BsEye size={25} />,
            onClick: (data) => alert(`Notification Send ${data.name}`),
        },
        {
            key: '2',
            label: 'Edit',
            icon: <FiEdit size={25} />,
            onClick: () => alert('SMS SENT'),
        },
        {
            key: '3',
            label: 'Remove Item',
            icon: <MdDelete size={25} />,
            onClick: (data) => handleDelete(data?._id),
        }
    ];
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${key}/api/admin/all-casts`);
                setData(res.data.casts);
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
            const res = await axios.delete(`${key}/api/admin/delete-cast/${id}`);
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
                    <Avatar src={`${key}/images/${record?.images[0]}`} />
                    <span className='capitalize'>{record?.firstName} {record?.lastName}</span>
                </Space>
            ),
        },
        {
            title: 'COUNTRY',
            dataIndex: 'country',
            render: (country) => (
                <div className='capitalize'>
                    {country}
                </div>
            ),
        },
        {
            title: 'ROLE',
            dataIndex: 'role',
            render: (role) => (
                <div className='capitalize'>
                    {role.map((item) => (
                        <span className='mx-1'>{item}</span>
                    ))}
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
            title: 'ACTIONS',
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Dropdown
                        overlay={
                            <Menu>
                                {subActionLinks.map((action) => (
                                    <Menu.Item
                                        key={action.key}
                                        icon={action.icon}
                                        onClick={() => action.onClick(record)}
                                    >
                                        {action.label}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <RxDotsVertical className='cursor-pointer' size={25} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const [form] = Form.useForm();
    const [modalVisible, setModalVisible] = useState(false);

    const handleOk = async () => {
        form
            .validateFields()
            .then(async (values) => {
                const uploadImages = fileList.map((file) => {
                    return new Promise(async (resolve, reject) => {
                        const formData = new FormData();
                        formData.append('file', file.originFileObj);
                        await axios.post(`${key}/api/admin/upload`, formData)
                            .then((res) => {
                                resolve(res.data.fileName);
                            })
                            .catch((err) => {
                                reject(err);
                            });
                    });
                });
                const images = await Promise.all(uploadImages);
                values.images = images;
                await axios.post(`${key}/api/admin/add-cast`, values)
                    .then(res => {
                        if (res.data.status) {
                            notification.success({
                                message: 'Success',
                                description: res?.data?.message,
                            });
                            setModalVisible(false);
                            const newData = [...data];
                            newData.unshift(res?.data?.cast);
                            setData(newData);
                        } else {
                            notification.error({
                                message: 'Error',
                                description: res?.data?.message,
                            });
                        }
                    })
                form.resetFields();
                setFileList([]);
            })
            .catch(info => {
                console.log('Validate Failed:', info);
            });
    };

    const onCancel = () => {
        setModalVisible(false);
    }

    const [fileList, setFileList] = useState([]);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }

    const onPreview = async (file) => {
        let src = file.url;
        if (!src) {
            src = await new Promise(resolve => {
                const reader = new FileReader();
                reader.readAsDataURL(file.originFileObj);
                reader.onload = () => resolve(reader.result);
            });
        }
        const image = new Image();
        image.src = src;
        const imgWindow = window.open(src);
        imgWindow.document.write(image.outerHTML);
    }

    const beforeUpload = (file) => {
        setFileList([...fileList, file]);
        return false;
    }

    const uploadButton = (
        <div>
            <BsPlus size={25} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


    return (
        <div className="sm:m-9 m-2">
            <Modal
                title="Add Cast"
                centered
                visible={modalVisible}
                footer={false}
                onCancel={onCancel}
                destroyOnClose
                width={1000}
            >
                <Form form={form} layout="vertical" onFinish={handleOk}>
                    <div className='grid grid-cols-2 gap-x-8'>
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
                            name="role"
                            label="Role"
                            rules={[{ required: true, message: 'Please select the role' }]}
                        >
                            <Select mode='multiple' placeholder="Select role">
                                <Option value="actor">Actor</Option>
                                <Option value="actoress">Actoress</Option>
                                <Option value="director">Director</Option>
                                <Option value="producer">Producer</Option>
                                <Option value="writer">Writer</Option>
                                <Option value="musician">Musician</Option>
                                <Option value="singer">Singer</Option>
                                <Option value="dancer">Dancer</Option>
                                <Option value="choreographer">Choreographer</Option>
                                <Option value="stuntman">Stuntman</Option>
                                <Option value="stuntwoman">Stuntwoman</Option>
                                <Option value="other">Other</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="dateOfBirth"
                            label="Date of Birth"
                            rules={[{ required: true, message: 'Please select the date of birth' }]}
                        >
                            <Input type="date" />
                        </Form.Item>
                        <Form.Item
                            name="education"
                            label="Education"
                            rules={[{ required: true, message: 'Please select the education' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="nationality"
                            label="Nationality"
                            rules={[{ required: true, message: 'Please select the nationality' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="country"
                            label="Country"
                            rules={[{ required: true, message: 'Please enter the country' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="city"
                            label="City"
                            rules={[{ required: true, message: 'Please enter the city' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="hair"
                            label="Hair"
                            rules={[{ required: true, message: 'Please enter the hair' }]}
                        >
                            <Input placeholder='Curly Black' />
                        </Form.Item>
                        <Form.Item
                            name="language"
                            label="Language"
                            rules={[{ required: true, message: 'Please enter the language' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="height"
                            label="Height"
                            rules={[{ required: true, message: 'Please enter the height' }]}
                        >
                            <Select placeholder="Select height">
                                <Option value="5'0">5'0"</Option>
                                <Option value="5'1">5'1"</Option>
                                <Option value="5'2">5'2"</Option>
                                <Option value="5'3">5'3"</Option>
                                <Option value="5'4">5'4"</Option>
                                <Option value="5'5">5'5"</Option>
                                <Option value="5'6">5'6"</Option>
                                <Option value="5'7">5'7"</Option>
                                <Option value="5'8">5'8"</Option>
                                <Option value="5'9">5'9"</Option>
                                <Option value="5'10">5'10"</Option>
                                <Option value="5'11">5'11"</Option>
                                <Option value="6'0">6'0"</Option>
                                <Option value="6'1">6'1"</Option>
                                <Option value="6'2">6'2"</Option>
                                <Option value="6'3">6'3"</Option>
                                <Option value="6'4">6'4"</Option>
                                <Option value="6'5">6'5"</Option>
                                <Option value="6'6">6'6"</Option>
                                <Option value="6'7">6'7"</Option>
                                <Option value="6'8">6'8"</Option>
                                <Option value="6'9">6'9"</Option>
                                <Option value="6'10">6'10"</Option>
                                <Option value="6'11">6'11"</Option>
                                <Option value="7'0">7'0"</Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="weight"
                            label="Weight"
                            rules={[{ required: true, message: 'Please enter the weight' }]}
                        >
                            <Input placeholder='Enter Weight in Kgs' />
                        </Form.Item>
                        <div></div>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter the description' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="images"
                            label="Images"
                            rules={[{ required: true, message: 'Please enter the images' }]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                                beforeUpload={beforeUpload}
                                multiple={true}
                            >
                                {fileList.length >= 8 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </div>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full" danger>
                            Add Cast
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className='flex justify-between bg-orange-100 p-3 items-center'>
                <div className='font-bold text-[23px]'>All Actors & Acresses</div>
                <button className="bg-primary py-1 px-3 pt-2 rounded-lg text-white flex" onClick={() => setModalVisible(true)}>
                    Add Actor/Actoress <BsPlus size={25} />
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
                    />)}
            </div>
        </div>
    )
}

export default Cast
