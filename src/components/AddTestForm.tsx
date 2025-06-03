import React, { useContext } from 'react';
import { Form, Input, InputNumber, Button } from 'antd';
import { PingContext } from '../context/PingContext';
import { PingTest } from '../utils/types';
import { StyledCard } from './styles';

const AddTestForm: React.FC = () => {
    const { setTests } = useContext(PingContext);
    const [form] = Form.useForm();

    const handleAdd = (values: any) => {
        const newTest: PingTest = {
            id: Date.now().toString(),
            url: values.url,
            interval: values.interval,
            tags: values.tags ? values.tags.split(',').map((tag: string) => tag.trim()) : [],
            results: [],
            lastExecuted: '',
            isRunning: true,
        };

        setTests((prev: PingTest[]) => [...prev, newTest]);
        form.resetFields();
    };

    return (
        <StyledCard title="Add Ping Test">
            <Form
                form={form}
                layout="vertical"
                onFinish={handleAdd}
                autoComplete="off"
            >
                <Form.Item
                    label="URL"
                    name="url"
                    rules={[
                        { required: true, message: 'Please enter a URL' },
                        { type: 'url', message: 'Please enter a valid URL' },
                    ]}
                >
                    <Input placeholder="http://example.com" />
                </Form.Item>

                <Form.Item
                    label="Interval (seconds)"
                    name="interval"
                    rules={[
                        { required: true, message: 'Please enter an interval' },
                        {
                            type: 'number',
                            min: 1,
                            message: 'Interval must be at least 1 second',
                        },
                    ]}
                    initialValue={5}
                >
                    <InputNumber min={1} style={{ width: '100%' }} />
                </Form.Item>

                <Form.Item
                    label="Tags"
                    name="tags"
                    tooltip="Comma separated, e.g., tag1, tag2"
                >
                    <Input placeholder="seo, uptime, important" />
                </Form.Item>

                <Form.Item>
                    <Button type="primary" htmlType="submit">
                        Add
                    </Button>
                </Form.Item>
            </Form>
        </StyledCard>
    );
};

export default AddTestForm;
