import { useEffect, useState } from "react";
import { Layout, Menu } from "antd";
import { useNavigate, useLocation } from "react-router-dom";
import { Styled } from "./LayoutGeneral.styles";
import {
	MdLogout,
	MdOutlineDataThresholding,
	MdOutlineFullscreen,
	MdOutlineAccountBox,
	MdOutlineEditNote,
} from "react-icons/md";
import { BiTask } from "react-icons/bi";
import { useAuth } from "../../context/AuthContext";
import { useTranslation } from "react-i18next";

const { Sider, Content } = Layout;

function LayoutGeneral({ children }) {
	const { logout, dbUser } = useAuth();
	const [collapsed, setCollapsed] = useState(() => {
		const savedState = localStorage.getItem("siderCollapsed");
		return savedState ? JSON.parse(savedState) : false;
	});
	const [isMobile, setIsMobile] = useState(() =>
		typeof window !== "undefined" ? window.innerWidth < 768 : false,
	);

	useEffect(() => {
		const handleResize = () => {
			setIsMobile(window.innerWidth < 768);
		};
		window.addEventListener("resize", handleResize);
		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const siderWidth = isMobile ? 0 : collapsed ? 80 : 200;
	const navigate = useNavigate();
	const location = useLocation();
	const { t } = useTranslation();

	const MODULE_ICON_MAP = {
		SCREENING_MODULE: <MdOutlineFullscreen size={24} />,
		PERSONAL_TASK_MODULE: <BiTask size={24} />,
		ANALYTICS_MODULE: <MdOutlineDataThresholding size={24} />,
		ACCOUNT_MODULE: <MdOutlineAccountBox size={24} />,
		WELLS_MODULE: <MdOutlineEditNote size={24} />,
	};

	const menuItems = (dbUser?.menus || []).map((mod) => ({
		key: mod.path,
		icon: MODULE_ICON_MAP[mod.code] || null,
		label: t(`menu.${mod.code}`),
	}));

	const toggleCollapsed = () => {
		const newState = !collapsed;
		setCollapsed(newState);
		localStorage.setItem("siderCollapsed", JSON.stringify(newState));
	};

	const handleMenuClick = (e) => {
		navigate(e.key);
	};

	// const shouldShowFilter = !location.pathname.includes("/tasks/");

	return (
		<Layout
			style={{
				minHeight: "100vh",
				backgroundColor: "transparent",
			}}
		>
			{!isMobile && (
				<Sider
					trigger={null}
					collapsible
					collapsed={collapsed}
					collapsedWidth={80}
					style={{
						backgroundColor: "#0A1018",
						position: "fixed",
						left: 0,
						top: 0,
						bottom: 0,
						height: "100vh",
						overflow: "hidden",
					}}
				>
					<Styled.Icon onClick={toggleCollapsed}>
						{collapsed ? (
							<Styled.Logo>WM </Styled.Logo>
						) : (
							<Styled.LogoExtended>WELL MANAGER </Styled.LogoExtended>
						)}
						<Styled.Chevron onClick={toggleCollapsed}>
							{collapsed ? "›" : "‹"}
						</Styled.Chevron>
					</Styled.Icon>

					<Menu
						selectedKeys={[location.pathname]}
						mode="inline"
						theme="dark"
						inlineCollapsed={collapsed}
						items={menuItems}
						onClick={handleMenuClick}
					/>

					<Styled.Logout collapsed={collapsed} onClick={() => logout()}>
						<Styled.Logo>
							<MdLogout size={24} />
						</Styled.Logo>
						{!collapsed && (
							<Styled.LogoutExtended>{t("logout")}</Styled.LogoutExtended>
						)}
					</Styled.Logout>
				</Sider>
			)}
			<Layout style={{ marginLeft: siderWidth }}>
				<Content>
					<div
						style={{
							display: "flex",
							justifyContent: "center",
							height: "100%",
						}}
					>
						{children}
					</div>
				</Content>
			</Layout>
		</Layout>
	);
}

export default LayoutGeneral;
