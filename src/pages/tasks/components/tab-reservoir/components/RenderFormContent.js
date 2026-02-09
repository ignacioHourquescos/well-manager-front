import React from "react";
import { Select, Input, Upload, Button, DatePicker, Form } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { FormContainer, UploadContainer } from "../Reservoir.styles";

const { Option } = Select;
const { TextArea } = Input;

const REPORT_TYPES = [
	"fluidAnalysis",
	"materialAnalysis",
	"solidSamplesAnalysis",
	"otherReports",
];

const RenderFormContent = ({
	analysisType,
	actionPlanData = {},
	reportData = {},
	commentData = {},
	form,
}) => {
	const {
		selectedActionPlan,
		setSelectedActionPlan,
		linkedTo,
		setLinkedTo,
		estimatedYear,
		setEstimatedYear,
		actionPlans,
	} = actionPlanData;

	const {
		reportType,
		setReportType,
		reportDate,
		setReportDate,
		reportDescription,
		setReportDescription,
		selectedFile,
		setSelectedFile,
	} = reportData;

	const { comment, setComment } = commentData;
	const { t } = useTranslation();

	switch (analysisType) {
		case "action_plan_proposal":
			return (
				<FormContainer>
					<Select
						style={{ width: "100%", marginBottom: 16 }}
						placeholder={t("tasks.reservoir.form.selectActionPlan")}
						value={selectedActionPlan}
						onChange={setSelectedActionPlan}
					>
						{actionPlans.map((plan) => (
							<Option key={plan.code} value={plan.code}>
								{t(`actionPlans.${plan.code}.name`)}
							</Option>
						))}
					</Select>
					<TextArea
						placeholder={t("tasks.reservoir.form.linkedTo")}
						value={linkedTo}
						onChange={(e) => setLinkedTo(e.target.value)}
						rows={4}
						style={{ marginBottom: 16 }}
					/>
					<DatePicker
						style={{ width: "100%" }}
						picker="year"
						placeholder={t("tasks.reservoir.form.estimatedYear")}
						value={estimatedYear}
						onChange={setEstimatedYear}
					/>
				</FormContainer>
			);
		case "evaluation_doc":
			return (
				<UploadContainer>
					<Form form={form} layout="vertical">
						<Form.Item
							name="reportType"
							rules={[
								{
									required: true,
									message: t(
										"tasks.reservoir.form.specialReports.typeRequired"
									),
								},
							]}
							style={{ marginBottom: 16 }}
						>
							<Select
								style={{ width: "100%", textAlign: "left" }}
								placeholder={t("tasks.reservoir.form.specialReports.type")}
								onChange={(value) => {
									setReportType(value);
									form.setFieldsValue({ reportType: value });
								}}
							>
								{REPORT_TYPES.map((type) => (
									<Option key={type} value={type}>
										{t(`tasks.reservoir.form.specialReports.types.${type}`)}
									</Option>
								))}
							</Select>
						</Form.Item>
						<Form.Item
							name="reportDate"
							rules={[
								{
									required: true,
									message: t(
										"tasks.reservoir.form.specialReports.dateRequired"
									),
								},
							]}
							style={{ marginBottom: 16 }}
						>
							<DatePicker
								style={{ width: "100%" }}
								placeholder={t("tasks.reservoir.form.specialReports.date")}
								onChange={(date) => {
									setReportDate(date);
									form.setFieldsValue({ reportDate: date });
								}}
								format="DD/MM/YYYY"
							/>
						</Form.Item>
						<Form.Item name="reportDescription" style={{ marginBottom: 16 }}>
							<TextArea
								placeholder={t(
									"tasks.reservoir.form.specialReports.description"
								)}
								onChange={(e) => {
									setReportDescription(e.target.value);
									form.setFieldsValue({ reportDescription: e.target.value });
								}}
								rows={4}
							/>
						</Form.Item>
						<Form.Item
							name="reportFile"
							rules={[
								{
									required: true,
									message: t(
										"tasks.reservoir.form.specialReports.fileRequired"
									),
								},
							]}
						>
							<Upload
								beforeUpload={(file) => {
									setSelectedFile(file);
									form.setFieldsValue({ reportFile: file });
									return false;
								}}
							>
								<Button icon={<UploadOutlined />}>
									{t("tasks.reservoir.form.uploadFile")}
								</Button>
							</Upload>
							{selectedFile && (
								<div style={{ marginTop: "10px" }}>
									{t("tasks.taskDetails.fileSelected")}: {selectedFile.name}
								</div>
							)}
						</Form.Item>
					</Form>
				</UploadContainer>
			);
		case "comment":
			return (
				<FormContainer>
					<TextArea
						placeholder={t("tasks.reservoir.form.comment")}
						value={comment}
						onChange={(e) => setComment(e.target.value)}
						rows={4}
					/>
				</FormContainer>
			);
		default:
			return null;
	}
};

export default RenderFormContent;
