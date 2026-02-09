import styled from "styled-components";

export const Container = styled.div`
	display: flex;
	gap: 20px;
	padding: 20px;
`;

export const LeftColumn = styled.div`
	flex: 0 0 41%;
	border-right: 1px solid #e0e0e0;
	padding: 0px;

	padding-right: 20px;
`;

export const RightColumn = styled.div`
	flex: 0 0 59%;

	padding: 0 20px;
	border-radius: 8px;
`;

export const Title = styled.h2`
	margin-bottom: 20px;
	color: #1890ff;
`;

export const FormContainer = styled.div`
	margin-top: 20px;
`;

export const UploadContainer = styled.div`
	margin-top: 16px;
`;
