import React from "react";
import { StyledContainer } from "./CommentsAndSubTasks.styles";
import SubTasks from "./components/sub-tasks/SubTasks";
import CommentsCopy from "./components/comments/CommentsCopy";
import Documents from "./components/documents/Documents";
import { useTranslation } from "react-i18next";
import Title from "antd/es/typography/Title";

const CommentsAndSubTasks = ({ taskDetails }) => {
	const { t } = useTranslation();

	return (
		<StyledContainer>
			<Title level={5}>Sub tareas</Title>
			<SubTasks taskDetails={taskDetails} t={t} />
			<br />
			<Title level={5}>Comentarios</Title>
			<CommentsCopy taskDetails={taskDetails} t={t} />
			<br />
			<Title level={5}>Documentos</Title>
			<Documents taskDetails={taskDetails} t={t} />
			{/* <StyledTabs defaultActiveKey="1">
				<TabPane
					tab={`${t("tasks.taskDetails.comments")}${
						comments ? ` (${comments.length})` : ""
					}`}
					key="1"
				>
					<CommentsCopy taskDetails={taskDetails} t={t} />
				</TabPane>
				<TabPane
					tab={`${t("tasks.taskDetails.subTasks")}${
						subtasks ? ` (${subtasks.length})` : ""
					}`}
					key="2"
				>
					<SubTasks taskDetails={taskDetails} t={t} />
				</TabPane>

				<TabPane
					tab={`${t("tasks.taskDetails.documents")}${
						documents ? ` (${documents.length})` : ""
					}`}
					key="4"
				>
					<Documents taskDetails={taskDetails} t={t} />
				</TabPane>
			</StyledTabs> */}
		</StyledContainer>
	);
};

export default CommentsAndSubTasks;
