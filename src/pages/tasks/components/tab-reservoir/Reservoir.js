import React, { useState, useEffect } from "react";
import {
	Modal,
	Button,
	Select,
	Input,
	Typography,
	Card,
	Row,
	Col,
	message,
	Form,
} from "antd";
import {
	FileTextOutlined,
	EditOutlined,
	DeleteOutlined,
} from "@ant-design/icons";
import { Container, LeftColumn, RightColumn } from "./Reservoir.styles";
import RenderFormContent from "./components/RenderFormContent";
import { useTranslation } from "react-i18next";
import {
	delete_document,
	get_documents,
	upload_document,
	fetch_action_plan,
	create_well_complementary_analysis_comment,
	fetch_well_complementary_analysis_comments,
	update_well_complementary_analysis_comment,
	delete_well_complementary_analysis_comment,
	create_well_complementary_analysis_future_action_plan,
	fetch_well_complementary_analysis_future_action_plans,
	update_well_complementary_analysis_future_action_plan,
	delete_well_complementary_analysis_future_action_plan,
} from "../../../../services/general";
import { Typo } from "../../../../theme";

const { Option } = Select;
const { TextArea } = Input;
const { Link } = Typography;

const Reservoir = ({ currentWellData }) => {
	const [form] = Form.useForm();
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [isModalVisible, setIsModalVisible] = useState(false);
	const [analysisType, setAnalysisType] = useState(null);
	const [selectedActionPlan, setSelectedActionPlan] = useState(null);
	const [linkedTo, setLinkedTo] = useState("");
	const [estimatedYear, setEstimatedYear] = useState(null);
	const [comment, setComment] = useState("");
	const [analyses, setAnalyses] = useState([]);
	const [selectedAnalysis, setSelectedAnalysis] = useState(null);
	const { t } = useTranslation();
	const [selectedFile, setSelectedFile] = useState(null);
	const [actionPlans, setActionPlans] = useState([]);
	const [reportDate, setReportDate] = useState(null);
	const [reportDescription, setReportDescription] = useState("");
	const [reportType, setReportType] = useState(null);
	const [isEditingComment, setIsEditingComment] = useState(false);
	const [editingCommentText, setEditingCommentText] = useState("");
	const [isEditingFutureActionPlan, setIsEditingFutureActionPlan] =
		useState(false);
	const [editingFutureActionPlan, setEditingFutureActionPlan] = useState({
		actionPlanId: null,
		description: "",
		year: null,
	});

	// Load action plans
	useEffect(() => {
		const loadActionPlans = async () => {
			try {
				const data = await fetch_action_plan();
				const formattedActionPlans = data.map((plan) => ({
					id: plan.id_action_plan,
					code: plan.code,
					name: t(`actionPlans.${plan.code}.name`),
				}));
				setActionPlans(formattedActionPlans);
			} catch (error) {
				console.error("Error loading action plans:", error);
				message.error(t("tasks.pageActions.loadFailed"));
			}
		};
		loadActionPlans();
	}, [t]);

	// Load existing analyses from localStorage
	useEffect(() => {
		const fetch_analyses = async () => {
			try {
				// Fetch documents
				const postData = {
					wellId: currentWellData.id_well,
				};
				const documents = await get_documents(postData);

				// Fetch comments
				const commentsResponse =
					await fetch_well_complementary_analysis_comments(
						currentWellData.id_well,
					);
				const comments = commentsResponse.data || [];

				// Fetch future action plans
				const futureActionPlansResponse =
					await fetch_well_complementary_analysis_future_action_plans(
						currentWellData.id_well,
					);
				const futureActionPlans = futureActionPlansResponse.data || [];

				// Format documents
				const formattedDocuments =
					documents?.map((i) => ({
						...i,
						type: "evaluation_doc",
						date: i.created_at,
						data: {
							documentName: i.name,
							documentUrl: i.url,
							documentId: i.id,
							reportType: i.report_type,
							reportDate: i.report_date,
							reportDescription: i.report_description,
						},
					})) || [];

				// Format comments
				const formattedComments = comments.map((comment) => ({
					type: "comment",
					date: comment.created_at,
					entry_id: comment.entry_id,
					data: {
						comment: comment.description,
						created_by_name: comment.created_by_name,
						created_by_lastname: comment.created_by_lastname,
						created_by_email: comment.created_by_email,
					},
				}));

				// Format future action plans
				const formattedFutureActionPlans = futureActionPlans.map((plan) => ({
					type: "action_plan_proposal",
					date: plan.created_at,
					entry_id: plan.entry_id,
					data: {
						actionPlanCode: plan.action_plan_code,
						actionPlanName: plan.action_plan_name,
						linkedTo: plan.description,
						estimatedYear: plan.year,
						created_by_name: plan.created_by_name,
						created_by_lastname: plan.created_by_lastname,
						created_by_email: plan.created_by_email,
					},
				}));

				// Combine all analyses
				setAnalyses([
					...formattedDocuments,
					...formattedComments,
					...formattedFutureActionPlans,
				]);
			} catch (error) {
				console.error("Error fetching analyses:", error);
				message.error(t("tasks.reservoir.loadError"));
			}
		};
		fetch_analyses();
	}, [currentWellData.id_well, t]);

	const showModal = () => {
		setIsModalVisible(true);
	};

	const handleCancel = () => {
		setIsModalVisible(false);
		resetForm();
	};

	const handleOk = async () => {
		if (!analysisType) return;

		setIsSubmitting(true);
		try {
			// Validar el formulario si es un informe especial
			if (analysisType === "evaluation_doc") {
				try {
					await form.validateFields();
				} catch (error) {
					setIsSubmitting(false);
					return;
				}
			}

			// Recolectar toda la información del formulario para mostrar en consola
			const formInfo = {
				analysisType,
				actionPlanData: {
					selectedActionPlan,
					linkedTo,
					estimatedYear: estimatedYear?.year(),
				},
				reportData: {
					reportType,
					reportDate: reportDate?.format("YYYY-MM-DD"),
					reportDescription,
					selectedFileName: selectedFile?.name,
				},
				commentData: {
					comment,
				},
			};

			console.log("Form data collected:", formInfo);

			const newAnalysis = {
				type: analysisType,
				date: new Date().toISOString(),
				data: {},
			};

			// Add specific data based on analysis type
			switch (analysisType) {
				case "action_plan_proposal":
					if (!selectedActionPlan || !linkedTo || !estimatedYear) return;

					// Get user data from localStorage
					const userDataAP = JSON.parse(
						localStorage.getItem("user-data") || "{}",
					);
					const userIdAP = userDataAP.id;

					// Find the action plan ID from the code
					const selectedPlan = actionPlans.find(
						(plan) => plan.code === selectedActionPlan,
					);
					const actionPlanId = selectedPlan ? parseInt(selectedPlan.id) : null;

					try {
						const response =
							await create_well_complementary_analysis_future_action_plan(
								currentWellData.id_well,
								actionPlanId,
								linkedTo,
								estimatedYear.year(),
								userIdAP,
							);

						if (response.success) {
							newAnalysis.entry_id = response.data.id;
							newAnalysis.data = {
								actionPlanCode: selectedActionPlan,
								actionPlanName: selectedPlan?.name,
								linkedTo: linkedTo,
								estimatedYear: estimatedYear.year(),
								created_by_name: userDataAP.name,
								created_by_lastname: userDataAP.lastname,
								created_by_email: userDataAP.email,
							};
							message.success(t("tasks.reservoir.futureActionPlanAdded"));
						}
					} catch (error) {
						console.error("Error creating future action plan:", error);
						message.error(t("tasks.reservoir.futureActionPlanError"));
						return;
					}
					break;
				case "evaluation_doc":
					if (!selectedFile || !reportType || !reportDate) return;

					const formData = new FormData();
					formData.append("file", selectedFile);
					formData.append("wellId", currentWellData.id_well);
					formData.append("type", "evaluation_doc");
					formData.append("reportType", reportType);
					formData.append("reportDate", reportDate.format("YYYY-MM-DD"));
					formData.append("reportDescription", reportDescription || "");

					const res = await upload_document(formData);

					if (res) {
						newAnalysis.data = {
							documentName: res.name,
							documentUrl: res.url,
							documentId: res.id,
							reportType: res.report_type || reportType,
							reportDate: res.report_date || reportDate.format("YYYY-MM-DD"),
							reportDescription: res.report_description || reportDescription,
						};
					}
					break;
				case "comment":
					if (!comment) return;

					// Get user data from localStorage
					const userData = JSON.parse(
						localStorage.getItem("user-data") || "{}",
					);
					const userId = userData.id;

					try {
						const response = await create_well_complementary_analysis_comment(
							currentWellData.id_well,
							comment,
							userId,
						);

						if (response.success) {
							newAnalysis.entry_id = response.data.id;
							newAnalysis.data = {
								comment: comment,
								created_by_name: userData.name,
								created_by_lastname: userData.lastname,
								created_by_email: userData.email,
							};
							message.success(t("tasks.reservoir.commentAdded"));
						}
					} catch (error) {
						console.error("Error creating comment:", error);
						message.error(t("tasks.reservoir.commentError"));
						return;
					}
					break;
				default:
					return;
			}

			// Add new analysis to the list
			const updatedAnalyses = [...analyses, newAnalysis];

			// Update state
			setAnalyses(updatedAnalyses);

			// Reset and close modal
			setIsModalVisible(false);
			resetForm();
		} catch (error) {
			console.error("Error submitting analysis:", error);
			message.error(t("tasks.reservoir.submitError"));
		} finally {
			setIsSubmitting(false);
		}
	};

	const resetForm = () => {
		setAnalysisType(null);
		setSelectedActionPlan(null);
		setLinkedTo("");
		setEstimatedYear(null);
		setComment("");
		setSelectedFile(null);
		setReportDate(null);
		setReportDescription("");
		setReportType(null);
		form.resetFields();
	};

	const renderFormContent = () => {
		const actionPlanData = {
			selectedActionPlan,
			setSelectedActionPlan,
			linkedTo,
			setLinkedTo,
			estimatedYear,
			setEstimatedYear,
			actionPlans,
		};

		const reportData = {
			reportType,
			setReportType,
			reportDate,
			setReportDate,
			reportDescription,
			setReportDescription,
			selectedFile,
			setSelectedFile,
		};

		const commentData = {
			comment,
			setComment,
		};

		return (
			<RenderFormContent
				analysisType={analysisType}
				actionPlanData={actionPlanData}
				reportData={reportData}
				commentData={commentData}
				form={form}
			/>
		);
	};

	const getAnalysisTitle = (type) => {
		return (
			t(`tasks.reservoir.analysisTypes.${type}`) ||
			t("tasks.reservoir.analysisTypes.default")
		);
	};

	const getAnalysisContent = (analysis) => {
		switch (analysis.type) {
			case "action_plan_proposal":
				return (
					<>
						<p style={{ margin: 0, wordBreak: "break-word" }}>
							{t(`actionPlans.${analysis.data.actionPlanCode}.name`)}
						</p>
					</>
				);
			case "evaluation_doc":
				return (
					<p style={{ margin: 0, wordBreak: "break-word" }}>
						<a
							href={analysis.data.documentUrl}
							target="_blank"
							rel="noreferrer"
						>
							{analysis.data.documentName}
						</a>
					</p>
				);
			case "comment":
				return (
					<p style={{ margin: 0, wordBreak: "break-word" }}>
						{analysis.data.comment.length > 50
							? analysis.data.comment.substring(0, 50) + "..."
							: analysis.data.comment}
					</p>
				);
			default:
				return null;
		}
	};

	const handleCardClick = (analysis) => {
		setSelectedAnalysis(analysis);
		if (analysis.type === "comment") {
			setEditingCommentText(analysis.data.comment);
			setIsEditingComment(false);
		} else if (analysis.type === "action_plan_proposal") {
			// Find the action plan object from the code
			const plan = actionPlans.find(
				(p) => p.code === analysis.data.actionPlanCode,
			);
			setEditingFutureActionPlan({
				actionPlanId: plan ? plan.id : null,
				description: analysis.data.linkedTo || "",
				year: analysis.data.estimatedYear,
			});
			setIsEditingFutureActionPlan(false);
		}
	};

	const handleDelete = async (documentId) => {
		Modal.confirm({
			title: t("tasks.reservoir.confirmDeleteTitle"),
			content: t("tasks.reservoir.confirmDeleteText"),
			okText: t("tasks.common.confirm"),
			cancelText: t("tasks.common.cancel"),
			okButtonProps: { danger: true },
			onOk: async () => {
				try {
					await delete_document(documentId);
					setAnalyses((prev) =>
						prev.filter((a) => a.data.documentId !== documentId),
					);
					message.success(t("tasks.reservoir.documentDeleted"));
				} catch (err) {
					console.error("Error al eliminar documento:", err);
					message.error(t("tasks.reservoir.errorDeleting"));
				}
			},
		});
	};

	const handleDeleteComment = async (entryId) => {
		Modal.confirm({
			title: t("tasks.reservoir.confirmDeleteTitle"),
			content: t("tasks.reservoir.confirmDeleteCommentText"),
			okText: t("tasks.common.confirm"),
			cancelText: t("tasks.common.cancel"),
			okButtonProps: { danger: true },
			onOk: async () => {
				try {
					const response =
						await delete_well_complementary_analysis_comment(entryId);
					if (response.success) {
						setAnalyses((prev) => prev.filter((a) => a.entry_id !== entryId));
						setSelectedAnalysis(null);
						message.success(t("tasks.reservoir.commentDeleted"));
					}
				} catch (err) {
					console.error("Error al eliminar comentario:", err);
					message.error(t("tasks.reservoir.errorDeletingComment"));
				}
			},
		});
	};

	const handleUpdateComment = async () => {
		if (!editingCommentText.trim()) {
			message.warning(t("tasks.reservoir.commentEmpty"));
			return;
		}

		try {
			const response = await update_well_complementary_analysis_comment(
				selectedAnalysis.entry_id,
				editingCommentText,
			);

			if (response.success) {
				// Update the comment in the analyses list
				setAnalyses((prev) =>
					prev.map((a) =>
						a.entry_id === selectedAnalysis.entry_id
							? { ...a, data: { ...a.data, comment: editingCommentText } }
							: a,
					),
				);

				// Update selected analysis
				setSelectedAnalysis({
					...selectedAnalysis,
					data: { ...selectedAnalysis.data, comment: editingCommentText },
				});

				setIsEditingComment(false);
				message.success(t("tasks.reservoir.commentUpdated"));
			}
		} catch (error) {
			console.error("Error updating comment:", error);
			message.error(t("tasks.reservoir.errorUpdatingComment"));
		}
	};

	const handleDeleteFutureActionPlan = async (entryId) => {
		Modal.confirm({
			title: t("tasks.reservoir.confirmDeleteTitle"),
			content: t("tasks.reservoir.confirmDeleteFutureActionPlanText"),
			okText: t("tasks.common.confirm"),
			cancelText: t("tasks.common.cancel"),
			okButtonProps: { danger: true },
			onOk: async () => {
				try {
					const response =
						await delete_well_complementary_analysis_future_action_plan(
							entryId,
						);
					if (response.success) {
						setAnalyses((prev) => prev.filter((a) => a.entry_id !== entryId));
						setSelectedAnalysis(null);
						message.success(t("tasks.reservoir.futureActionPlanDeleted"));
					}
				} catch (err) {
					console.error("Error al eliminar future action plan:", err);
					message.error(t("tasks.reservoir.errorDeletingFutureActionPlan"));
				}
			},
		});
	};

	const handleUpdateFutureActionPlan = async () => {
		const { actionPlanId, description, year } = editingFutureActionPlan;

		if (!year) {
			message.warning(t("tasks.reservoir.yearRequired"));
			return;
		}

		try {
			const response =
				await update_well_complementary_analysis_future_action_plan(
					selectedAnalysis.entry_id,
					actionPlanId,
					description,
					year,
				);

			if (response.success) {
				// Find the updated action plan info
				const updatedPlan = actionPlans.find((p) => p.id === actionPlanId);

				// Update the future action plan in the analyses list
				setAnalyses((prev) =>
					prev.map((a) =>
						a.entry_id === selectedAnalysis.entry_id
							? {
									...a,
									data: {
										...a.data,
										actionPlanCode: updatedPlan?.code || a.data.actionPlanCode,
										actionPlanName: updatedPlan?.name || a.data.actionPlanName,
										linkedTo: description,
										estimatedYear: year,
									},
								}
							: a,
					),
				);

				// Update selected analysis
				setSelectedAnalysis({
					...selectedAnalysis,
					data: {
						...selectedAnalysis.data,
						actionPlanCode:
							updatedPlan?.code || selectedAnalysis.data.actionPlanCode,
						actionPlanName:
							updatedPlan?.name || selectedAnalysis.data.actionPlanName,
						linkedTo: description,
						estimatedYear: year,
					},
				});

				setIsEditingFutureActionPlan(false);
				message.success(t("tasks.reservoir.futureActionPlanUpdated"));
			}
		} catch (error) {
			console.error("Error updating future action plan:", error);
			message.error(t("tasks.reservoir.errorUpdatingFutureActionPlan"));
		}
	};

	const renderDetailContent = () => {
		if (!selectedAnalysis) {
			return <p>{t("tasks.reservoir.details.selectToView")}</p>;
		}

		return (
			<div>
				{selectedAnalysis.type === "action_plan_proposal" && (
					<>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<h3 style={{ margin: 0 }}>
								{t("tasks.reservoir.details.actionPlanProposal")}
							</h3>
							<div>
								<Button
									type="text"
									icon={<EditOutlined />}
									onClick={() =>
										setIsEditingFutureActionPlan(!isEditingFutureActionPlan)
									}
									style={{ marginRight: 8 }}
								/>
								<Button
									type="text"
									danger
									icon={<DeleteOutlined />}
									onClick={() =>
										handleDeleteFutureActionPlan(selectedAnalysis.entry_id)
									}
								/>
							</div>
						</div>
						{isEditingFutureActionPlan ? (
							<div style={{ marginTop: 16 }}>
								<Select
									style={{ width: "100%", marginBottom: 16 }}
									placeholder={t("tasks.reservoir.form.selectActionPlan")}
									value={editingFutureActionPlan.actionPlanId}
									onChange={(value) =>
										setEditingFutureActionPlan({
											...editingFutureActionPlan,
											actionPlanId: value,
										})
									}
								>
									{actionPlans.map((plan) => (
										<Option key={plan.id} value={plan.id}>
											{plan.name}
										</Option>
									))}
								</Select>
								<TextArea
									placeholder={t("tasks.reservoir.form.linkedTo")}
									value={editingFutureActionPlan.description}
									onChange={(e) =>
										setEditingFutureActionPlan({
											...editingFutureActionPlan,
											description: e.target.value,
										})
									}
									rows={4}
									style={{ marginBottom: 16 }}
								/>
								<Input
									type="number"
									placeholder={t("tasks.reservoir.form.estimatedYear")}
									value={editingFutureActionPlan.year}
									onChange={(e) =>
										setEditingFutureActionPlan({
											...editingFutureActionPlan,
											year: parseInt(e.target.value) || null,
										})
									}
									style={{ marginBottom: 16 }}
								/>
								<div>
									<Button
										type="primary"
										onClick={handleUpdateFutureActionPlan}
										style={{ marginRight: 8 }}
									>
										{t("tasks.common.save")}
									</Button>
									<Button
										onClick={() => {
											setIsEditingFutureActionPlan(false);
											const plan = actionPlans.find(
												(p) => p.code === selectedAnalysis.data.actionPlanCode,
											);
											setEditingFutureActionPlan({
												actionPlanId: plan ? plan.id : null,
												description: selectedAnalysis.data.linkedTo || "",
												year: selectedAnalysis.data.estimatedYear,
											});
										}}
									>
										{t("tasks.common.cancel")}
									</Button>
								</div>
							</div>
						) : (
							<>
								<p>
									{selectedAnalysis.data.actionPlanName ||
										t(
											`actionPlans.${selectedAnalysis.data.actionPlanCode}.name`,
										)}
								</p>
								<h3>{t("tasks.reservoir.form.linkedTo")}</h3>
								<p>{selectedAnalysis.data.linkedTo}</p>
								<h3>{t("tasks.reservoir.form.estimatedYear")}</h3>
								<p>{selectedAnalysis.data.estimatedYear}</p>
							</>
						)}
						{selectedAnalysis.data.created_by_name && (
							<div style={{ marginTop: 16, color: "#8c8c8c", fontSize: 12 }}>
								{t("tasks.reservoir.details.createdBy")}:{" "}
								{selectedAnalysis.data.created_by_name}{" "}
								{selectedAnalysis.data.created_by_lastname}
							</div>
						)}
					</>
				)}
				{selectedAnalysis.type === "evaluation_doc" && (
					<>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<h3 style={{ margin: 0 }}>Documento</h3>
							<Button
								type="text"
								danger
								icon={<DeleteOutlined />}
								onClick={() => handleDelete(selectedAnalysis.data.documentId)}
							/>
						</div>
						<p>
							<a
								href={selectedAnalysis.data.documentUrl}
								target="_blank"
								rel="noreferrer"
							>
								{selectedAnalysis.data.documentName ||
									t("tasks.reservoir.details.attachedDoc")}
							</a>
						</p>
						{selectedAnalysis.data.reportType && (
							<>
								<h4>{t("tasks.reservoir.form.reportType")}</h4>
								<p>{selectedAnalysis.data.reportType}</p>
							</>
						)}
						{selectedAnalysis.data.reportDate && (
							<>
								<h4>{t("tasks.reservoir.form.date")}</h4>
								<p>
									{new Date(
										selectedAnalysis.data.reportDate,
									).toLocaleDateString("es-ES")}
								</p>
							</>
						)}
						{selectedAnalysis.data.reportDescription && (
							<>
								<h4>{t("tasks.reservoir.form.description")}</h4>
								<p>{selectedAnalysis.data.reportDescription}</p>
							</>
						)}
					</>
				)}
				{selectedAnalysis.type === "comment" && (
					<>
						<div
							style={{
								display: "flex",
								justifyContent: "space-between",
								alignItems: "center",
							}}
						>
							<h3 style={{ margin: 0 }}>
								{t("tasks.reservoir.details.comment")}
							</h3>
							<div>
								<Button
									type="text"
									icon={<EditOutlined />}
									onClick={() => setIsEditingComment(!isEditingComment)}
									style={{ marginRight: 8 }}
								/>
								<Button
									type="text"
									danger
									icon={<DeleteOutlined />}
									onClick={() => handleDeleteComment(selectedAnalysis.entry_id)}
								/>
							</div>
						</div>
						{isEditingComment ? (
							<div style={{ marginTop: 16 }}>
								<TextArea
									value={editingCommentText}
									onChange={(e) => setEditingCommentText(e.target.value)}
									rows={4}
									style={{ marginBottom: 16 }}
								/>
								<div>
									<Button
										type="primary"
										onClick={handleUpdateComment}
										style={{ marginRight: 8 }}
									>
										{t("tasks.common.save")}
									</Button>
									<Button
										onClick={() => {
											setIsEditingComment(false);
											setEditingCommentText(selectedAnalysis.data.comment);
										}}
									>
										{t("tasks.common.cancel")}
									</Button>
								</div>
							</div>
						) : (
							<p>{selectedAnalysis.data.comment}</p>
						)}
						{selectedAnalysis.data.created_by_name && (
							<div style={{ marginTop: 16, color: "#8c8c8c", fontSize: 12 }}>
								{t("tasks.reservoir.details.createdBy")}:{" "}
								{selectedAnalysis.data.created_by_name}{" "}
								{selectedAnalysis.data.created_by_lastname}
							</div>
						)}
					</>
				)}
				<div style={{ marginTop: "20px", color: "#8c8c8c" }}>
					{t("tasks.reservoir.details.date")}:{" "}
					{new Date(selectedAnalysis.date).toLocaleDateString("es-ES")}
				</div>
			</div>
		);
	};

	return (
		<Container>
			<LeftColumn>
				<Row gutter={[16, 16]}>
					{analyses.map((analysis, index) => (
						<Col span={11} key={index}>
							<Card
								size="small"
								title={
									<div
										style={{
											display: "flex",
											justifyContent: "space-between",
										}}
									>
										<Typo level={6}>
											<FileTextOutlined /> {getAnalysisTitle(analysis.type)}
										</Typo>
									</div>
								}
								style={{
									height: "100%",
									width: "100%",
									cursor: "pointer",
									backgroundColor:
										selectedAnalysis === analysis ? "#f0f5ff" : "white",
								}}
								onClick={() => handleCardClick(analysis)}
							>
								{getAnalysisContent(analysis)}
								{analysis.date && !isNaN(new Date(analysis.date).getTime()) && (
									<small
										style={{
											color: "#8c8c8c",
											display: "block",
											marginTop: "8px",
										}}
									>
										{new Date(analysis.date).toLocaleDateString("es-ES")}
									</small>
								)}
							</Card>
						</Col>
					))}
				</Row>
				<br />
				<Link
					onClick={showModal}
					style={{
						fontSize: "16px",
						marginBottom: "10px",
						display: "inline-block",
					}}
				>
					+ {t("tasks.reservoir.addAnalysis")}
				</Link>

				<Modal
					title={t("tasks.reservoir.addAnalysis")}
					open={isModalVisible}
					onOk={handleOk}
					onCancel={handleCancel}
					width={600}
					confirmLoading={isSubmitting}
				>
					<Select
						style={{ width: "100%", marginBottom: 16 }}
						placeholder={t("tasks.reservoir.analysisType")}
						value={analysisType}
						onChange={setAnalysisType}
					>
						<Option value="action_plan_proposal">
							{t("tasks.reservoir.analysisTypes.action_plan_proposal")}
						</Option>
						<Option value="evaluation_doc">
							{t("tasks.reservoir.analysisTypes.evaluation_doc")}
						</Option>
						<Option value="comment">
							{t("tasks.reservoir.analysisTypes.comment")}
						</Option>
					</Select>

					{renderFormContent()}
				</Modal>
			</LeftColumn>
			<RightColumn>{renderDetailContent()}</RightColumn>
		</Container>
	);
};

export default Reservoir;
