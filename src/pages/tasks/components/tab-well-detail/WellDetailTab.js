import React, { useEffect, useState } from "react";
import { Row, Col, Statistic, Timeline, Card } from "antd";
import { Typography } from "antd";
import {
	fetch_task_statuses,
	fetch_wells_work_orders,
} from "../../../../services/general";
import { Styled } from "./WellDetailTab.styles";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const WellDetailTab = ({ currentWellData, taskData }) => {
	const [workOrders, setWorkOrders] = useState([]);
	const [statusMapping, setStatusMapping] = useState({});
	const [statusCounts, setStatusCounts] = useState({ OPEN: 0, CLOSED: 0 });
	const { t } = useTranslation();
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false,
	);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	// Safely translate dynamic keys, falling back to "No aplica" while data loads or key is missing
	const translateOrNA = (namespacePrefix, value) => {
		if (!value) {
			return t("common.notApplicable");
		}
		return t(`${namespacePrefix}.${value}`, {
			defaultValue: t("common.notApplicable"),
		});
	};

	useEffect(() => {
		const fetchWorkOrders = async () => {
			try {
				if (currentWellData?.id_well) {
					const response = await fetch_wells_work_orders(
						currentWellData?.id_well,
					);
					setWorkOrders(response);
				}
			} catch (error) {
				console.error("Error fetching work orders:", error);
			}
		};

		fetchWorkOrders();
	}, [currentWellData?.id_well]);

	useEffect(() => {
		const getStatusMapping = async () => {
			try {
				const statuses = await fetch_task_statuses();
				const mapping = {};
				statuses.forEach((status) => {
					mapping[status.code] = status.type;
				});
				setStatusMapping(mapping);
			} catch (error) {
				console.error("Failed to fetch task statuses:", error);
			}
		};

		getStatusMapping();
	}, []);

	useEffect(() => {
		const calculateStatusCounts = () => {
			const counts = { OPEN: 0, CLOSED: 0 };
			taskData.tasks.forEach((task) => {
				const statusType = statusMapping[task.status] || "Unknown";
				if (statusType === "OPEN") {
					counts.OPEN += 1;
				} else if (statusType === "CLOSED") {
					counts.CLOSED += 1;
				}
			});
			setStatusCounts(counts);
		};

		calculateStatusCounts();
	}, [taskData, statusMapping]);
	const timelineItems = workOrders
		.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
		.map((order, index) => ({
			color: index === 0 ? "#00CCFF" : "gray",
			children: (
				<div
					style={
						index === 0
							? {
									paddingBottom: "10px",
									paddingTop: "0",
									borderRadius: "0px",
								}
							: {}
					}
				>
					{new Date(order.created_at).toLocaleDateString("es-ES")}
					{index === 0 ? (
						<>
							<Statistic
								title=""
								value={t(
									`performance.${order.performance_code || "null"}.name`,
								)}
								valueRender={(value) => <Title level={5}>{value}</Title>}
							/>
							<Statistic
								title=""
								value={t(
									`actionPlans.${order.action_plan_code || "null"}.name`,
								)}
								valueRender={(value) => <Title level={5}>{value}</Title>}
							/>
							<div
								style={{
									display: "flex",
									marginTop: "1rem",
									gap: "10px",
									marginLeft: "0px",
								}}
							>
								<Card
									size="small"
									style={{
										textAlign: "center",
										border: "1px solid #f6ffed",

										borderRadius: "4px",
										width: "50%",
									}}
								>
									<Statistic
										title={t("tasks.wellDetail.tasks.open")}
										value={statusCounts.OPEN}
										valueStyle={{ color: "#1890ff" }}
									/>
								</Card>

								<Card
									size="small"
									style={{
										textAlign: "center",
										border: "1px solid #f6ffed",
										borderRadius: "4px",
										width: "50%",
									}}
								>
									<Statistic
										title={t("tasks.wellDetail.tasks.closed")}
										value={statusCounts.CLOSED}
										valueStyle={{ color: "#52c41a" }}
									/>
								</Card>
							</div>
							<br />
						</>
					) : (
						<>
							<div>
								<strong>
									{t(`performance.${order.performance_code || "null"}.name`)}
								</strong>
							</div>
							<>{t(`actionPlans.${order.action_plan_code || "null"}.name`)}</>
						</>
					)}
				</div>
			),
		}));

	return (
		<Styled.Container>
			<Styled.GeneralData>
				{/* Status cards solo en mobile */}
				{isMobile && (
					<div style={{ marginTop: "8px", marginBottom: "8px" }}>
						<Row gutter={10}>
							<Col span={12} style={{ marginBottom: "8px" }}>
								<Card
									size="small"
									style={{ textAlign: "center", border: "1px solid #f0f5ff" }}
								>
									<Statistic
										title={t("tasks.wellDetail.tasks.open")}
										value={statusCounts.OPEN}
										valueStyle={{ color: "#1890ff" }}
									/>
								</Card>
							</Col>
							<Col span={12} style={{ marginBottom: "8px" }}>
								<Card
									size="small"
									style={{ textAlign: "center", border: "1px solid #f6ffed" }}
								>
									<Statistic
										title={t("tasks.wellDetail.tasks.closed")}
										value={statusCounts.CLOSED}
										valueStyle={{ color: "#52c41a" }}
									/>
								</Card>
							</Col>
						</Row>
					</div>
				)}

				<Row gutter={6}>
					<Col span={isMobile ? 24 : 12} style={{ marginTop: "20px" }}>
						<Statistic
							title={t("tasks.wellDetail.statistics.type")}
							value={translateOrNA("wellTypes", currentWellData?.type)}
							valueRender={(value) => <Title level={5}>{value}</Title>}
						/>
					</Col>

					{!isMobile && (
						<Col span={12} style={{ marginTop: "20px" }}>
							<Statistic
								title={t("tasks.wellDetail.statistics.destinationBatch")}
								value={currentWellData?.dest_batt || "-"}
								valueRender={(value) => <Title level={5}>{value}</Title>}
							/>
						</Col>
					)}
					<Col span={isMobile ? 24 : 12} style={{ marginTop: "20px" }}>
						<Statistic
							title={t("tasks.wellDetail.statistics.methodOfProduction")}
							value={translateOrNA(
								"methodProduction",
								currentWellData?.method_production,
							)}
							valueRender={(value) => <Title level={5}>{value}</Title>}
						/>
					</Col>
					{!isMobile && (
						<Col span={12} style={{ marginTop: "20px" }}>
							<Statistic
								title={t("tasks.wellDetail.statistics.drillingType")}
								value={translateOrNA(
									"drillingType",
									currentWellData?.drilling_type,
								)}
								valueRender={(value) => <Title level={5}>{value}</Title>}
							/>
						</Col>
					)}
					<Col span={isMobile ? 24 : 12} style={{ marginTop: "20px" }}>
						<Statistic
							title={t("tasks.wellDetail.statistics.reservoirType")}
							value={translateOrNA(
								"reservoirType",
								currentWellData?.reservoir_type,
							)}
							valueRender={(value) => <Title level={5}>{value}</Title>}
						/>
					</Col>
					{!isMobile && (
						<Col span={12} style={{ marginTop: "20px" }}>
							<Statistic
								title={t("tasks.wellDetail.statistics.depth")}
								value={currentWellData?.depth_mts || "-"}
								valueRender={(value) => <Title level={5}>{value}</Title>}
							/>
						</Col>
					)}
					<Col span={isMobile ? 24 : 12} style={{ marginTop: "20px" }}>
						<Statistic
							title={t("tasks.wellDetail.statistics.destinationPlant")}
							value={currentWellData?.dest_plant || "-"}
							valueRender={(value) => <Title level={5}>{value}</Title>}
						/>
					</Col>
					{!isMobile && (
						<Col span={12} style={{ marginTop: "20px" }}>
							<Statistic
								title={t("tasks.wellDetail.statistics.destinationSite")}
								value={currentWellData?.dest_sit || "-"}
								valueRender={(value) => <Title level={5}>{value}</Title>}
							/>
						</Col>
					)}
					<Col span={isMobile ? 24 : 12} style={{ marginTop: "20px" }}>
						<Statistic
							title={t("tasks.wellDetail.statistics.wfProject")}
							value={currentWellData?.wf_project || "-"}
							valueRender={(value) => <Title level={5}>{value}</Title>}
						/>
					</Col>

					{!isMobile && (
						<Col span={12} style={{ marginTop: "20px" }}>
							<Statistic
								title={t("tasks.wellDetail.statistics.wellType")}
								value={translateOrNA("wellTypes", currentWellData?.well_type)}
								valueRender={(value) => <Title level={5}>{value}</Title>}
							/>
						</Col>
					)}
				</Row>
			</Styled.GeneralData>
			<Styled.WorkOrders>
				<br />
				<Timeline
					items={timelineItems}
					style={{
						marginTop: "5px",
						padding: "0px",
					}}
					className="custom-timeline"
				/>{" "}
				<div
					style={{
						position: "absolute",
						bottom: "20px",
						background:
							"linear-gradient(to bottom ,transparent, rgb(250, 250, 250))",
						width: isMobile ? "90%" : "30%",
						height: "200px",
					}}
				></div>
			</Styled.WorkOrders>
			{/*<Styled.CurrentTasks>
				<br />
				<Row gutter={16}>
					<Col span={24} style={{ marginBottom: "10px" }}>
						<Card
							size="small"
							style={{
								textAlign: "center",
								border: "4px solid #f0f5ff",
								borderRadius: "8px",
								width: "100%",
							}}
						>
							<Statistic
								title="OPEN TASKS"
								value={statusCounts.OPEN}
								valueStyle={{ color: "#1890ff" }}
							/>
						</Card>
					</Col>
					<br />
					<Col span={24}>
						<Card
							size="small"
							style={{
								textAlign: "center",
								border: "4px solid #f6ffed",
								borderRadius: "8px",
								width: "100%",
							}}
						>
							<Statistic
								title="CLOSED TASKS"
								value={statusCounts.CLOSED}
								valueStyle={{ color: "#52c41a" }}
							/>
						</Card>
					</Col>
				</Row>
			</Styled.CurrentTasks>*/}
		</Styled.Container>
	);
};

export default WellDetailTab;
