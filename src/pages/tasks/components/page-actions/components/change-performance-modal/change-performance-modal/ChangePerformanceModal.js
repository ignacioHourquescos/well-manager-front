import React, { useEffect, useState } from "react";
import { Modal, Form, Select, message } from "antd";
import {
	fetch_performance,
	fetch_action_plan,
} from "../../../../../../../services/general";
import styled from "styled-components";
import FormItem from "../../../../../../components/common/FormItem";
import { useTranslation } from "react-i18next";

const StyledModal = styled(Modal)`
	.ant-modal-content {
		padding: 24px;
	}

	.ant-form-item {
		margin-bottom: 16px;
	}

	.ant-select {
		width: 100%;
	}
`;

const ChangePerformanceModal = ({
	visible,
	onCancel,
	onOk,
	initialPerformance,
	initialActionPlan,
}) => {
	const [form] = Form.useForm();
	const [performanceOptions, setPerformanceOptions] = useState([]);
	const [actionPlanOptions, setActionPlanOptions] = useState([]);
	const [loading, setLoading] = useState(false);
	const formValues = Form.useWatch([], form);
	const { t } = useTranslation();

	useEffect(() => {
		const fetchOptions = async () => {
			try {
				const [performanceData, actionPlanData] = await Promise.all([
					fetch_performance(),
					fetch_action_plan(),
				]);
				setPerformanceOptions(performanceData);
				setActionPlanOptions(actionPlanData);
			} catch (error) {
				console.error("Error fetching options:", error);
				message.error(t("tasks.pageActions.loadFailed"));
			}
		};

		fetchOptions();
	}, []);

	const handleOk = async () => {
		try {
			setLoading(true);
			const values = await form.validateFields();
			await onOk(values);
			form.resetFields();
		} catch (error) {
			console.error("Validation failed:", error);
		} finally {
			setLoading(false);
		}
	};

	return (
		<StyledModal
			title={t("tasks.pageActions.changePerformance")}
			visible={visible}
			onOk={handleOk}
			onCancel={onCancel}
			width={600}
			confirmLoading={loading}
		>
			<Form
				form={form}
				layout="vertical"
				initialValues={{
					performance: initialPerformance,
					action_plan: initialActionPlan,
				}}
			>
				<br />
				<FormItem
					label="Performance"
					name="performance"
					width="100%"
					value={formValues?.performance}
					rules={[{ required: true }]}
					inputComponent={
						<Select
							allowClear
							options={performanceOptions}
							fieldNames={{
								label: "name",
								value: "id_performance",
							}}
						/>
					}
				/>

				<FormItem
					label="Action Plan"
					name="action_plan"
					width="100%"
					value={formValues?.action_plan}
					rules={[{ required: true }]}
					inputComponent={
						<Select
							allowClear
							options={actionPlanOptions}
							fieldNames={{
								label: "name",
								value: "id_action_plan",
							}}
						/>
					}
				/>
			</Form>
			<br />
		</StyledModal>
	);
};

export default ChangePerformanceModal;
