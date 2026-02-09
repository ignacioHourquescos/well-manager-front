import { Button } from "antd";
import { Link } from "react-router-dom";
import styled, { keyframes } from "styled-components";

export const Body = styled.div`
	margin-top: 10px;
	background-color: white;
	display: flex;
	flex-direction: column;
	justify-content: space-between;
	align-items: center;

	/* Card sizing */
	width: 100%;
	max-width: 420px;
	padding: 3rem 4rem 3rem 4rem;
	border-radius: 3px;
	box-shadow: rgba(50, 50, 93, 0.25) 0px 50px 100px -20px,
		rgba(0, 0, 0, 0.3) 0px 30px 60px -30px;

	.ant-form {
		flex: 1;
	}

	.ant-form-item {
		flex: 1;
	}

	/* Responsive padding adjustments */
	@media only screen and (max-width: 900px) {
		padding: 2rem 2rem 2rem 2rem;
	}

	@media only screen and (max-width: 413px) {
		padding: 1.5rem 1.25rem 1.5rem 1.25rem;
	}
`;

export const InnerForm = styled.div`
	display: flex;
	flex-direction: column;
`;

export const ButtonSection = styled.div`
	filter: drop-shadow(0px 7px 7px rgba(0, 0, 0, 0.25));
	display: flex;
	flex-direction: row;
	align-items: center;
	justify-content: space-between;
	gap: 20px;
	text-align: center;

	svg {
		color: blue;
		scale: 1.2;
	}
`;

export const Container = styled.div`
	display: flex;
	flex: 1;
	flex-direction: column;
	gap: 10px;
	justify-content: center;
	align-items: center;
`;

export const Section = styled.div`
	display: flex;
	gap: 20px;

	@media only screen and (min-width: 250px) and (max-width: 413px) {
		display: flex;
		flex-direction: column;
		gap: 10px;
	}
`;

export const AntdButton = styled(Button)`
	background-color: black;
	color: #e7e247;
	border-radius: 5px;

	overflow: hidden;

	span {
		white-space: pre-line;
	}
`;

export const NavLink = styled(Link)`
	text-decoration: none;
	color: rgb(182, 182, 182);
`;

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

export const SplashContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-image: url("/login_background.png");
	background-size: cover;
	background-position: center;
	background-repeat: no-repeat;
	opacity: ${(props) => (props.fadeOut ? 0 : 1)};
	transition: opacity 500ms ease-out;
	animation: ${(props) => (props.fadeOut ? fadeOut : "none")} 500ms ease-out
		forwards;
	cursor: pointer;
`;

export const AppName = styled.div`
	color: rgb(10, 16, 24);
	margin-top: 0px;
	font-size: 30px;
	letter-spacing: 2px;
	font-weight: 700;
	line-height: 1.2;
	margin-bottom: 2px;
`;

export const Instruction = styled.p`
	color: white;
	margin-top: 0px;
	font-size: 16px;
	font-family: 100;
	font-weight: 100;
	color: rgb(10, 16, 24);
`;

export const Logo = styled.img`
	width: 220px;
	height: auto;
	margin-bottom: 12px;

	@media only screen and (max-width: 413px) {
		width: 180px;
	}
`;
