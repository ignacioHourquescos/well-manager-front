import styled from "styled-components";

export const Toolbar = styled.div`
	display: flex;
	justify-content: space-between;
	gap: 12px;
	margin: 12px 0 16px 0;
`;

export const ToolbarLeft = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const ToolbarRight = styled.div`
	display: flex;
	align-items: center;
	gap: 12px;
`;

export const SectionTitle = styled.div`
	font-weight: 600;
	margin-bottom: 8px;
`;

export const TwoCol = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr;
	gap: 12px;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`;

export const ThreeCol = styled.div`
	display: grid;
	grid-template-columns: 1fr 1fr 1fr;
	gap: 12px;

	@media (max-width: 900px) {
		grid-template-columns: 1fr;
	}
`;
