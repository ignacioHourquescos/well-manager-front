import styled from "styled-components";

export const Styled = {
	Container: styled.div`
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;
		align-content: center;
		width: 90%;
		border-radius: 8px;

		/* Override Ant Design styles only for this component */
		.ant-form-item {
			margin-bottom: 0 !important;
			padding: 0 !important;
		}

		.ant-form-item-label {
			padding: 0 !important;
			margin-bottom: 4px !important;
		}

		.ant-form-item-control {
			padding: 0 !important;
		}

		/* You can add more specific overrides here */
		.ant-form-item-label > label {
			font-size: 12px !important;
			font-weight: 500 !important;
		}
	`,
};
