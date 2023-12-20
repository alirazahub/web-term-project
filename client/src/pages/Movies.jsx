import React, { useState } from 'react'
import { Space, Table, Select, Dropdown, Image } from 'antd';
import { BsPlus, BsEye } from "react-icons/bs";
import { FiEdit, FiDelete } from 'react-icons/fi';
import { RxDotsVertical } from 'react-icons/rx';
import { Menu } from 'antd';
import { TbRating12Plus, TbRating14Plus, TbRating16Plus, TbRating18Plus, TbRating21Plus } from 'react-icons/tb'
import { Modal, Form, Input, Button, Upload, notification } from 'antd';
import axios from 'axios';
import { useEffect } from 'react';
import key from '../key';
import { MdDelete } from 'react-icons/md';
import { BiMinus } from 'react-icons/bi';
import { PlusOutlined } from '@ant-design/icons';



const { Option } = Select;
const Movies = () => {
    const [hours, setHours] = useState(0);
    const [minutes, setMinutes] = useState(0);

    const handleHourChange = (e) => {
        console.log(e)
        // setHours(parseInt(e.target.value, 10));
    };

    const handleMinuteChange = (e) => {
        setMinutes(parseInt(e.target.value, 10));
    };

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
            label: 'Remove Movie',
            icon: <MdDelete size={25} />,
            onClick: (data) => handleDelete(data._id),
        }
    ];

    const [data, setData] = useState([]);
    const [genres, setGenres] = useState([]);
    const [casts, setCasts] = useState([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try {
                setLoading(true);
                const res = await axios.get(`${key}/api/admin/all-movies`);
                const res1 = await axios.get(`${key}/api/admin/all-casts`);
                const res2 = await axios.get(`${key}/api/admin/all-generes`);
                setData(res?.data?.movies);
                console.log(res?.data?.movies)
                setCasts(res1?.data?.casts);
                setGenres(res2?.data?.generes);
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
            const res = await axios.delete(`${key}/api/admin/delete-movie/${id}`);
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
            title: 'POSTER',
            dataIndex: 'poster',
            render: (poster) => (
                <Image src={`${key}/images/${poster}`} width={40} />
            ),
        },
        {
            title: 'MOVIE NAME',
            dataIndex: 'name',
            render: (_, record) => (
                <Space>
                    <div className='capitalize'>{record.name}</div>
                </Space>
            ),
        },
        {
            title: 'GENRE',
            dataIndex: 'genere',
            render: (_, record) => (
                <Space>
                    {record.genere.map((item) => (
                        <div key={item._id} className='capitalize'>{item.name}</div>
                    ))}
                </Space>
            ),
        },
        {
            title: 'RELEASE DATE',
            dataIndex: 'releaseDate',
        },
        {
            title: 'LANGUAGE',
            dataIndex: 'language',
        },
        {
            title: 'CLASSIFICATION',
            dataIndex: 'classification',
            render: (classification) => (
                <Space>
                    {classification === "PG-13" && (
                        <TbRating12Plus size={25} />
                    )}
                    {classification === "R" && (
                        <TbRating14Plus size={25} />
                    )}
                    {classification === "NC-17" && (
                        <TbRating16Plus size={25} />
                    )}
                    {classification === "X" && (
                        <TbRating18Plus size={25} />
                    )}
                    {classification === "XXX" && (
                        <TbRating21Plus size={25} />
                    )}
                    <div className='capitalize'>{classification}</div>
                </Space>
            ),
        },
        {
            title: 'DURATION',
            dataIndex: 'duration',
        },
        {
            title: 'RATING',
            dataIndex: 'rating',
            render: (rating) => (
                <div className='capitalize'>
                    {rating? rating : 'N/A'} 
                </div>
            ),
        },
        {
            title: 'ACTIONS',
            key: "actions",
            render: (_, record) => (
                <Space>
                    <Dropdown
                        overlay={
                            <Menu>
                                {subActionLinks.map((item) => (
                                    <Menu.Item
                                        key={item.key}
                                        onClick={() => item.onClick(record)}
                                        icon={item.icon}
                                    >
                                        {item.label}
                                    </Menu.Item>
                                ))}
                            </Menu>
                        }
                        trigger={['click']}
                    >
                        <RxDotsVertical className=' cursor-pointer' size={25} />
                    </Dropdown>
                </Space>
            ),
        },
    ];

    const [form] = Form.useForm();
    const [fileList, setFileList] = useState([]);
    const [fileList2, setFileList2] = useState([]);

    const onChange = ({ fileList: newFileList }) => {
        setFileList(newFileList);
    }
    const onChange2 = ({ fileList: newFileList }) => {
        setFileList2(newFileList);
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
    const beforeUpload2 = (file) => {
        setFileList2([...fileList2, file]);
        return false;
    }

    const uploadButton = (
        <div>
            <BsPlus size={25} />
            <div style={{ marginTop: 8 }}>Upload</div>
        </div>
    );


    const [allCast, setAllCast] = useState([
        { id: '', character: '', characterName: '' },
    ]);

    const addCastField = () => {
        setAllCast([...allCast, { id: '', character: '', characterName: '' }]);
    }

    const handleCastChange = (index, name, value) => {
        const list = [...allCast];
        list[index][name] = value;
        setAllCast(list);
    }

    const handleRemoveCast = (index) => {
        const list = [...allCast];
        list.splice(index, 1);
        setAllCast(list);
    }
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
                const uploadImages2 = fileList.map((file) => {
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
                const images2 = await Promise.all(uploadImages2);
                values.poster = images[0];
                values.photos = images2;
                values.allCast = allCast;
                console.log(values)
                await axios.post(`${key}/api/admin/add-movie`, values)
                    .then(res => {
                        if (res.data.status) {
                            notification.success({
                                message: 'Success',
                                description: res?.data?.message,
                            });
                            setModalVisible(false);
                            const newData = [...data];
                            newData.unshift(res?.data?.movie);
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
                            name="name"
                            label="Name"
                            rules={[{ required: true, message: 'Please enter the Movie name' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item
                            name="releaseDate"
                            label="Release Date"
                            rules={[{ required: true, message: 'Please enter the relaeae date' }]}
                        >
                            <Input type='date' />
                        </Form.Item>
                        <Form.Item
                            name="genere"
                            label="Genere"
                            rules={[{ required: true, message: 'Please enter the  genere' }]}
                        >
                            <Select
                                placeholder="Select a option and change input text above"
                                mode="multiple"
                            >
                                {genres?.map((item) => (
                                    <Option key={item._id} value={item._id}>{item.name}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="prducer"
                            label="Prducer"
                            rules={[{ required: true, message: 'Please enter the  prducer' }]}
                        >
                            <Select
                                placeholder="Select a option and change input text above"
                                mode="multiple"
                            >
                                {casts?.map((item) => (
                                    <Option key={item._id} value={item._id}>{item.firstName} {item.lastName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="director"
                            label="Director"
                            rules={[{ required: true, message: 'Please enter the  director' }]}
                        >
                            <Select
                                placeholder="Select a option and change input text above"
                                mode="multiple"
                            >
                                {casts?.map((item) => (
                                    <Option key={item._id} value={item._id}>{item.firstName} {item.lastName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="writer"
                            label="Writer"
                            rules={[{ required: true, message: 'Please enter the  director' }]}
                        >
                            <Select
                                placeholder="Select a option and change input text above"
                                mode="multiple"
                            >
                                {casts?.map((item) => (
                                    <Option key={item._id} value={item._id}>{item.firstName} {item.lastName}</Option>
                                ))}
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="language"
                            label="language"
                            rules={[{ required: true, message: 'Please select the language' }]}
                        >
                            <Input />
                        </Form.Item>
                        <div className='grid grid-cols-2 gap-x-6'>
                            <Form.Item
                                name="durationHRS"
                                label="Duration (hrs)"
                                rules={[{ required: true, message: 'Please select the date of duration' }]}
                            >

                                <Select>
                                    {[...Array(6).keys()].map((hour) => (
                                        <Select.Option key={hour} value={hour}>
                                            {hour} {hour === 1 ? 'hour' : 'hours'}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                            <Form.Item
                                name="durationMINS"
                                label="Duration (mins)"
                                rules={[{ required: true, message: 'Please select the date of duration' }]}
                            >
                                <Select>
                                    {[...Array(60).keys()].map((minute) => (
                                        <Select.Option key={minute} value={minute}>
                                            {minute} {minute === 1 ? 'minute' : 'minutes'}
                                        </Select.Option>
                                    ))}
                                </Select>
                            </Form.Item>
                        </div>
                        <Form.Item
                            name="classification"
                            label="Classification"
                            rules={[{ required: true, message: 'Please select the classification' }]}
                        >
                            <Select>
                                <Select.Option value="PG-13">PG-13</Select.Option>
                                <Select.Option value="R">R</Select.Option>
                                <Select.Option value="NC-17">NC-17</Select.Option>
                                <Select.Option value="X">X</Select.Option>
                                <Select.Option value="XXX">XXX</Select.Option>
                            </Select>
                        </Form.Item>
                        <Form.Item
                            name="trailer"
                            label="Trailer"
                            rules={[{ required: true, message: 'Please enter the Trailer URL' }]}
                        >
                            <Input placeholder='Trailer URL' />
                        </Form.Item>
                        <Form.Item
                            name="description"
                            label="Description"
                            rules={[{ required: true, message: 'Please enter the description' }]}
                        >
                            <Input.TextArea rows={4} />
                        </Form.Item>
                        <Form.Item
                            name="poster"
                            label="Poster"
                            rules={[{ required: true, message: 'Please enter the Poster' }]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList}
                                onChange={onChange}
                                onPreview={onPreview}
                                beforeUpload={beforeUpload}
                            >
                                {fileList.length >= 1 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                        <Form.Item
                            name="photos"
                            label="Photos"
                            rules={[{ required: true, message: 'Please Add photos' }]}
                        >
                            <Upload
                                listType="picture-card"
                                fileList={fileList2}
                                onChange={onChange2}
                                onPreview={onPreview}
                                beforeUpload={beforeUpload2}
                            >
                                {fileList.length >= 5 ? null : uploadButton}
                            </Upload>
                        </Form.Item>
                    </div>
                    <Form.Item className='w-full'>
                        {allCast?.map((cast, index) => (
                            <Space key={index} className='grid grid-cols-4 gap-x-8' align="baseline">
                                <Select
                                    placeholder='Select Cast'
                                    value={cast.id}
                                    onChange={(e) => handleCastChange(index, 'id', e)}
                                >
                                    {casts?.map((item) => (
                                        <Select.Option key={item._id} value={item._id}>{item.firstName} {item.lastName}</Select.Option>
                                    ))}
                                </Select>
                                <Input
                                    placeholder='Character'
                                    value={cast.character}
                                    onChange={(e) => handleCastChange(index, 'character', e.target.value)}
                                />
                                <Input
                                    placeholder='Character Name'
                                    value={cast.characterName}
                                    onChange={(e) => handleCastChange(index, 'characterName', e.target.value)}
                                />
                                <Button className='flex justify-center items-center' onClick={() => handleRemoveCast(index)}>
                                    <BiMinus size={30} />
                                </Button>
                            </Space>
                        ))}
                        <Form.Item>
                            <Button type="dashed" onClick={addCastField} block icon={<PlusOutlined />}>
                                Add Another Cast
                            </Button>
                        </Form.Item>
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="w-full" danger>
                            Add Movie
                        </Button>
                    </Form.Item>
                </Form>
            </Modal>
            <div className='flex justify-between bg-orange-100 p-3 items-center'>
                <div className='font-bold text-[23px]'>All Movies</div>
                <button className="bg-primary py-1 px-3 pt-2 rounded-lg text-white flex" onClick={() => setModalVisible(true)}>
                    Add Movie <BsPlus size={25} />
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
                        pagination={{ pageSize: 4 }}
                    />
                )}
            </div>
        </div>
    )
}

export default Movies
