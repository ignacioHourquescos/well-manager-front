import React, { useState, useEffect } from "react";
import styled, { keyframes } from "styled-components";

const fadeOut = keyframes`
  from { opacity: 1; }
  to { opacity: 0; }
`;

const SplashContainer = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	height: 100vh;
	background-color: #0a1018; // Use your app's primary color
	opacity: ${(props) => (props.fadeOut ? 0 : 1)};
	transition: opacity 500ms ease-out;
	animation: ${(props) => (props.fadeOut ? fadeOut : "none")} 500ms ease-out
		forwards;
	cursor: pointer;
`;

const Logo = styled.img`
	width: 150px;
	height: auto;
`;

const AppName = styled.div`
	color: white;
	margin-top: 0px;
	font-size: 38px;
	letter-spacing: 2px;
	font-weight: 700;
	line-height: 1.2;
	margin-bottom: 2px;
`;

const Instruction = styled.p`
	color: white;
	margin-top: 0px;
	font-size: 16px;
	font-family: 100;
	font-weight: 100;
	color: #e7e247;
`;

const SplashScreen = ({ onDismiss }) => {
	const [fadeOut, setFadeOut] = useState(false);

	const handleClick = () => {
		setFadeOut(true);
		setTimeout(onDismiss, 0); // Call onDismiss after fade out animation
	};

	return (
		<SplashContainer onClick={handleClick} fadeOut={fadeOut}>
			<AppName>WELL MANAGER</AppName>
			<Instruction>OPTIMIZING WELLS, SIMPLIFYING OPERATIONS</Instruction>
		</SplashContainer>
	);
};

export default SplashScreen;
