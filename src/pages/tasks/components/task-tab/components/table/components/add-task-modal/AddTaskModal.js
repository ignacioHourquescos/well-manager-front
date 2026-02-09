import React, { useState, useMemo, useEffect } from "react";
import {
	Modal,
	Form,
	Input,
	DatePicker,
	Select,
	Button,
	message,
	Row,
	Col,
} from "antd";
import { useParams, useSearchParams } from "react-router-dom";
import FormItem from "../../../../../../../../components/common/FormItem";
import {
	fetch_task_descriptions_by_action_plan,
	get_all_users,
	get_users_by_clientId,
} from "../../../../../../../../services/general";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../../../../../../../context/AuthContext";

const { TextArea } = Input;

const AddTaskModal = ({ open, onClose, onSubmit }) => {
	const [form] = Form.useForm();
	const { dbUser } = useAuth();
	const [loading, setLoading] = useState(false);
	const formValues = Form.useWatch([], form);
	const [taskOptions, setTaskOptions] = useState([]);
	const [emailOptions, setEmailOptions] = useState([]);
	const [responsibleOptions, setResponsibleOptions] = useState([]);
	const [loadingEmails, setLoadingEmails] = useState(false);
	const [searchParams] = useSearchParams();
	const actionPlanId = searchParams.get("action_plan_id");
	const { t } = useTranslation();

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

	// Add this useEffect to fetch task descriptions when modal opens
	useEffect(() => {
		const fetchTaskDescriptions = async () => {
			try {
				const data = await fetch_task_descriptions_by_action_plan(
					parseInt(actionPlanId),
				);

				// Transform the data into options format for Select
				const options = data.map((task) => ({
					value: task.task_id,
					label: `${task.task_id} - ${t(`definedTasks.${task.task_id}`)}`,
				}));

				setTaskOptions(options);
			} catch (error) {
				console.error("Error fetching task descriptions:", error);
				message.error("Failed to load task descriptions");
			}
		};

		if (open && actionPlanId) {
			fetchTaskDescriptions();
		}
	}, [open, actionPlanId]);

	// Add useEffect to fetch users for email notifications
	useEffect(() => {
		const fetchUsers = async () => {
			setLoadingEmails(true);
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
				message.error("Failed to load users for notifications");
			} finally {
				setLoadingEmails(false);
			}
		};

		if (open) {
			fetchUsers();
		}
	}, [open]);

	// Calculate rows for TextArea
	const calculateRows = useMemo(() => {
		if (!formValues?.additional_comments) return 1;
		const lineBreaks = (formValues.additional_comments.match(/\n/g) || [])
			.length;
		const estimatedRows = Math.ceil(
			(formValues.additional_comments.length + lineBreaks) / 50,
		);
		return Math.min(Math.max(estimatedRows, 1), 4);
	}, [formValues?.additional_comments]);

	const handleSubmit = async () => {
		try {
			setLoading(true);
			const values = await form.validateFields();
			await onSubmit(values);
			form.resetFields();
			onClose();
		} catch (error) {
			console.error("Error submitting task:", error);
			message.error(error.message || "Failed to submit task");
		} finally {
			setLoading(false);
		}
	};

	return (
		<Modal
			title={t("tasks.addTaskModal.title")}
			open={open}
			onCancel={onClose}
			footer={[
				<Button key="cancel" onClick={onClose}>
					{t("tasks.addTaskModal.cancel")}
				</Button>,
				<Button
					key="submit"
					type="primary"
					loading={loading}
					onClick={handleSubmit}
				>
					{t("tasks.addTaskModal.add")}
				</Button>,
			]}
		>
			<Form form={form} layout="vertical" name="addTaskForm">
				<Row>
					<Col span={24}>
						<FormItem
							label={t("tasks.addTaskModal.task")}
							name="task_id"
							rules={[
								{ required: true, message: t("tasks.addTaskModal.selectTask") },
							]}
							value={formValues?.task_id}
							inputComponent={
								<Select options={taskOptions} loading={!taskOptions.length} />
							}
						/>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label={t("tasks.addTaskModal.responsible")}
							name="responsable"
							rules={[
								{
									required: true,
									message: t("tasks.addTaskModal.selectResponsible"),
								},
							]}
							value={formValues?.responsable}
							inputComponent={
								<Select
									options={responsibleOptions}
									placeholder=""
									style={{ width: "100%" }}
								/>
							}
						/>
					</Col>

					<Col span={12}>
						<FormItem
							label={t("tasks.addTaskModal.priority")}
							name="priority"
							rules={[
								{
									required: true,
									message: t("tasks.addTaskModal.selectPriority"),
								},
							]}
							value={formValues?.priority}
							inputComponent={<Select options={priority_options} />}
						/>
					</Col>
				</Row>

				<Row gutter={16}>
					<Col span={12}>
						<FormItem
							label={t("tasks.addTaskModal.startDate")}
							name="start_date"
							rules={[
								{
									required: true,
									message: t("tasks.addTaskModal.selectStartDate"),
								},
							]}
							value={formValues?.start_date}
							inputComponent={
								<DatePicker
									format="DD/MM/YYYY"
									style={{ width: "100%" }}
									placeholder=""
								/>
							}
						/>
					</Col>

					<Col span={12}>
						<FormItem
							label={t("tasks.addTaskModal.dueDate")}
							name="due_date"
							rules={[
								{
									required: true,
									message: t("tasks.addTaskModal.selectDueDate"),
								},
							]}
							value={formValues?.due_date}
							inputComponent={
								<DatePicker
									format="DD/MM/YYYY"
									style={{ width: "100%" }}
									placeholder=""
								/>
							}
						/>
					</Col>
				</Row>

				<Row>
					<Col span={12}>
						<FormItem
							label={t("tasks.addTaskModal.comments")}
							name="additional_comments"
							value={formValues?.additional_comments}
							rules={[
								{ max: 500, message: t("tasks.addTaskModal.maxCharacters") },
							]}
							inputComponent={
								<TextArea
									rows={calculateRows}
									autoSize={{ minRows: 1, maxRows: 4 }}
								/>
							}
						/>
					</Col>
					<Col span={12}>
						<FormItem
							label={t("tasks.taskDetails.notifyTo")}
							name="notificated"
							value={formValues?.notificated}
							inputComponent={
								<Select
									mode="multiple"
									options={emailOptions}
									loading={loadingEmails}
									style={{ height: 32, width: "100%" }}
								/>
							}
						/>
					</Col>
				</Row>
			</Form>
		</Modal>
	);
};

export default AddTaskModal;
