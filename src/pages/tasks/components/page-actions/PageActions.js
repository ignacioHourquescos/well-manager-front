import { Button, Statistic, Typography } from "antd";
import React, { useEffect, useState } from "react";
import { Styled } from "./PageActions.styles.js";
import { useNavigate } from "react-router-dom";
import { RiArrowLeftWideLine } from "react-icons/ri";
import AddTaskModal from "./components/add-task-modal/AddTaskModal";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

const PageActions = ({
	children,
	showPerformanceModificationModal,
	onTaskSubmit,
	currentWellData,
	canChangePerformance,
	...props
}) => {
	const navigate = useNavigate();
	const { t } = useTranslation();
	const [isModalOpen, setIsModalOpen] = useState(false);
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false
	);

	useEffect(() => {
		const handleResize = () => setIsMobile(window.innerWidth < 768);
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const handleOpenModal = () => setIsModalOpen(true);
	const handleCloseModal = () => setIsModalOpen(false);

	return (
		<Styled.FlexContainer {...props}>
			<Styled.PageTitle>
				<RiArrowLeftWideLine
					onClick={() => navigate("/")}
					style={{
						marginRight: "0px",
						marginLeft: "0px",
						fontSize: "2rem",
						cursor: "pointer",
						transform: "translateX(-10px)",
					}}
				/>
				{props.entityId}
			</Styled.PageTitle>
			<Statistic
				title="Performance"
				value={currentWellData[0]?.performance || t("common.notApplicable")}
				valueRender={(value) => <Title level={5}>{value}</Title>}
			/>

			<Statistic
				title="Action Plan"
				value={
					currentWellData[0]?.action_plan?.name || t("common.notApplicable")
				}
				valueRender={(value) => <Title level={5}>{value}</Title>}
			/>
			<Styled.StatisticsContainer>
				{/* Remove the button code from here */}
			</Styled.StatisticsContainer>
			<Styled.ButtonContainer>
				{/* Botón oculto en móvil */}
				{!isMobile && canChangePerformance && (
					<Button
						type="primary"
						size="large"
						style={{ padding: "25px 45px" }}
						onClick={() => showPerformanceModificationModal(true)}
					>
						{t("tasks.pageActions.changePerformance")}
					</Button>
				)}
			</Styled.ButtonContainer>

			<AddTaskModal
				open={isModalOpen}
				onClose={handleCloseModal}
				onSubmit={onTaskSubmit}
			/>
		</Styled.FlexContainer>
	);
};

export default PageActions;
