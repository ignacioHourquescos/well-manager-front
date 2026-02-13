import React, { useEffect, useState } from "react";
import { Modal, Form, Select, message } from "antd";
import {
	fetch_performance,
	fetch_action_plan,
	fetch_action_plans_by_performance,
} from "../../../../services/general";
import styled from "styled-components";
import FormItem from "../../../../components/common/FormItem";
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

	// Efecto para cargar las performances y todos los action plans al inicio
	useEffect(() => {
		const fetchInitialData = async () => {
			try {
				const [performanceData, allActionPlansData] = await Promise.all([
					fetch_performance(),
					fetch_action_plan(),
				]);

				const formattedPerformanceOptions = performanceData.map((item) => ({
					...item,
					value: item.id_performance,
					label: t(`performance.${item.code}.name`),
				}));
				setPerformanceOptions(formattedPerformanceOptions);

				// Guardamos todos los action plans
				const formattedActionPlanOptions = allActionPlansData.map((item) => ({
					...item,
					value: item.id_action_plan,
					label: t(`actionPlans.${item.code}.name`),
				}));
				setActionPlanOptions(formattedActionPlanOptions);
			} catch (error) {
				console.error("Error fetching initial data:", error);
				message.error(t("tasks.pageActions.loadFailed"));
			}
		};

		fetchInitialData();
		// eslint-disable-next-line
	}, []);

	// Efecto para actualizar los action plans habilitados cuando cambia la performance
	useEffect(() => {
		const updateEnabledActionPlans = async () => {
			try {
				if (!formValues?.performance) {
					// Si no hay performance seleccionada, todos los action plans están deshabilitados
					setActionPlanOptions((prev) =>
						prev.map((option) => ({
							...option,
							disabled: true,
						})),
					);
					return;
				}

				// Obtenemos los action plans permitidos para esta performance
				const enabledActionPlans = await fetch_action_plans_by_performance(
					formValues.performance,
				);
				const enabledIds = enabledActionPlans.map((ap) => ap.id_action_plan);

				// Actualizamos el estado de disabled para cada action plan
				setActionPlanOptions((prev) =>
					prev.map((option) => ({
						...option,
						disabled: !enabledIds.includes(option.value),
					})),
				);

				// Si el action plan seleccionado está deshabilitado, lo limpiamos
				if (
					formValues.action_plan &&
					!enabledIds.includes(formValues.action_plan)
				) {
					form.setFieldValue("action_plan", undefined);
				}
			} catch (error) {
				console.error("Error updating enabled action plans:", error);
				message.error(t("tasks.pageActions.loadFailed"));
			}
		};

		updateEnabledActionPlans();
		// eslint-disable-next-line
	}, [formValues?.performance]);

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
					label={t("filters.performance")}
					name="performance"
					width="100%"
					value={formValues?.performance}
					rules={[{ required: true }]}
					inputComponent={<Select allowClear options={performanceOptions} />}
				/>

				<FormItem
					label={t("filters.actionPlan")}
					name="action_plan"
					width="100%"
					value={formValues?.action_plan}
					rules={[{ required: true }]}
					inputComponent={
						<Select
							allowClear
							options={actionPlanOptions}
							disabled={!formValues?.performance}
							loading={loading}
						/>
					}
				/>
			</Form>
			<br />
		</StyledModal>
	);
};

export default ChangePerformanceModal;
