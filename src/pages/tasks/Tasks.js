import { message, Tabs } from "antd";
import React, { useState, useEffect, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import PageActions from "./components/page-actions/PageActions";
import ChangePerformanceModal from "./components/change-performance-modal/ChangePerformanceModal";
import FullScreenLoader from "../../components/common/FullScreenLoader";

import {
	update_well_performance,
	fetch_work_order_tasks,
	create_work_order_task,
	fetch_wells,
} from "../../services/general";
import TaskTab from "./components/task-tab/TaskTab";
import WellDetailTab from "./components/tab-well-detail/WellDetailTab";
import Reservoir from "./components/tab-reservoir/Reservoir";
import { Styled } from "./Tasks.styles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

function Tasks() {
	const { wellId, wellCode, workOrderId } = useParams();
	const { dbUser } = useAuth();
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [modalStates, setModalStates] = useState({
		isModalVisible: false,
		isAddTaskModalVisible: false,
	});

	const [taskData, setTaskData] = useState({
		tasks: [],
		selectedTask: null,
		loading: true,
		error: null,
	});

	const [wellState, setWellState] = useState({
		performance: "",
		action_plan: "",
	});

	const [activeTab, setActiveTab] = useState("1");

	const [currentWellData, setCurrentWellData] = useState({});
	const [loading, setLoading] = useState(false);
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false,
	);
	const wellTypeId = currentWellData?.[0]?.well_type_id;

	const permissions = useMemo(() => {
		const p = dbUser?.permissions || {};
		const rolePerms = Array.isArray(p.role_permissions)
			? p.role_permissions.map(String)
			: [];
		const editableTypes = Array.isArray(p.editable_well_types)
			? p.editable_well_types.map(String)
			: [];
		return {
			role_permissions: rolePerms,
			editable_well_types: editableTypes,
		};
	}, [dbUser?.permissions]);

	const hasPerm = useMemo(() => {
		return (permId) => permissions.role_permissions.includes(permId);
	}, [permissions.role_permissions]);

	const canEditWellType = useMemo(() => {
		return (wtId) => permissions.editable_well_types.includes(wtId);
	}, [permissions.editable_well_types]);

	const canChangePerformance = useMemo(() => {
		if (!wellTypeId) return false;
		return hasPerm("1") && canEditWellType(wellTypeId);
	}, [wellTypeId, hasPerm, canEditWellType]);

	const canSeeTasksTab = useMemo(() => {
		if (!wellTypeId) return false;
		return hasPerm("2") && canEditWellType(wellTypeId);
	}, [wellTypeId, hasPerm, canEditWellType]);

	const canAddTaskExtras = useMemo(() => {
		if (!wellTypeId) return false;
		return hasPerm("3") && canEditWellType(wellTypeId);
	}, [wellTypeId, hasPerm, canEditWellType]);

	useEffect(() => {
		if (!canSeeTasksTab && activeTab === "2") setActiveTab("1");
	}, [canSeeTasksTab, activeTab]);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleModalVisibility = (modalType, isVisible) => {
		setModalStates((prev) => ({
			...prev,
			[modalType]: isVisible,
		}));
	};

	const handleStatusUpdate = async (values) => {
		setLoading(true);
		try {
			await update_well_performance(
				parseInt(wellId),
				parseInt(values.performance),
				parseInt(values.action_plan),
			);

			setWellState({
				performance: values.performance,
				actionPlan: values.action_plan,
			});

			handleModalVisibility("isModalVisible", false);
			message.success(t("tasks.messages.updateSuccess"));

			// Fetch the updated well data to get the new work order ID
			const data = await fetch_wells(wellId, dbUser?.client_id);
			setCurrentWellData(data);

			// Get the new work order ID from the response
			if (data && data[0] && data[0].id_work_order) {
				const newWorkOrderId = data[0].id_work_order;
				// Get the action plan ID from the values parameter since it's the one we just updated
				const actionPlanId = values.action_plan;

				// Navigate to the new URL with updated work order ID and action plan ID
				navigate(
					`/tasks/${wellCode}/${wellId}/${newWorkOrderId}?action_plan_id=${actionPlanId}`,
				);
			}
		} catch (error) {
			console.error("Failed to update well status:", error);
			message.error(t("tasks.messages.updateError"));
		} finally {
			setLoading(false);
		}
	};

	const handleTaskSubmit = async (values) => {
		try {
			setTaskData((prev) => ({ ...prev, loading: true }));
			const taskData = {
				id_work_order: workOrderId,
				task_id: values.task_id,
				responsable: values.responsable,
				priority: values.priority,
				status: "to_do",
				start_date: values.start_date?.toISOString(),
				due_date: values.due_date?.toISOString(),
				additional_comments: values.additional_comments,
				notificated: values.notificated ? values.notificated.join(",") : "",
				user_id: values.responsable,
			};

			await create_work_order_task(taskData);
			message.success(t("tasks.messages.createSuccess"));
			handleModalVisibility("isAddTaskModalVisible", false);
			await fetchTasks();
		} catch (error) {
			console.error("Error creating task:", error);
			message.error(error.message || t("tasks.messages.createError"));
		} finally {
			setTaskData((prev) => ({ ...prev, loading: false }));
		}
	};

	const handleViewClick = (taskId) => {
		const selectedTaskData = taskData.tasks.find(
			(task) => task.task_id === taskId,
		);
		setTaskData((prev) => ({ ...prev, selectedTask: selectedTaskData }));
	};

	const fetchTasks = async () => {
		try {
			setTaskData((prev) => ({ ...prev, loading: true }));
			const data = await fetch_work_order_tasks(workOrderId);
			// console.log("Fresh tasks data:", data);
			setTaskData((prev) => ({
				...prev,
				tasks: data.tasks,
				statusSummary: data.statusSummary,
				error: null,
			}));
		} catch (err) {
			console.error("Error fetching work order tasks:", err);
			setTaskData((prev) => ({
				...prev,
				error: "Failed to fetch work order tasks",
			}));
			message.error(t("tasks.messages.loadError"));
		} finally {
			setTaskData((prev) => ({ ...prev, loading: false }));
		}
	};

	useEffect(() => {
		if (workOrderId) {
			fetchTasks();
		}
		// eslint-disable-next-line
	}, [workOrderId]);

	useEffect(() => {
		// console.log("USE effect para buscar data especifica del well", wellId);
		const fetchWellData = async () => {
			setLoading(true);
			try {
				const data = await fetch_wells(wellId, dbUser?.client_id);
				setCurrentWellData(data);
				// console.log("CURRENT WELL DATA", data);
			} catch (error) {
				console.error("Error fetching well data:", error);
			} finally {
				setLoading(false);
			}
		};

		if (wellId) {
			fetchWellData();
		}
	}, [wellId, dbUser]);

	const items = useMemo(() => {
		if (isMobile) {
			return [
				{ key: "1", label: t("tasks.tabs.generalData"), children: null },
				...(canSeeTasksTab ? [{ key: "2", label: t("tasks.tabs.tasks") }] : []),
			];
		}
		return [
			{ key: "1", label: t("tasks.tabs.generalData"), children: null },
			...(canSeeTasksTab ? [{ key: "2", label: t("tasks.tabs.tasks") }] : []),
			{ key: "3", label: t("tasks.tabs.reservoirAnalysis") },
		];
	}, [isMobile, canSeeTasksTab, t]);

	const renderTabContent = () => {
		switch (activeTab) {
			case "2":
				return (
					<TaskTab
						taskData={{
							...taskData,
							refresh: fetchTasks,
						}}
						handleViewClick={handleViewClick}
						wellState={wellState}
						onTaskSubmit={handleTaskSubmit}
						canAddTaskExtras={canAddTaskExtras}
					/>
				);
			case "1":
				return (
					<div>
						<WellDetailTab
							taskData={{
								...taskData,
								refresh: fetchTasks,
							}}
							currentWellData={currentWellData[0]}
						/>
					</div>
				);
			case "3":
				return <Reservoir currentWellData={currentWellData[0]} />;
			default:
				return null;
		}
	};
	//test

	return (
		<LayoutPage pageName={`${wellCode}`} displayFilter={false}>
			<Styled.Header>
				<PageActions
					entityId={wellCode}
					performance={wellState.performance}
					actionPlan={wellState.actionPlan}
					showPerformanceModificationModal={() =>
						handleModalVisibility("isModalVisible", true)
					}
					onTaskSubmit={handleTaskSubmit}
					currentWellData={currentWellData}
					canChangePerformance={canChangePerformance}
				/>

				<Tabs
					defaultActiveKey="1"
					items={items}
					style={{ padding: "0rem" }}
					onChange={setActiveTab}
					onTaskSubmit={handleTaskSubmit}
				/>
			</Styled.Header>
			{renderTabContent()}

			<ChangePerformanceModal
				visible={modalStates.isModalVisible}
				onCancel={() => handleModalVisibility("isModalVisible", false)}
				onOk={handleStatusUpdate}
				initialPerformance={wellState.performance}
				initialActionPlan={wellState.actionPlan}
			/>

			{loading && <FullScreenLoader />}
		</LayoutPage>
	);
}

export default Tasks;
