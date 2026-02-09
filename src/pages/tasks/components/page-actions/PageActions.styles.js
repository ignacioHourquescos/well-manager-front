import styled from "styled-components";

const FlexContainer = styled.div`
	display: flex;
	justify-content: space-between;
	align-items: center;
	width: 100%;
	padding: 1rem 0;
	padding-bottom: 1rem;
	@media (max-width: 767px) {
		flex-direction: column;
		align-items: flex-start;
		gap: 1rem;
		padding-bottom: 0;
	}
`;

const StatisticsContainer = styled.div`
	display: flex;
	gap: 20px; // Adds space between the statistics
`;

const PageTitle = styled.div`
	display: flex;
	align-items: center;
	font-size: 1.5rem;
	width: 200px;
	font-weight: 600;
	font-size: 2rem;
	@media (max-width: 767px) {
		font-size: 1rem;
	}
`;

const ButtonContainer = styled.div`
	transform: translateY(10px);
	display: flex;
	justify-content: flex-end;
	gap: 30px;
	width: 10%;
	padding: 0 20px;
`;

export const Styled = {
	StatisticsContainer,
	FlexContainer,
	PageTitle,
	ButtonContainer,
};
