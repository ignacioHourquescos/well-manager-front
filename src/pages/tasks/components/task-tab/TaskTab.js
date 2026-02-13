import React, { useEffect, useState } from "react";
import { Row, Col, message } from "antd";
import TasksTable from "./components/table/TaskTable";
import TaskDetail from "./components/task-detail/TaskDetail";
import {
	fetch_task_by_id,
	fetch_task_statuses,
} from "../../../../services/general";

function TaskTab({
	taskData,
	entity_comments,
	wellState,
	onTaskSubmit,
	canAddTaskExtras,
}) {
	const [selectedTask, setSelectedTask] = useState(null);
	const [taskDetails, setTaskDetails] = useState(null);
	const [loading, setLoading] = useState(false);
	// eslint-disable-next-line
	const [isTableUpdating, setIsTableUpdating] = useState(false);
	const [statusMapping, setStatusMapping] = useState({});
	// eslint-disable-next-line
	const [statusCounts, setStatusCounts] = useState({ OPEN: 0, CLOSED: 0 });
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false,
	);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	useEffect(() => {
		const getStatusMapping = async () => {
			try {
				const statuses = await fetch_task_statuses();
				const mapping = {};
				statuses.forEach((status) => {
					mapping[status.code] = status.type;
				});
				setStatusMapping(mapping);
			} catch (error) {
				console.error("Failed to fetch task statuses:", error);
			}
		};

		getStatusMapping();
	}, []);

	useEffect(() => {
		const calculateStatusCounts = () => {
			const counts = { OPEN: 0, CLOSED: 0 };
			taskData.tasks.forEach((task) => {
				const statusType = statusMapping[task.status] || "Unknown";
				if (statusType === "OPEN") {
					counts.OPEN += 1;
				} else if (statusType === "CLOSED") {
					counts.CLOSED += 1;
				}
			});
			setStatusCounts(counts);
		};

		calculateStatusCounts();
	}, [taskData, statusMapping]);

	const handleViewClick = async (taskId) => {
		try {
			setLoading(true);

			// Then fetch and set the detailed data
			console.log("Fetching details for task ID:", taskId);
			const details = await fetch_task_by_id(taskId);
			console.log("Received task details:", details);
			setTaskDetails(details);
		} catch (error) {
			console.error("Error fetching task details:", error);
			message.error("Failed to load task details");
		} finally {
			setLoading(false);
		}
	};

	const refreshTasks = async () => {
		try {
			setIsTableUpdating(true);

			// Call the parent's fetchTasks function
			await taskData.refresh();

			// Then refresh the selected task details if we have one
			if (taskDetails) {
				const updatedDetails = await fetch_task_by_id(taskDetails.id);
				console.log("Updated task details:", updatedDetails);
				setTaskDetails(updatedDetails);

				if (updatedDetails) {
					setSelectedTask(updatedDetails);
				}
			}
		} catch (error) {
			console.error("Error refreshing tasks:", error);
			message.error("Failed to refresh tasks");
		} finally {
			setIsTableUpdating(false);
		}
	};

	return (
		<Row gutter={24}>
			<Col span={isMobile ? 24 : 10}>
				{/*<Row gutter={16}>
					<Col span={10}>
						<span>OPEN TASKS - {statusCounts.OPEN}</span>
					</Col>
					<Col span={12}>
						<span>CLOSED TASKS - {statusCounts.CLOSED}</span>
					</Col>
				</Row> */}

				<TasksTable
					tasks={taskData.tasks}
					loading={taskData.loading}
					handleViewClick={handleViewClick}
					onTaskSubmit={onTaskSubmit}
				/>
			</Col>
			{!isMobile && canAddTaskExtras && (
				<Col span={14}>
					<TaskDetail
						initialValues={selectedTask}
						entityComments={entity_comments}
						selectedTask={selectedTask}
						taskDetails={taskDetails}
						loading={loading}
						performance={wellState.performance}
						onSuccess={refreshTasks}
					/>
				</Col>
			)}
		</Row>
	);
}

export default TaskTab;
