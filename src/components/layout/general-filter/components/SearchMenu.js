import React, { useEffect, useState } from "react";
import { Form, Row, Col, Input, Select, Button, Checkbox } from "antd";
import { Styled } from "./SearchMenu.styles";
import FormItem from "../../../../components/common/FormItem";
import {
	fetch_performance,
	fetch_action_plan,
} from "../../../../services/general";
import { FaSearch } from "react-icons/fa";
import { useFilters } from "../../../../context/FilterContext";
import { SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const { Option } = Select;
const SearchMenu = ({ onFilter }) => {
	const [form] = Form.useForm();
	const [performanceOptions, setPerformanceOptions] = useState([]);
	const [actionPlanOptions, setActionPlanOptions] = useState([]);
	const formValues = Form.useWatch([], form);
	const { filters, updateFilters } = useFilters();
	const { t } = useTranslation();

	// console.log("PERFORMANCE");

	useEffect(() => {
		const fetchData = async () => {
			try {
				const [performanceData, actionPlanData] = await Promise.all([
					fetch_performance(),
					fetch_action_plan(),
				]);
				// Transform the performance data to match Select's expected format
				const formattedPerformanceOptions = performanceData.map((item) => ({
					...item,
					value: item.name,
					label: t(`performance.${item.code}.name`),
				}));
				const formattedActionPlanOptions = actionPlanData.map((item) => ({
					...item,
					value: item.name, // Use name instead of code as value
					label: t(`actionPlans.${item.code}.name`),
				}));
				setPerformanceOptions(formattedPerformanceOptions);
				setActionPlanOptions(formattedActionPlanOptions);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	// Sincronizar el formulario con el FilterContext cuando cambian los filtros
	useEffect(() => {
		form.setFieldsValue({
			code: filters.entity,
			performance: filters.performance || [],
			action_plan: filters.action_plan,
		});
	}, [filters, form]);

	const onFinish = (values) => {
		console.log(values);
		onFilter(values);
	};

	const handlePerformanceChange = (checkedValues) => {
		console.log("Checked values:", checkedValues);
		console.log("Performance options:", performanceOptions);
		updateFilters("performance", checkedValues);
		form.setFieldValue("performance", checkedValues);
	};

	return (
		<>
			<Styled.Container>
				<Form
					onFinish={onFinish}
					form={form}
					style={{ width: "100%", padding: "0px !important" }}
				>
					<Row gutter={16} align="middle">
						<Col span={4}>
							<FormItem
								name="code"
								width="100%"
								value={formValues?.code}
								inputComponent={
									<Input
										className="main-search-well-input"
										addonBefore={<SearchOutlined />}
										placeholder={t("filters.searchWellCode")}
										value={filters.entity || ""}
										onChange={(e) => {
											const value = e.target.value;
											updateFilters("entity", value || null);
											if (value === "") {
												onFilter({ ...formValues, code: null });
											}
										}}
									/>
								}
							/>
						</Col>
						<Col span={13}>
							<FormItem
								name="performance"
								width="100%"
								value={formValues?.performance}
								inputComponent={
									<div style={{ display: "flex", gap: 8 }}>
										{performanceOptions.map((option) => (
											<Button
												key={option.value}
												style={{
													width: "110px",
													...(filters.performance?.includes(option.value) && {
														border: "3px solid orange",
													}),
												}}
												type={
													filters.performance?.includes(option.value)
														? "primary"
														: "default"
												}
												onClick={() => {
													const current = filters.performance || [];
													const exists = current.includes(option.value);
													const newValues = exists
														? current.filter((v) => v !== option.value)
														: [...current, option.value];
													handlePerformanceChange(newValues);
												}}
											>
												{t(`performance.${option.code}.name`)}
											</Button>
										))}
									</div>
								}
							/>
						</Col>
						<Col span={6}>
							<FormItem
								label={t("filters.actionPlan")}
								name="action_plan"
								width="100%"
								value={formValues?.action_plan}
								inputComponent={
									<Select
										allowClear
										mode="single"
										options={actionPlanOptions}
										value={filters.action_plan}
										onChange={(values) => {
											updateFilters("action_plan", values);
											form.setFieldValue("action_plan", values);
											onFilter({ ...formValues, action_plan: values });
										}}
										style={{ width: "100%" }}
									/>
								}
							/>
						</Col>
					</Row>
				</Form>
			</Styled.Container>
		</>
	);
};

export default SearchMenu;
