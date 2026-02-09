import React, { useState, useEffect } from "react";
import { Checkbox, Input, List, notification, Typography, Button } from "antd";
import {
	create_work_order_task_subtask,
	fetch_work_order_task_subtasks,
	update_work_order_task_subtask,
} from "../../../../../../../../../services/general";

const { Link } = Typography;

const SubTasks = ({ taskDetails, t }) => {
	const [subtasks, setSubtasks] = useState([]);
	const [isAddingSubtask, setIsAddingSubtask] = useState(false);
	const [newSubtaskTitle, setNewSubtaskTitle] = useState("");

	useEffect(() => {
		async function fetchSubtasks() {
			const data = await fetch_work_order_task_subtasks(taskDetails.id);
			setSubtasks(data);
		}
		fetchSubtasks();
	}, [taskDetails.id]);

	const handleAddSubtask = async () => {
		if (!newSubtaskTitle.trim()) return;

		const postData = {
			work_order_task_id: taskDetails.id,
			title: newSubtaskTitle.trim(),
			completed: false,
		};

		try {
			const res = await create_work_order_task_subtask(postData);
			setSubtasks([...subtasks, res]);
			setNewSubtaskTitle("");
			setIsAddingSubtask(false);
		} catch (error) {
			notification.error({ message: "Error al crear la subtarea" });
		}
	};

	const handleInputChange = (index, value) => {
		const updated = [...subtasks];
		updated[index].title = value;
		setSubtasks(updated);
	};

	const handleInputBlur = async (index) => {
		const subtask = subtasks[index];
		try {
			await update_work_order_task_subtask(subtask.id, {
				title: subtask.title,
				completed: subtask.completed,
			});
			notification.success({ message: "Subtarea actualizada con éxito" });
		} catch (error) {
			notification.error({ message: "Error al actualizar la subtarea" });
		}
	};

	const handleCheckboxChange = async (index) => {
		const updated = [...subtasks];
		updated[index].completed = !updated[index].completed;
		setSubtasks(updated);

		try {
			await update_work_order_task_subtask(updated[index].id, {
				title: updated[index].title,
				completed: updated[index].completed,
			});
			notification.success({ message: "Subtarea actualizada con éxito" });
		} catch (error) {
			notification.error({ message: "Error al actualizar la subtarea" });
		}
	};

	return (
		<div>
			{subtasks.length > 0 && (
				<List
					bordered={false}
					dataSource={subtasks}
					renderItem={(item, index) => (
						<List.Item style={{ border: "none", padding: "5px" }}>
							<Checkbox
								checked={item.completed}
								onChange={() => handleCheckboxChange(index)}
							/>
							<Input
								value={item.title}
								onChange={(e) => handleInputChange(index, e.target.value)}
								onBlur={() => handleInputBlur(index)}
								placeholder={t("tasks.taskDetails.inputSubTask")}
							/>
						</List.Item>
					)}
				/>
			)}

			{isAddingSubtask && (
				<div style={{ marginTop: "12px" }}>
					<Input
						value={newSubtaskTitle}
						onChange={(e) => setNewSubtaskTitle(e.target.value)}
						placeholder={t("tasks.taskDetails.inputSubTask")}
					/>
					<Button
						type="primary"
						onClick={handleAddSubtask}
						style={{ marginTop: "8px" }}
					>
						{t("tasks.taskDetails.sendSubTask") || "Enviar subtarea"}
					</Button>
				</div>
			)}

			{!isAddingSubtask && (
				<Link
					onClick={() => setIsAddingSubtask(true)}
					style={{
						fontSize: "14px",
						marginBottom: "10px",
						marginTop: "20px",
						display: "inline-block",
					}}
				>
					{t("tasks.taskDetails.addSubTask")}
				</Link>
			)}
		</div>
	);
};

export default SubTasks;
