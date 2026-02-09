import React from "react";
import { Spin } from "antd"; // Import Ant Design's Spin component
import styled from "styled-components"; // Import styled-components

// Create a styled div for the loader overlay
const LoaderOverlay = styled.div`
	position: fixed;
	top: 0;
	left: 0;
	right: 0;
	bottom: 0;
	background: rgba(129, 128, 128, 0.8); /* Semi-transparent background */
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 9999; /* Ensure it covers everything */
`;

const FullScreenLoader = () => {
	return (
		<LoaderOverlay>
			<Spin size="large" />
		</LoaderOverlay>
	);
};

export default FullScreenLoader;
