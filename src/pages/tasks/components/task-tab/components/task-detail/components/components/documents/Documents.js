import React, { useState, useEffect } from "react";
import {
	Typography,
	Modal,
	Upload,
	Button,
	Card,
	Row,
	Col,
	message,
} from "antd";
import { UploadOutlined, FileOutlined, CloseOutlined } from "@ant-design/icons";
import {
	delete_document,
	get_documents,
	upload_document,
} from "../../../../../../../../../services/general";

const { Link } = Typography;

const Documents = ({ taskDetails, t }) => {
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [documents, setDocuments] = useState([]);
	const [selectedFile, setSelectedFile] = useState(null);

	useEffect(() => {
		const fetchDocuments = async () => {
			const res = await get_documents({ taskId: taskDetails.id });
			setDocuments(
				res?.map((i) => ({
					id: i.id,
					name: i.name,
					url: i.url,
					date: i.created_at,
				}))
			);
		};
		if (taskDetails?.id) fetchDocuments();
	}, [taskDetails?.id]);

	const showModal = () => setIsModalOpen(true);
	const handleCancel = () => {
		setSelectedFile(null);
		setIsModalOpen(false);
	};

	const handleOk = async () => {
		if (!selectedFile) return;

		const formData = new FormData();
		formData.append("file", selectedFile);
		formData.append("taskId", taskDetails.id);

		const res = await upload_document(formData);

		if (res) {
			setDocuments([
				...documents,
				{
					id: res.id,
					name: res.name,
					url: res.url,
					date: res.created_at,
				},
			]);
			message.success(
				t("tasks.taskDetails.documentUploaded") || "Documento subido"
			);
		}

		setSelectedFile(null);
		setIsModalOpen(false);
	};

	const handleDelete = (id) => {
		Modal.confirm({
			title: t("tasks.taskDetails.confirmDeleteTitle"),
			content: t("tasks.taskDetails.confirmDeleteText"),
			okText: t("tasks.common.confirm"),
			cancelText: t("tasks.common.cancel"),
			okButtonProps: { danger: true },
			onOk: async () => {
				await delete_document(id);
				setDocuments((prev) => prev.filter((doc) => doc.id !== id));
				message.success(t("tasks.taskDetails.documentDeleted"));
			},
		});
	};

	const uploadProps = {
		beforeUpload: (file) => {
			setSelectedFile(file);
			return false;
		},
	};

	return (
		<div>
			<Row gutter={[16, 16]}>
				{documents.map((doc) => (
					<Col span={8} key={doc.id}>
						<Card
							size="small"
							title={
								<div
									style={{ display: "flex", justifyContent: "space-between" }}
								>
									<span>
										<FileOutlined /> {t("tasks.taskDetails.document")}
									</span>
									<CloseOutlined
										onClick={() => handleDelete(doc.id)}
										style={{ color: "#ff4d4f", cursor: "pointer" }}
									/>
								</div>
							}
							style={{ width: "100%" }}
						>
							<a
								href={doc.url}
								target="_blank"
								rel="noopener noreferrer"
								style={{ wordBreak: "break-word", display: "block" }}
							>
								{doc.name}
							</a>
							{doc.date && (
								<small style={{ color: "#8c8c8c" }}>
									{new Date(doc.date).toLocaleDateString("es-ES")}
								</small>
							)}
						</Card>
					</Col>
				))}
			</Row>

			<Link
				onClick={showModal}
				style={{
					fontSize: "14px",
					marginBottom: "20px",
					display: "block",
				}}
			>
				{t("tasks.taskDetails.addDocument")}
			</Link>

			<Modal
				title={t("tasks.taskDetails.addDocument")}
				open={isModalOpen}
				onOk={handleOk}
				onCancel={handleCancel}
				footer={[
					<Button key="back" onClick={handleCancel}>
						{t("tasks.addTaskModal.cancel")}
					</Button>,
					<Button
						key="submit"
						type="primary"
						onClick={handleOk}
						disabled={!selectedFile}
					>
						{t("tasks.taskDetails.save")}
					</Button>,
				]}
			>
				<Upload {...uploadProps}>
					<Button icon={<UploadOutlined />}>
						{t("tasks.taskDetails.selectFile")}
					</Button>
				</Upload>
				{selectedFile && (
					<div style={{ marginTop: "10px" }}>
						{t("tasks.taskDetails.fileSelected")}: {selectedFile.name}
					</div>
				)}
			</Modal>
		</div>
	);
};

export default Documents;
