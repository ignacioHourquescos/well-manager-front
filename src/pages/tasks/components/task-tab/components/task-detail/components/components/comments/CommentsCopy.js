import React, { useState, useEffect } from "react";
import { Input, List, Typography, Button } from "antd";
import {
	create_work_order_task_comment,
	fetch_work_order_task_comments,
} from "../../../../../../../../../services/general";
import { useAuth } from "../../../../../../../../../context/AuthContext";

const { Link } = Typography;

const CommentsCopy = ({ taskDetails, t }) => {
	const { dbUser } = useAuth();
	const [comments, setComments] = useState([]);
	const [isAddingComment, setIsAddingComment] = useState(false);
	const [newCommentText, setNewCommentText] = useState("");

	useEffect(() => {
		async function fetchComments() {
			const data = await fetch_work_order_task_comments(taskDetails.id);
			setComments(data);
		}
		fetchComments();
	}, [taskDetails.id]);

	const handleSubmitNewComment = async () => {
		if (!newCommentText.trim()) return;

		const postData = {
			work_order_task_id: taskDetails.id,
			user_id: dbUser.id,
			user_name: dbUser.name + " " + dbUser.lastname,
			text: newCommentText.trim(),
		};

		const res = await create_work_order_task_comment(postData);
		setComments([...comments, res]);
		setNewCommentText("");
		setIsAddingComment(false);
	};

	return (
		<div>
			{comments.length > 0 && (
				<List
					bordered={false}
					dataSource={comments}
					renderItem={(item) => (
						<>
							<List.Item style={{ border: "none", padding: "4px 0" }}>
								<span style={{ fontWeight: "500" }}>{item.user_name}</span>
								{item.created_at &&
									!isNaN(new Date(item.created_at).getTime()) && (
										<span style={{ marginLeft: "8px", marginRight: "8px" }}>
											- {new Date(item.created_at).toLocaleDateString("es-ES")}{" "}
											:
										</span>
									)}
								{item.text}
							</List.Item>
						</>
					)}
				/>
			)}

			{isAddingComment && (
				<div style={{ marginTop: "12px" }}>
					<Input.TextArea
						rows={1}
						value={newCommentText}
						onChange={(e) => setNewCommentText(e.target.value)}
						placeholder={t("tasks.taskDetails.inputComment")}
					/>
					<Button
						type="primary"
						onClick={handleSubmitNewComment}
						style={{ marginTop: "8px" }}
					>
						{t("tasks.taskDetails.sendComment")}
					</Button>
				</div>
			)}

			{!isAddingComment && (
				<Link
					onClick={() => setIsAddingComment(true)}
					style={{
						fontSize: "14px",
						marginBottom: "10px",
						marginTop: "20px",
						display: "inline-block",
					}}
				>
					{t("tasks.taskDetails.addComment")}
				</Link>
			)}
		</div>
	);
};

export default CommentsCopy;
