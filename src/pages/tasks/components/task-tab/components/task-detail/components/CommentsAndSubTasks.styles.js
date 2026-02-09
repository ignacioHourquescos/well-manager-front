import { Tabs } from "antd";
import styled from "styled-components";

export const StyledContainer = styled.div`
	padding: 0 20px; // 20px padding on left and right
	width: 70%;
`;

export const StyledTabs = styled(Tabs)`
	.ant-tabs-tab {
		padding: 5px 0; /* Set padding to 0px */
	}
`;
