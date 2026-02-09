import React, { useEffect, useState, useMemo } from "react";
import {
	Form,
	Input,
	DatePicker,
	Select,
	Row,
	Col,
	Empty,
	Spin,
	message,
} from "antd";
import { Styled } from "./TaskDetail.styles";
import FormItem from "../../../../../../components/common/FormItem";
import dayjs from "dayjs";
import {
	update_task,
	fetch_task_statuses,
	get_all_users,
	get_users_by_clientId,
} from "../../../../../../services/general";
import CommentsAndSubTasks from "./components/CommentsAndSubTasks";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../../context/AuthContext";

// At the top of your file, add this configuration
message.config({
	bottom: 0, // Distance from the bottom in pixels
	duration: 2, // Duration in seconds
});

function TaskDetail({ initialValues, taskDetails, loading, onSuccess }) {
	const [form] = Form.useForm();
	const { dbUser } = useAuth();
	const [isUpdating, setIsUpdating] = useState(false);
	const formValues = Form.useWatch([], form);
	const [statusOptions, setStatusOptions] = useState([]);
	const [emailOptions, setEmailOptions] = useState([]);
	const [responsibleOptions, setResponsibleOptions] = useState([]);
	const [loadingUsers, setLoadingUsers] = useState(false);
	const { t } = useTranslation();

	// console.log("TASK DETAILS", taskDetails);
	const priority_options = [
		{
			value: "ALTA",
			label: t(`tasks.addTaskModal.priorityOptions.ALTA`),
		},
		{
			value: "MEDIA",
			label: t(`tasks.addTaskModal.priorityOptions.MEDIA`),
		},
		{
			value: "BAJA",
			label: t(`tasks.addTaskModal.priorityOptions.BAJA`),
		},
	];

	useEffect(() => {
		if (taskDetails) {
			form.setFieldsValue({
				task_id: taskDetails.task_id,
				task: taskDetails.task_name,
				responsable: taskDetails.responsable,
				priority: taskDetails.priority,
				status: taskDetails.status?.toLowerCase() || "todo",
				startDate: taskDetails.start_date
					? dayjs(taskDetails.start_date)
					: undefined,
				dueDate: taskDetails.due_date ? dayjs(taskDetails.due_date) : undefined,
				notes: taskDetails.additional_comments,
				notificated: taskDetails.notify_to,
			});
		} else if (initialValues) {
			form.setFieldsValue(initialValues);
		}
	}, [taskDetails, initialValues, form]);

	useEffect(() => {
		const getStatusOptions = async () => {
			try {
				const statuses = await fetch_task_statuses();
				const formattedOptions = statuses.map((status) => ({
					value: status.code,
					label: t(`tasks.statuses.${status.code}`),
				}));
				setStatusOptions(formattedOptions);
			} catch (error) {
				console.error("Failed to fetch task statuses:", error);
			}
		};

		getStatusOptions();
	}, []);

	// Add useEffect to fetch users
	useEffect(() => {
		const fetchUsers = async () => {
			setLoadingUsers(true);
			try {
				const users = await get_users_by_clientId(dbUser?.client_id);

				// Transform users data into email options format
				const emailOpts = users.map((user) => ({
					value: user.email,
					label: `${user.name} ${user.lastname}`,
				}));

				// Transform users data into responsible options format
				const responsibleOpts = users.map((user) => ({
					value: `${user.id}`,
					label: `${user.name} ${user.lastname}`,
				}));

				setEmailOptions(emailOpts);
				setResponsibleOptions(responsibleOpts);
			} catch (error) {
				console.error("Error fetching users:", error);
				message.error("Failed to load users");
			} finally {
				setLoadingUsers(false);
			}
		};

		fetchUsers();
	}, []);

	//CALCULA LA CANIDAD DE FILAS PARA NOTAS
	const calculateRows = useMemo(() => {
		if (!formValues?.notes) return 1;
		const lineBreaks = (formValues.notes.match(/\n/g) || []).length;
		const estimatedRows = Math.ceil(
			(formValues.notes.length + lineBreaks) / 50,
		);
		return Math.min(Math.max(estimatedRows, 1), 4); // Minimum 1 row, maximum 4 rows
	}, [formValues?.notes]);

	const handleSubmit = async (values) => {
		try {
			if (!values.task) {
				message.error(t("tasks.taskDetails.taskRequired"));
				return;
			}

			setIsUpdating(true);
			console.log(values.notificated.join(","));
			const taskData = {
				id: taskDetails.id,
				id_work_order: taskDetails.id_work_order,
				task_id: parseInt(taskDetails.task_id),
				responsable: values.responsable || "",
				priority: values.priority || "",
				status: values.status || "pending",
				start_date: values.startDate ? values.startDate.toISOString() : null,
				due_date: values.dueDate ? values.dueDate.toISOString() : null,
				additional_comments: values.notes || "",
				notificated: values.notificated ? values.notificated.join(",") : "",
			};

			await update_task(taskData);
			message.success({
				content: t("tasks.taskDetails.updatedTask"),
			});

			if (typeof onSuccess === "function") {
				onSuccess();
			}
		} catch (error) {
			console.error("Error updating task:", error);
			message.error(
				t("tasks.taskDetails.updateFailed") +
					": " +
					(error.message || "Unknown error"),
			);
		} finally {
			setIsUpdating(false);
		}
	};

	const handleValuesChange = () => {
		form.submit();
	};

	if (loading) {
		return <Spin />;
	}

	if (!taskDetails) {
		return <Empty description={t("tasks.taskDetails.selectTask")} />;
	}

	return (
		<Styled.Container>
			<br />
			<Form
				onFinish={handleSubmit}
				initialValues={initialValues}
				form={form}
				onValuesChange={(changedValues, allValues) => {
					if (!changedValues.notificated) {
						form.submit();
					}
				}}
			>
				<Styled.FormContainer>
					<Styled.VariablesContainer>
						<Row>
							<Col span={24}>
								<FormItem
									label={t("tasks.addTaskModal.task")}
									name="task"
									width="100%"
									value={formValues?.task}
									inputComponent={
										<Input
											disabled={true}
											placeholder={t("tasks.addTaskModal.task")}
										/>
									}
								/>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem
									label={t("tasks.addTaskModal.priority")}
									name="priority"
									width="100%"
									value={formValues?.priority}
									inputComponent={
										<Select allowClear options={priority_options} />
									}
								/>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem
									label={t("tasks.taskDetails.status")}
									name="status"
									width="100%"
									value={formValues?.status}
									inputComponent={<Select allowClear options={statusOptions} />}
								/>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem
									label={t("tasks.addTaskModal.responsible")}
									name="responsable"
									value={formValues?.responsable}
									inputComponent={
										<Select
											options={responsibleOptions}
											loading={loadingUsers}
											placeholder={t("tasks.addTaskModal.selectResponsible")}
											style={{ width: "100%" }}
										/>
									}
								/>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem
									label={t("tasks.taskDetails.notifyTo")}
									name="notificated"
									width="100%"
									value={formValues?.notificated}
									inputComponent={
										<Select
											mode="multiple"
											options={emailOptions}
											loading={loadingUsers}
											maxTagCount={1}
											style={{ height: 32, width: "100%" }}
										/>
									}
								/>
							</Col>
						</Row>

						<Row>
							<Col span={24}>
								<FormItem
									label={t("tasks.addTaskModal.startDate")}
									name="startDate"
									value={formValues?.startDate}
									inputComponent={
										<DatePicker format="DD/MM/YYYY" allowClear placeholder="" />
									}
								/>
							</Col>
						</Row>
						<Row>
							<Col span={24}>
								<FormItem
									label={t("tasks.addTaskModal.dueDate")}
									name="dueDate"
									width="100%"
									value={formValues?.dueDate}
									inputComponent={
										<DatePicker format="DD/MM/YYYY" allowClear placeholder="" />
									}
								/>
							</Col>
						</Row>

						{/*<Form.Item>
							<Styled.ButtonContainer>
								<Button
									color="primary"
									variant="outlined"
									htmlType="submit"
									loading={isUpdating}
									disabled={isUpdating}
									style={{ width: "100%" }}
								>
									{isUpdating ? "Guardando..." : "Guardar Cambios"}
								</Button>
							</Styled.ButtonContainer>
						</Form.Item>*/}
					</Styled.VariablesContainer>

					<CommentsAndSubTasks taskDetails={taskDetails} />
				</Styled.FormContainer>
			</Form>
			{isUpdating && (
				<div
					style={{
						position: "absolute",
						top: 0,
						left: 0,
						right: 0,
						bottom: 0,
						background: "rgb(250, 250, 250, 0.7)",
						display: "flex",
						justifyContent: "center",
						alignItems: "center",
						zIndex: 1000,
					}}
				>
					<Spin size="large" tip="Actualizando tarea..." />
				</div>
			)}
		</Styled.Container>
	);
}

export default TaskDetail;
