import React, { useState, useEffect } from "react";
import { Table, Tag, Drawer } from "antd";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import { fetch_personal_tasks, get_all_users } from "../../services/general";
import dayjs from "dayjs";
import TaskDetail from "../tasks/components/task-tab/components/task-detail/TaskDetail";
import { useFilters } from "../../context/FilterContext";
import { GiOilDrum } from "react-icons/gi";
import { FaHouseFloodWater } from "react-icons/fa6";
import { BsTrash3 } from "react-icons/bs";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

function PersonalTasks() {
	const { dbUser } = useAuth();
	const [tasks, setTasks] = useState([]);
	const [loading, setLoading] = useState(true);
	const [selectedTask, setSelectedTask] = useState(null);
	const [drawerVisible, setDrawerVisible] = useState(false);
	const { filters } = useFilters();
	const [filteredTasks, setFilteredTasks] = useState([]);
	const { t } = useTranslation();

	const loadTasks = async (id) => {
		try {
			setLoading(true);
			const data = await fetch_personal_tasks(id);
			setTasks(data);
		} catch (error) {
			console.error("Error loading tasks:", error);
		} finally {
			setLoading(false);
		}
	};

	useEffect(() => {
		dbUser && loadTasks(dbUser.id);
	}, [dbUser]);

	useEffect(() => {
		let filtered = [...tasks];

		// Filtrar por código de pozo/entidad
		if (filters.entity) {
			filtered = filtered.filter((item) =>
				item.well_code?.toLowerCase().includes(filters.entity.toLowerCase()),
			);
		}

		// Filtrar por tipo de pozo
		if (filters.wellTypes?.length > 0) {
			filtered = filtered.filter((item) =>
				filters.wellTypes.includes(item.well_type),
			);
		}

		// Filtrar por proyecto
		if (filters.projects?.length > 0) {
			filtered = filtered.filter((item) =>
				filters.projects.includes(item.well_project),
			);
		}

		// Filtrar por planta destino
		if (filters.destinations?.length > 0) {
			filtered = filtered.filter((item) =>
				filters.destinations.includes(item.well_destination_plant),
			);
		}

		// Filtrar por performance
		if (filters.performance && filters.performance.length > 0) {
			filtered = filtered.filter((item) =>
				filters.performance.includes(item?.performance_name),
			);
		}

		// Filtrar por action plan
		if (filters.action_plan) {
			filtered = filtered.filter(
				(item) => item?.action_plan?.name === filters.action_plan,
			);
		}

		setFilteredTasks(filtered);
	}, [filters, tasks]);

	const handleTaskClick = (record) => {
		setSelectedTask(record);
		setDrawerVisible(true);
	};

	const columns = [
		{
			title: t("personalTasks.columns.well"),
			dataIndex: "well_code",
			render: (text, record) => (
				<Link
					style={{ color: "#19519f", fontWeight: "600" }}
					to={`/tasks/${record.well_code}/${record.well_id}/${record.id_work_order}?action_plan_id=${record.action_plan_id}`}
				>
					{record.well_code}
				</Link>
			),
		},
		{
			title: t("personalTasks.columns.task"),
			dataIndex: "task_name",
			key: "task_name",
			render: (text, record) => (
				<div
					style={{ color: "#19519f", fontWeight: "600", cursor: "pointer" }}
					onClick={() => handleTaskClick(record)}
				>
					{t(`definedTasks.${record.task_id}`)}
				</div>
			),
		},
		{
			title: t("personalTasks.columns.priority"),
			dataIndex: "priority",
			key: "priority",
		},
		{
			title: t("personalTasks.columns.status"),
			dataIndex: "status",
			key: "status",
			render: (status) => {
				const statusOption = status_options.find(
					(option) => option.value === status?.toLowerCase(),
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
		{
			title: t("personalTasks.columns.project"),
			dataIndex: "well_project",
			key: "well_project",
		},
		{
			title: t("personalTasks.columns.destinationPlant"),
			dataIndex: "well_destination_plant",
			key: "well_destination_plant",
		},
		{
			title: t("personalTasks.columns.startDate"),
			dataIndex: "start_date",
			key: "start_date",
			render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
		},
		{
			title: t("personalTasks.columns.dueDate"),
			dataIndex: "due_date",
			key: "due_date",
			render: (date) => (date ? dayjs(date).format("DD/MM/YYYY") : "-"),
		},
	];

	return (
		<LayoutPage
			pageName={t("personalTasks.pageName")}
			secondaryTitle={t("personalTasks.secondaryTitle")}
			type="standard-layout"
		>
			<Table
				loading={loading}
				dataSource={filteredTasks}
				columns={columns}
				pagination={{ pageSize: 200 }}
				size="middle"
				rowKey="id"
			/>

			<Drawer
				title={t("personalTasks.drawerTitle")}
				placement="right"
				width={720}
				onClose={() => setDrawerVisible(false)}
				open={drawerVisible}
			>
				<TaskDetail
					taskDetails={selectedTask}
					loading={false}
					onSuccess={() => {
						setDrawerVisible(false);
						// Refresh the tasks list
						loadTasks();
					}}
				/>
			</Drawer>
		</LayoutPage>
	);
}

// Reusing the StatusTag component and status_options from TaskTable
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

	return <Tag color={color}>{t(`personalTasks.statuses.${status}`)}</Tag>;
};

const status_options = [
	{ value: "pending", label: "Pending" },
	{ value: "in_progress", label: "In Progress" },
	{ value: "done", label: "Done" },
	{ value: "canceled", label: "Canceled" },
	{ value: "failed", label: "Failed" },
	{ value: "stand_by", label: "Stand By" },
];

export default PersonalTasks;
