import React, { useContext, useEffect, useRef, useState } from 'react';
import { PingContext } from '../context/PingContext';
import { pingURL } from '../utils/ping';
import { PingTest } from '../utils/types';
import { Table, Button, Modal, Input, Space } from 'antd';
import { StyledCard } from './styles';

const ReportPage: React.FC = () => {
    const { tests, setTests } = useContext(PingContext);
    const [searchTag, setSearchTag] = useState('');
    const [deleteModalVisible, setDeleteModalVisible] = useState(false);
    const [deleteId, setDeleteId] = useState<string | null>(null);
    const [clearModalVisible, setClearModalVisible] = useState(false);
    const timersRef = useRef<{ [id: string]: NodeJS.Timeout }>({});

    useEffect(() => {
        // Clear any existing timers
        Object.values(timersRef.current).forEach(clearInterval);
        timersRef.current = {};

        // Set up timers only for running tests
        tests.forEach((test: PingTest) => {
            if (test.isRunning) {
                const timer = setInterval(async () => {
                    const result = await pingURL(test.url);
                    setTests((prev: PingTest[]) =>
                        prev.map((t: PingTest) =>
                            t.id === test.id
                                ? {
                                    ...t,
                                    results: [result, ...t.results.slice(0, 4)],
                                    lastExecuted: new Date().toLocaleString('en-US', {
                                        year: 'numeric',
                                        month: 'long',
                                        day: 'numeric',
                                        hour: 'numeric',
                                        minute: '2-digit',
                                        second: '2-digit',
                                        hour12: true,
                                    }).replace(',', '')
                                        .replace(' at', ' @'),
                                }
                                : t
                        )
                    );
                }, test.interval * 1000);

                timersRef.current[test.id] = timer;
            }
        });

        return () => {
            Object.values(timersRef.current).forEach(clearInterval);
        };
    }, [tests]);

    const handleAction = (id: string, action: 'pause' | 'play') => {
        setTests((prev: PingTest[]) =>
            prev.map((t: PingTest) =>
                t.id === id
                    ? { ...t, isRunning: action === 'play' }
                    : t
            )
        );
    };

    // Open modal and set which test is requested for deletion
    const showDeleteModal = (id: string) => {
        setDeleteId(id);
        setDeleteModalVisible(true);
    };

    // Confirm delete action
    const confirmDelete = () => {
        if (!deleteId) return;
        clearInterval(timersRef.current[deleteId]);
        delete timersRef.current[deleteId];
        setTests((prev: PingTest[]) => prev.filter((t) => t.id !== deleteId));
        setDeleteModalVisible(false);
        setDeleteId(null);
    };

    // Cancel delete action
    const cancelDelete = () => {
        setDeleteModalVisible(false);
        setDeleteId(null);
    };

    const showClearModal = () => {
        setClearModalVisible(true);
    };

    const confirmClear = () => {
        setTests([]);
        localStorage.removeItem('pingTests');
        setClearModalVisible(false);
    };

    const cancelClear = () => {
        setClearModalVisible(false);
    };

    const filteredTests = tests.filter((test: PingTest) =>
        searchTag.trim() === ''
            ? true
            : test.tags.some((tag: string) => tag.toLowerCase().includes(searchTag.toLowerCase()))
    );

    const columns = [
        { title: 'URL', dataIndex: 'url', key: 'url' },
        { title: 'Interval(Sec)', dataIndex: 'interval', key: 'interval' },
        { title: 'Last Executed', dataIndex: 'lastExecuted', key: 'lastExecuted' },
        {
            title: 'Results of Last 5 Tests',
            dataIndex: 'results',
            key: 'results',
            render: (r: ('P' | 'F')[]) => r.join(' | '),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_: any, record: PingTest) => (
                <Space>
                    <Button
                        type={record.isRunning ? 'primary' : 'default'}
                        onClick={() => handleAction(record.id, 'play')}
                    >
                        Play
                    </Button>
                    <Button
                        type={!record.isRunning ? 'primary' : 'default'}
                        onClick={() => handleAction(record.id, 'pause')}
                    >
                        Pause
                    </Button>
                    <Button danger onClick={() => showDeleteModal(record.id)}>
                        Delete
                    </Button>
                </Space>
            ),
        },
    ];

    return (
        <StyledCard title="Ping Reports">
            {filteredTests?.length > 0 && <Button type="primary" danger onClick={showClearModal} style={{ marginBottom: 16, float: 'right' }}>Clear All Tests</Button>}
            <Input.Search
                placeholder="Search by tag"
                value={searchTag}
                onChange={(e) => setSearchTag(e.target.value)}
                style={{ marginBottom: 16 }}
                allowClear
            />
            <Table rowKey="id" columns={columns} dataSource={filteredTests} pagination={false} />

            <Modal
                title="Confirm Delete"
                open={deleteModalVisible}
                onOk={confirmDelete}
                onCancel={cancelDelete}
                okText="Yes"
                cancelText="No"
                centered
            >
                <p>Are you sure you want to delete this test?</p>
            </Modal>

            <Modal
                title="Confirm Clear All Data"
                open={clearModalVisible}
                onOk={confirmClear}
                onCancel={cancelClear}
                okText="Yes"
                cancelText="No"
                centered
            >
                <p>Are you sure you want to clear all test data?</p>
            </Modal>
        </StyledCard>
    );
};

export default ReportPage;
