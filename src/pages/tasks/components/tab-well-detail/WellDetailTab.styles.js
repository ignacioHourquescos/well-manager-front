import styled from "styled-components";

const Container = styled.div`
	display: flex;
	flex-direction: row;

	@media (max-width: 767px) {
		flex-direction: column;
	}
`;
const GeneralData = styled.div`
	display: flex;
	flex-direction: row;
	width: 40%;

	align-items: flex-start;

	@media (max-width: 767px) {
		width: 100%;
		flex-direction: column;
	}
`;

const WorkOrders = styled.div`
	width: 30%;
	padding-left: 2rem;
	overflow-y: scroll;
	scrollbar-width: none;
	height: 70vh;
	position: "relative";

	@media (max-width: 767px) {
		display: none;
	}

	.custom-timeline {
		.ant-timeline-item-label {
			position: absolute;

			text-align: right;
		}
	}
`;

const CurrentTasks = styled.div`
	width: 20%;
	padding: 0 rem;

	@media (max-width: 767px) {
		display: none;
	}
`;

export const Styled = {
	GeneralData,
	Container,
	WorkOrders,
	CurrentTasks,
};
