import React, { useState } from 'react'
import { Space, Table, Avatar, Tag } from 'antd';
import { AiOutlineEye } from "react-icons/ai";
import { MdOutlineMail } from "react-icons/md";


const StudentList = () => {
    //eslint-disable-next-line
    const [data, setData] = useState([
        {
            key: '1',
            id: "ID-000001",
            name: 'John Brown',
            gender: 'female',
            state: 'New York',
            status: 'pending',
            major: "economics",
            nameClass: "bs economics",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '2',
            id: "ID-000002",
            name: 'Jim Green',
            gender: 'female',
            state: 'London',
            status: 'applied',
            major: "economics",
            nameClass: "bs economics",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '3',
            id: "ID-000003",
            name: 'Joe Black',
            gender: 'female',
            state: 'virginia',
            status: 'admitted',
            major: "economics",
            nameClass: "bs science",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '4',
            id: "ID-000004",
            name: 'Joe Black',
            gender: 'male',
            state: 'new york',
            major: "economics",
            nameClass: "bs maths",
            status: 'denied',
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '5',
            id: "ID-000005",
            name: 'Joe Black',
            gender: "male",
            state: 'new york',
            status: 'admitted',
            major: "economics",
            nameClass: "bs economics",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        }
        ,
        {
            key: '6',
            id: "ID-000006",
            name: 'Joe Black',
            gender: "male",
            state: 'pennsylvania',
            status: 'admitted',
            major: "marketing & communication",
            nameClass: "bs marketing",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        }
        ,
        {
            key: '7',
            id: "ID-000007",
            name: 'Joe Black',
            gender: "transgender",
            state: 'pennsylvania',
            status: 'admitted',
            major: "marketing & communication",
            nameClass: "bs communication",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '8',
            id: "ID-000008",
            name: 'Joe Black',
            gender: "transgender",
            state: 'pennsylvania',
            status: 'denied',
            major: "marketing & communication",
            nameClass: "bs english",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '9',
            id: "ID-000009",
            name: 'Joe Black',
            gender: "male",
            state: 'pennsylvania',
            status: 'admitted',
            major: "marketing & communication",
            nameClass: "bs english",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '10',
            id: "ID-0000010",
            name: 'Joe Black',
            gender: "male",
            state: 'pennsylvania',
            status: 'in process',
            major: "marketing & communication",
            nameClass: "bs marketing",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '11',
            id: "ID-000011",
            name: 'Joe Black',
            gender: "male",
            state: 'pennsylvania',
            status: 'admitted',
            major: "biology",
            nameClass: "bs biology",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '12',
            id: "ID-000012",
            name: 'Joe Black',
            gender: "female",
            state: 'pennsylvania',
            status: 'applied',
            major: "biology",
            nameClass: "bs biology",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '13',
            id: "ID-000012",
            name: 'Joe Black',
            gender: "female",
            state: 'pennsylvania',
            status: 'applied',
            major: "biology",
            nameClass: "bs biology",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '14',
            id: "ID-000012",
            name: 'Joe Black',
            gender: "female",
            state: 'pennsylvania',
            status: 'applied',
            major: "biology",
            nameClass: "bs biology",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
        {
            key: '15',
            id: "ID-000012",
            name: 'Joe Black',
            gender: "female",
            state: 'virginia',
            status: 'applied',
            major: "economics",
            nameClass: "bs economics",
            image: 'https://th.bing.com/th/id/OIP.ixZ69lPCOZ3ZO5UqSHQGIAHaHa?pid=ImgDet&rs=1'
        },
    ]);

    
    const columns = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: "id",
        },
        {
            title: 'NAME',
            dataIndex: 'name',
            render: (_, record) => (
                <Space>
                    <Avatar src={record.image} />
                    <span className='capitalize'>{record.name}</span>
                </Space>
            ),
        },
        {
            title: 'GENDER',
            dataIndex: 'gender',
            render: (_, { gender }) => (
                <div className='capitalize'>
                    {gender}
                </div>
            ),
        }, {
            title: 'CLASS',
            dataIndex: 'nameClass',
            render: (_, { nameClass }) => (
                <div className='capitalize'>
                    {nameClass}
                </div>
            ),
            width: 150
        },
        , {
            title: 'MAJOR',
            dataIndex: 'major',
            render: (_, { major }) => (
                <div className='capitalize'>
                    {major}
                </div>
            ),
            width: 150
        },
        {
            title: 'HOME STATE',
            dataIndex: 'state',
            render: (_, { state }) => (
                <div className='capitalize'>
                    {state}
                </div>
            ),
        },
        {
            title: 'MESSAGE',
            key: "email",
            render: (_, record) => (
                <Space className='cursor-pointer'>
                    <MdOutlineMail onClick={() => alert(record.id)} size={25} style={{ color: "grey" }} />
                </Space>
            ),
        },
        {
            title: 'STATUS',
            key: 'status',
            dataIndex: 'status',
            render: (status) => (
                <Tag
                    className='w-[100px] text-center capitalize'
                    color={status === 'applied' ? '#82C43C' : status === 'pending' ? '#D9D9D9' : status === 'in process' ? '#E7B73C' : status === 'admitted' ? '#FF8F50' : '#AB0534'}>
                    {status}
                </Tag>
            )
        },
        {
            title: 'ACTION',
            key: "details",
            render: (_, record) => (
                <Space className='cursor-pointer'>
                    <AiOutlineEye onClick={() => alert(record.id)} size={25} style={{ color: "grey" }} />
                </Space>
            ),
        }
    ];


    return (
        <div className="sm:m-9 m-2">
            <div className="container mx-auto my-8">
                <Table
                    className='table-responsive'
                    showHeader={true}
                    size='middle'
                    columns={columns}
                    dataSource={data}
                    pagination={false}
                />
            </div>
        </div>
    )
}

export default StudentList
