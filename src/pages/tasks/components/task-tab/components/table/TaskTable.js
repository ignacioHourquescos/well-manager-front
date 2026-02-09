import React, { useEffect, useState } from "react";
import { Tag } from "antd";
import { Styled, StyledTable } from "./TaskTable.styles";
import { fetch_task_statuses } from "../../../../../../services/general";
import { Link } from "react-router-dom";
import AddTaskModal from "./components/add-task-modal/AddTaskModal";
import { useTranslation } from "react-i18next";

function TasksTable({ tasks, loading, handleViewClick, onTaskSubmit }) {
	const [statusOptions, setStatusOptions] = useState([]);
	const [selectedRowKey, setSelectedRowKey] = useState(null);
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false
	);
	const { t } = useTranslation();

	useEffect(() => {
		const getStatusOptions = async () => {
			try {
				const statuses = await fetch_task_statuses();
				setStatusOptions(statuses);
			} catch (error) {
				console.error("Failed to fetch task statuses:", error);
			}
		};
		getStatusOptions();
	}, []);
	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleRowClick = (record) => {
		setSelectedRowKey(record.key);
		handleViewClick(record);
	};

	const columns = [
		{
			title: "Task",
			dataIndex: "task_name",
			key: "task",
			width: "70%",
			render: (value, record) => {
				return <>{t(`definedTasks.${record.task_id}`)}</>;
			},
		},
		{
			title: "Status",
			dataIndex: "status",
			key: "status",
			align: "center",
			width: "10%",
			render: (status) => {
				// console.log("Rendering status:", status);
				const statusOption = statusOptions.find(
					(option) => option.code === status?.toLowerCase()
				);
				return (
					<StatusTag
						status={status?.toLowerCase()}
						label={statusOption?.label || status}
						t={t}
					/>
				);
			},
		},
	];

	return (
		<Styled.Container>
			<br />
			<StyledTable
				loading={loading}
				dataSource={tasks}
				columns={columns}
				pagination={{ pageSize: 20 }}
				size="middle"
				height={500}
				rowClassName={(record) =>
					record.key === selectedRowKey ? ".selected-row" : ""
				}
				onRow={(record) => ({
					onClick: () => handleRowClick(record.id),
				})}
				showHeader={false}
			/>{" "}
			{!isMobile && (
				<Link
					onClick={(e) => {
						e.preventDefault();
						handleOpenModal();
					}}
					style={{
						fontSize: "16px",
						marginBottom: "10px",
						transform: "translateY(-50px) !important",
					}}
				>
					{t("tasks.addTask")}
				</Link>
			)}
			<AddTaskModal
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={onTaskSubmit}
			/>
		</Styled.Container>
	);
}

export default TasksTable;

const StatusTag = ({ status, label, t }) => {
	let color = "default";

	switch (status?.toLowerCase()) {
		case "pending":
			color = "orange";
			break;
		case "in_progress":
			color = "blue";
			break;
		case "done":
			color = "green";
			break;
		case "canceled":
			color = "red";
			break;
		case "failed":
			color = "purple";
			break;
		case "stand_by":
			color = "gold";
			break;
		default:
			color = "default";
	}

	return (
		<Tag
			color={color}
			bordered={false}
			style={{ display: "block", width: "100%", textAlign: "center" }}
		>
			{t(`tasks.statuses.${status}`)}
		</Tag>
	);
};
