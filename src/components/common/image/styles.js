import styled from "styled-components";
import { Image } from "antd";
export const Img = styled.img`
	height: 100%;
`;

export const AntdImg = styled(Image)`
	height: 100%;
	& .ant-img {
		padding: 190px !important;
	}
`;
