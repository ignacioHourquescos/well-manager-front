import styled from "styled-components";
import { Table } from "antd";

export const Styled = {
	Container: styled.div`
		padding: 0 1rem;
		border-right: 1px solid #e8e8e8;
		padding-right: 2rem;
		height: 70vh;
	`,
};

export const StyledTable = styled(Table)`
	background-color: transparent !important;
	.ant-table-tbody > tr > td {
		background-color: transparent !important;
	}

	.selected-row {
		border: 3px solid red !important;
		background-color: transparent !important;
	}

	tbody > tr:hover {
		cursor: pointer;
		background-color: rgb(236, 239, 244) !important;
	}
`;
