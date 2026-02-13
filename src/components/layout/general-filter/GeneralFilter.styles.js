import styled from "styled-components";
import { Tag } from "antd";

export const Styled = {
	Header: styled.div`
		position: sticky;
		top: 0;
		z-index: 1;
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
		align-content: center;
		justify-content: space-between;
		justify-items: space-between;
		background-color: white;
		padding: 0 2.5%;
		padding-top: 2rem;
		min-height: 4rem;

		border-bottom: 2px solid rgb(171, 171, 171);
		background-color: rgb(250, 250, 250);
		transform: translateY(-2px);
	`,
	ChipContainer: styled.div`
		width: 100%;
		display: flex;
		margin-top: 1rem;
		margin-bottom: 1rem;
		align-items: center;
		gap: 8px;
		justify-content: flex-start;
		justify-items: flex-start;
	`,
	FilterContainer: styled.div`
		width: 100%;
		display: flex;
		align-items: center;
		gap: 8px;
		justify-content: space-between;
		justify-items: space-between;
	`,
	AddFilterButton: styled.span`
		color: #1890ff;
		cursor: pointer;
		&:hover {
			text-decoration: underline;
		}
	`,

	FilterSection: styled.div`
		margin-bottom: 24px;
	`,

	ModalContent: styled.div`
		display: flex;
		gap: 24px;
		height: 60vh;
	`,

	FilterColumn: styled.div`
		flex: 1;
		min-width: 100px;

		.ant-checkbox-group {
			display: flex;
			flex-direction: column;
			gap: 8px;
		}
	`,

	FilterTag: styled(Tag)`
		background: transparent;
		border-radius: 20px;
		border: 1px solid #d9d9d9;
		padding: 4px 8px;
		margin-right: 2px !important;
		.anticon-close {
			color: #666;
		}

		display: inline-flex;
		align-items: center;
		gap: 4px;

		> div {
			display: inline-flex;
			align-items: center;
			gap: 8px;
		}
	`,

	BateriaSection: styled.div`
		display: flex;
		gap: 24px;
	`,

	BateriaColumn: styled.div`
		flex: 1;
	`,
};
