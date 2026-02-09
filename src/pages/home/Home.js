import { Typography, Layout, Drawer, Table, List, Tag } from "antd";
import React, { useMemo, useState, useEffect } from "react";
import {
	fetch_entities,
	fetch_performance,
	fetch_wells,
} from "../../services/general";
import tasks from "../../services/task.json";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import { Link } from "react-router-dom";
import { useFilters } from "../../context/FilterContext";
import { GiOilDrum } from "react-icons/gi";
import { FaHouseFloodWater } from "react-icons/fa6";
import { BsTrash3 } from "react-icons/bs";
import { Styled } from "./Home.styles";
import FullScreenLoader from "../../components/common/FullScreenLoader";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";

function Home() {
	const { dbUser } = useAuth();
	const [entities, setEntities] = useState([]);
	const [filteredEntities, setFilteredEntities] = useState([]);
	const [loading, setLoading] = useState(true);
	const [loadingWells, setLoadingWells] = useState(true);
	const [error, setError] = useState(null);
	// const [drawerVisible, setDrawerVisible] = useState(false);
	// const [selectedEntityTasks, setSelectedEntityTasks] = useState([]);
	// const [selectedEntity, setSelectedEntity] = useState(null);
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false,
	);
	const [search, setSearch] = useState("");
	const { filters } = useFilters();
	const { t } = useTranslation();

	// const showTasksDrawer = async (entity) => {
	// 	setLoading(true);
	// 	try {
	// 		setSelectedEntityTasks(tasks);
	// 		setDrawerVisible(true);
	// 		setSelectedEntity(entity);
	// 	} catch (err) {
	// 		setError(t("home.errors.tasksFetch"));
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	useEffect(() => {
		async function loadEntities() {
			setLoadingWells(true);
			try {
				const entities = await fetch_wells("", dbUser?.client_id);
				// console.log("Entity lists", entities);
				setEntities(entities);
				//applyAllFilters(entities);
			} catch (err) {
				setError(t("home.errors.entitiesFetch"));
			} finally {
				setLoadingWells(false);
			}
		}
		loadEntities();

		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, [dbUser]);

	const columns = [
		{
			title: t("home.table.well"),
			dataIndex: "entity",
			width: 70,
			render: (text, record) => (
				<Link
					style={{ color: "#19519f", fontWeight: "600" }}
					to={`/tasks/${record.code}/${record.id_well}/${record.id_work_order}?action_plan_id=${record.action_plan.id}`}
				>
					{record.code}
				</Link>
			),
		},
		{
			title: t("home.table.performance"),
			dataIndex: "performance_code",
			width: 100,
			render: (performance, record) =>
				t(`performance.${performance || "null"}.name`),
		},
		{
			title: t("home.table.actionPlan"),
			dataIndex: "action_plan",
			width: 200,
			render: (action_plan) =>
				t(
					`actionPlans.${
						action_plan && action_plan.code ? action_plan.code : "null"
					}.name`,
				),
		},
		{
			title: t("home.table.date"),
			dataIndex: "created_at",
			width: 100,
			render: (created_at) => {
				const date = new Date(created_at);
				return date
					.toLocaleString("en-GB", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					})
					.replace(",", "");
			},
		},
		{
			title: t("home.table.type"),
			dataIndex: "well_type",
			width: 150,
			render: (well_type) => {
				if (!well_type || well_type === "N/A") {
					return "-";
				}
				return (
					<div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
						{(() => {
							switch (well_type) {
								case "Oil Producer":
									return <GiOilDrum style={{ fontSize: "1.2em" }} />;
								case "Water Producer":
									return <FaHouseFloodWater style={{ fontSize: "1.2em" }} />;
								case "Water Injector":
									return (
										<FaHouseFloodWater
											style={{
												fontSize: "1.2em",
												transform: "rotate(180deg)",
											}}
										/>
									);
								case "Disposal":
									return <BsTrash3 style={{ fontSize: "1.2em" }} />;
								default:
									return null;
							}
						})()}
						<span>{t(`wellTypes.${well_type}`)}</span>
					</div>
				);
			},
		},
		{
			title: t("home.table.project"),
			dataIndex: "wf_project",
			render: (wf_project) => wf_project,
			width: 140,
		},
		{
			title: t("home.table.destinationPlant"),
			dataIndex: "dest_plant",
			render: (dest_plant) => dest_plant,
			width: 140,
		},
		//{
		//	title: t("home.table.tasks"),
		//	dataIndex: "actions",
		//	width: 50,
		//	render: (text, record) => (
		//		<a
		//			style={{ color: "#19519f", fontWeight: "600" }}
		//			onClick={() => showTasksDrawer(record)}
		//		>
		//			{t("home.table.viewTasks")}
		//		</a>
		//	),
		//},
	];

	// const drawerTitle = (
	// 	<div
	// 		style={{
	// 			display: "flex",
	// 			justifyContent: "space-between",
	// 			alignItems: "center",
	// 			width: "100%",
	// 		}}
	// 	>
	// 		<span>{t("home.drawer.title")}</span>
	// 		{selectedEntity && (
	// 			<Link
	// 				to={`/tasks/${selectedEntity.entity}?${selectedEntity.performance.code}?${selectedEntity.action_plan}`}
	// 				style={{ fontSize: "14px" }}
	// 			>
	// 				{t("home.drawer.viewMore")}
	// 			</Link>
	// 		)}
	// 	</div>
	// );

	useEffect(() => {
		applyAllFilters(entities);
	}, [filters, entities]);

	const mobileEntities = useMemo(() => {
		if (!isMobile) return [];
		const term = search.trim().toLowerCase();
		if (!term) return entities;
		return entities.filter((e) =>
			`${e.code || ""}`.toLowerCase().includes(term),
		);
	}, [entities, isMobile, search]);

	const applyAllFilters = (data) => {
		let filtered = [...data];
		console.log("Applying filters with:", filters);
		console.log("Entities:", data);

		if (filters.wellTypes?.length > 0) {
			filtered = filtered.filter((item) =>
				filters.wellTypes.includes(item.well_type),
			);
		}

		if (filters.entity) {
			filtered = filtered.filter((item) =>
				item.code.toLowerCase().includes(filters.entity.toLowerCase()),
			);
		}

		if (filters.performance && filters.performance.length > 0) {
			console.log("Filters performance:", filters.performance);
			console.log("Filtered:", filtered);
			filtered = filtered.filter((item) =>
				filters.performance.includes(item?.performance),
			);
		}

		if (filters.action_plan && filters.action_plan.length > 0) {
			filtered = filtered.filter((item) =>
				filters.action_plan.includes(item?.action_plan?.name),
			);
		}

		if (filters.projects?.length > 0) {
			filtered = filtered.filter((item) =>
				filters.projects.includes(item.wf_project),
			);
		}

		if (filters.destinations?.length > 0) {
			filtered = filtered.filter((item) =>
				filters.destinations.includes(item.dest_plant),
			);
		}

		setFilteredEntities(filtered);
	};

	const getStatusColor = (status) => {
		switch (status) {
			case "Block":
				return "red";
			case "InProgress":
				return "blue";
			case "Done":
				return "green";
			default:
				return "default";
		}
	};

	return (
		<LayoutPage
			pageName={t("home.pageTitle")}
			secondaryTitle={t("home.secondaryTitle")}
			type="side-bar-layout"
			displayFilter={!isMobile}
		>
			{isMobile ? (
				<Styled.MobileContainer>
					{loadingWells && <FullScreenLoader />}
					<Styled.SearchBar>
						<input
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							placeholder={t("home.searchPlaceholder", "Buscar pozo")}
						/>
					</Styled.SearchBar>
					<Styled.Cards>
						{mobileEntities.map((item) => (
							<Styled.Card key={`${item.id_well}-${item.id_work_order}`}>
								<Styled.CardHeader>
									<Link
										style={{ color: "#19519f", fontWeight: 600 }}
										to={`/tasks/${item.code}/${item.id_well}/${item.id_work_order}?action_plan_id=${item.action_plan?.id}`}
									>
										{item.code}
									</Link>
									<Styled.Badge>
										{t(`performance.${item.performance_code || "null"}.name`)}
									</Styled.Badge>
								</Styled.CardHeader>
								<Styled.Meta>
									<Styled.MetaItem>
										<strong>{t("home.table.actionPlan")}:</strong>{" "}
										{t(`actionPlans.${item.action_plan?.code || "null"}.name`)}
									</Styled.MetaItem>
									<Styled.MetaItem>
										<strong>{t("home.table.date")}:</strong>{" "}
										{(() => {
											const date = new Date(item.created_at);
											return date
												.toLocaleString("en-GB", {
													day: "2-digit",
													month: "2-digit",
													year: "numeric",
												})
												.replace(",", "");
										})()}
									</Styled.MetaItem>
									<Styled.MetaItem>
										<strong>{t("home.table.project")}:</strong>{" "}
										{item.wf_project || "-"}
									</Styled.MetaItem>
									<Styled.MetaItem>
										<strong>{t("home.table.destinationPlant")}:</strong>{" "}
										{item.dest_plant || "-"}
									</Styled.MetaItem>
								</Styled.Meta>
							</Styled.Card>
						))}
					</Styled.Cards>
				</Styled.MobileContainer>
			) : (
				<Styled.Inner>
					<Table
						columns={columns}
						dataSource={filteredEntities}
						size="middle"
						pagination={{ pageSize: 200 }}
						loading={loadingWells}
						style={{ padding: "0%", width: "100%" }}
					/>
					{/* <Drawer
						title={drawerTitle}
						placement="right"
						onClose={() => setDrawerVisible(false)}
						visible={drawerVisible}
						width={500}
					>
						<List
							itemLayout="horizontal"
							dataSource={selectedEntityTasks}
							renderItem={(item) => (
								<div
									style={{
										marginBottom: "10px",
										borderBottom: "1px solid #e8e8e8",
										paddingBottom: "10px",
									}}
								>
									<Tag
										color={getStatusColor(item.status)}
										style={{ marginLeft: 8 }}
									>
										{t(`home.status.${item.status}`)}
									</Tag>
									<span style={{ textAlign: "left" }}>{item.task}</span>
								</div>
							)}
						/>
					</Drawer> */}
				</Styled.Inner>
			)}
		</LayoutPage>
	);
}

export default Home;
