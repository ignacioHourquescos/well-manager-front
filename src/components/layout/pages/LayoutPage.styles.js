import styled from "styled-components";

const Inner = styled.div`
	display: flex;
	flex-direction: column;
	width: 95%;
	margin: 2% 2.5%;
	background-color: rgb(250, 250, 250);
`;

const Sidebar = styled.div`
	width: 21%;
	padding: 0% 2%;
	background-color: rgb(250, 250, 250);
	position: relative;
	border-right: 1px solid #e0e0e0;
`;

const HeaderStandard = styled.header`
	display: flex;
	align-items: center;
	align-content: center;
	line-height: 2rem;
	height: 3rem; // Add a fixed height to ensure vertical centering
`;

const HeaderSideMenu = styled.header`
	display: flex;
	align-items: center;
	align-content: center;
	line-height: 2rem;
	height: 4rem; // Add a fixed height to ensure vertical centering
`;
const Content = styled.div`
	display: flex;
	flex-direction: column;
	width: 100%;
	padding-top: 0rem;
	background-color: rgb(250, 250, 250);
`;

const PageActions = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
`;

const PageTitle = styled.div`
	display: flex;
	width: 65%;
`;

const FlexInner = styled.div`
	display: flex;
	flex-direction: row;
	background-color: red;
`;

const Main = styled.main`
	flex: 1;
	width: 79%;
	background-color: rgb(250, 250, 250);
`;
export const Styled = {
	Inner,
	HeaderStandard,
	HeaderSideMenu,
	Content,
	PageActions,
	PageTitle,
	FlexInner,
	Sidebar,
	Main,
};
