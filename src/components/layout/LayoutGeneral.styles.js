import styled, { keyframes } from "styled-components";
import { Layout } from "antd";

const Icon = styled.div`
	display: flex;
	flex-direction: column;

	align-items: center;
	justify-content: center;
	align-content: center;
	width: 100%;
	margin-left: 0px;
	margin-top: 10px;
	justify-items: start;
	margin-bottom: 5px;
	cursor: pointer;
`;
const Logout = styled.div`
	display: flex;
	align-items: center;
	justify-content: ${(props) => (props.collapsed ? "center" : "flex-start")};
	gap: ${(props) => (props.collapsed ? "0" : "12px")};
	margin-left: 0px;
	margin-top: 10px;
	justify-items: start;
	margin-bottom: 55px;
	cursor: pointer;
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	background-color: #0a1018;
	padding: 10px;
	padding-left: ${(props) => (props.collapsed ? "0" : "24px")};
	border-radius: 5px;
`;
const Logo = styled.div`
	width: 40px;
	height: 30px;
	border-radius: 5px;
	box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); // Slight drop shadow
	text-align: center;
	font-size: 15px;
	color: white;
	padding-top: 8px;
`;
const scaleIn = keyframes`
  from {
    transform: scale(0);
  }
  to {
    transform: scale(0);
  }
`;

const LogoExtended = styled.div`
	height: 30px;
	border-radius: 5px;
	width: 100%;
	text-align: start;
	font-size: 15px;
	color: white;
	padding-top: 8px;
	margin-left: 55px;
	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	animation: ${scaleIn} 0.2s ease-out;
`;

const LogoutExtended = styled.div`
	height: 30px;
	border-radius: 5px;
	width: 100%;
	text-align: start;
	font-size: 15px;
	color: white;
	padding-top: 8px;

	white-space: nowrap;
	overflow: hidden;
	text-overflow: ellipsis;
	animation: ${scaleIn} 0.2s ease-out;
`;
const Chevron = styled.div`
	width: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
	color: #ffffff;
	opacity: 0.8;
	cursor: pointer;
	padding: 8px 0;
	margin-bottom: 8px;
	font-size: 20px !important;
	font-weight: 600 !important;

	&:hover {
		opacity: 1;
	}
`;

const Header = styled(Layout.Header)`
	position: sticky;
	top: 0;
	z-index: 1;
	width: 100%;
	display: flex;
	align-items: center;
	background-color: white;
	padding: 0% 2.5%;
	height: 4rem;
	border-bottom: 1px solid #e0e0e0;
	background-color: rgb(250, 250, 250);
`;

export const Styled = {
	Logo,
	Icon,
	LogoExtended,
	Header,
	Logout,
	Chevron,
	LogoutExtended,
};
