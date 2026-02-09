import axios from "axios";
import axiosInstance from "./axiosInstance";

const CONTROLLER = "/";

export const fetch_wells = async (wellId, clientId) => {
	try {
		const response = await axiosInstance.get(
			`/wells?wellId=${wellId || ""}&clientId=${clientId}`,
		);
		return response.data; // Return the data from the response
	} catch (error) {
		console.error("Error fetching wells:", error);
		throw error; // Rethrow the error for handling in the calling function
	}
};

export const fetch_wells_total_data = async (wellId, clientId) => {
	try {
		const params = { clientId };
		if (wellId) params.wellId = wellId;
		const { data } = await axiosInstance.get("/wells/total", { params });
		return data;
	} catch (error) {
		console.error("Error fetching wells:", error);
		throw error;
	}
};

export const create_well = async (payload) => {
	const { data } = await axiosInstance.post("/wells", payload);
	return data;
};

export const update_well = async (wellId, payload) => {
	const { data } = await axiosInstance.put(`/wells/${wellId}`, payload);
	return data;
};

export const fetch_well_audit = async (wellId, clientId) => {
	const { data } = await axiosInstance.get(`/wells/${wellId}/audit`, {
		params: { clientId },
	});
	return data;
};

export const fetch_well_states = async () => {
	const { data } = await axiosInstance.get("/wells/well-status/states");
	return data;
};

export const fetch_well_substates = async (stateId) => {
	const { data } = await axiosInstance.get("/wells/well-status/substates", {
		params: { stateId },
	});
	return data;
};

export const fetch_well_tipoestado = async (substateId) => {
	const { data } = await axiosInstance.get("/wells/well-status/tipoestado", {
		params: { substateId },
	});
	return data;
};

export const fetch_well_types = async () => {
	const { data } = await axiosInstance.get("/wells/well-types");
	return data;
};

export async function fetch_performance() {
	try {
		const response = await axiosInstance.get(`/performances`);
		return response.data;
	} catch (error) {
		console.error("Error fetching performance data:", error);
		throw error;
	}
}

export async function fetch_action_plan() {
	try {
		const response = await axiosInstance.get(`/action-plans`);
		return response.data;
	} catch (error) {
		console.error("Error fetching action plans:", error);
		throw error;
	}
}

export async function fetch_action_plans_by_performance(performanceId) {
	try {
		const response = await axiosInstance.get(
			`/action-plans/by-performance/${performanceId}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching action plans by performance:", error);
		throw error;
	}
}

export const update_well_performance = async (
	wellId,
	performanceId,
	actionPlanId,
) => {
	const response = await axiosInstance.put(`/well/performance`, {
		wellId,
		performanceId,
		actionPlanId,
	});
	return response.data;
};

export const fetch_work_order_tasks = async (workOrderId) => {
	const response = await axiosInstance.get(`/work-order-tasks/${workOrderId}`);
	return response.data;
};

export const fetch_task_descriptions_by_action_plan = async (actionPlanId) => {
	try {
		const response = await axiosInstance.get(
			`/task-descriptions/${actionPlanId}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching task descriptions:", error);
		throw error;
	}
};

export const create_work_order_task = async (taskData) => {
	try {
		const response = await axiosInstance.post(`/work-order-task`, taskData);
		return response.data;
	} catch (error) {
		console.error("Error creating work order task:", error);
		throw error;
	}
};

export const fetch_task_by_id = async (taskId) => {
	try {
		const response = await axiosInstance.get(`/task/${taskId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching task details:", error);
		throw error;
	}
};

// Add this new function to your existing services
export const update_task = async (taskData) => {
	try {
		const response = await axiosInstance.put(`/task`, {
			id: taskData.id,
			id_work_order: taskData.id_work_order,
			task_id: taskData.task_id,
			responsable: taskData.responsable,
			priority: taskData.priority,
			status: taskData.status,
			start_date: taskData.start_date,
			due_date: taskData.due_date,
			additional_comments: taskData.additional_comments,
			notificated: taskData.notificated,
		});
		return response.data;
	} catch (error) {
		console.error("Error updating task:", error);
		throw error;
	}
};

export const fetch_personal_tasks = async (userId) => {
	try {
		const response = await axiosInstance.get(`/tasks/personal/${userId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching personal tasks:", error);
		throw error;
	}
};

export const fetch_task_statuses = async () => {
	try {
		const response = await axiosInstance.get(`/tasks/status`);
		return response.data;
	} catch (error) {
		console.error("Error fetching task statuses:", error);
		throw error;
	}
};

export const fetch_wells_work_orders = async (wellId) => {
	try {
		const response = await axiosInstance.get(`/wells/work-orders/${wellId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching wells work orders:", error);
		throw error;
	}
};

export const get_all_users = async () => {
	try {
		const response = await axiosInstance.get(`/user`);
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const get_users_by_clientId = async (clientId) => {
	try {
		const response = await axiosInstance.get(`/user/getByClientId/${clientId}`);
		return response.data;
	} catch (error) {
		console.error("Error fetching users:", error);
		throw error;
	}
};

export const update_user = async (id, user) => {
	try {
		const response = await axiosInstance.put(`/user/updateUser/${id}`, user);
		return response.data;
	} catch (error) {
		console.error("Error updating task:", error);
		throw error;
	}
};

export const fetch_work_order_task_comments = async (taskId) => {
	try {
		const response = await axiosInstance.get(
			`/work-order-tasks-comments/${taskId}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching task comments details:", error);
		throw error;
	}
};

export const create_work_order_task_comment = async (taskData) => {
	try {
		const response = await axiosInstance.post(
			`/work-order-task-comments`,
			taskData,
		);
		return response.data;
	} catch (error) {
		console.error("Error creating work order task comment:", error);
		throw error;
	}
};

export const fetch_work_order_task_subtasks = async (taskId) => {
	try {
		const response = await axiosInstance.get(
			`/work-order-tasks-subtasks/${taskId}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error fetching subtasks details:", error);
		throw error;
	}
};

export const create_work_order_task_subtask = async (taskData) => {
	try {
		const response = await axiosInstance.post(
			`/work-order-task-subtasks`,
			taskData,
		);
		return response.data;
	} catch (error) {
		console.error("Error creating work order subtask:", error);
		throw error;
	}
};

export const update_work_order_task_subtask = async (id, taskData) => {
	try {
		const response = await axiosInstance.put(
			`/work-order-task-subtasks/${id}`,
			taskData,
		);
		return response.data;
	} catch (error) {
		console.error("Error updating subtask:", error);
		throw error;
	}
};

export const upload_document = async (taskData) => {
	try {
		const response = await axiosInstance.post(
			`/work-order-task-documents/upload`,
			taskData,
		);
		return response.data;
	} catch (error) {
		console.error("Error creating work order task comment:", error);
		throw error;
	}
};

export const get_documents = async (taskData) => {
	try {
		const response = await axiosInstance.post(
			`/work-order-task-documents/getDocuments`,
			taskData,
		);
		return response.data;
	} catch (error) {
		console.error("Error creating work order task comment:", error);
		throw error;
	}
};

export const delete_document = async (docId) => {
	try {
		const response = await axiosInstance.delete(
			`/work-order-task-documents/delete/${docId}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error creating work order task comment:", error);
		throw error;
	}
};

// Well Complementary Analysis Comments
export const create_well_complementary_analysis_comment = async (
	wellId,
	description,
	createdBy,
) => {
	try {
		const response = await axiosInstance.post(
			`/well/complementary-analysis-comment`,
			{
				wellId,
				description,
				createdBy,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error creating well complementary analysis comment:", error);
		throw error;
	}
};

export const fetch_well_complementary_analysis_comments = async (wellId) => {
	try {
		const response = await axiosInstance.get(
			`/well/complementary-analysis-comments/${wellId}`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching well complementary analysis comments:",
			error,
		);
		throw error;
	}
};

export const update_well_complementary_analysis_comment = async (
	entryId,
	description,
) => {
	try {
		const response = await axiosInstance.put(
			`/well/complementary-analysis-comment/${entryId}`,
			{
				description,
			},
		);
		return response.data;
	} catch (error) {
		console.error("Error updating well complementary analysis comment:", error);
		throw error;
	}
};

export const delete_well_complementary_analysis_comment = async (entryId) => {
	try {
		const response = await axiosInstance.delete(
			`/well/complementary-analysis-comment/${entryId}`,
		);
		return response.data;
	} catch (error) {
		console.error("Error deleting well complementary analysis comment:", error);
		throw error;
	}
};

// Well Complementary Analysis Future Action Plans
export const create_well_complementary_analysis_future_action_plan = async (
	wellId,
	actionPlanId,
	description,
	year,
	createdBy,
) => {
	try {
		const response = await axiosInstance.post(
			`/well/complementary-analysis-future-action-plan`,
			{
				wellId,
				actionPlanId,
				description,
				year,
				createdBy,
			},
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error creating well complementary analysis future action plan:",
			error,
		);
		throw error;
	}
};

export const fetch_well_complementary_analysis_future_action_plans = async (
	wellId,
) => {
	try {
		const response = await axiosInstance.get(
			`/well/complementary-analysis-future-action-plans/${wellId}`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error fetching well complementary analysis future action plans:",
			error,
		);
		throw error;
	}
};

export const update_well_complementary_analysis_future_action_plan = async (
	entryId,
	actionPlanId,
	description,
	year,
) => {
	try {
		const response = await axiosInstance.put(
			`/well/complementary-analysis-future-action-plan/${entryId}`,
			{
				actionPlanId,
				description,
				year,
			},
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error updating well complementary analysis future action plan:",
			error,
		);
		throw error;
	}
};

export const delete_well_complementary_analysis_future_action_plan = async (
	entryId,
) => {
	try {
		const response = await axiosInstance.delete(
			`/well/complementary-analysis-future-action-plan/${entryId}`,
		);
		return response.data;
	} catch (error) {
		console.error(
			"Error deleting well complementary analysis future action plan:",
			error,
		);
		throw error;
	}
};
