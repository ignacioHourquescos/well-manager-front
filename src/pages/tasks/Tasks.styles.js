import styled from "styled-components";
const PageActions = styled.div`
	display: flex;
	flex-direction: row;
	width: 100%;
`;

const PageTitle = styled.div`
	display: flex;
	width: 65%;
`;
const Header = styled.div`
	position: sticky;
	top: 0;
	z-index: 100;
`;

export const Styled = {
	PageActions,
	PageTitle,
	Header,
};
