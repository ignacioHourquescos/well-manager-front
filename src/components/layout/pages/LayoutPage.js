import React from "react";
import { Styled } from "./LayoutPage.styles";
import { Tabs, Typography } from "antd";
import { useNavigate } from "react-router-dom";

import { RiArrowLeftWideLine } from "react-icons/ri";
import GeneralFilter from "../general-filter/GeneralFilter";

const { Title } = Typography;
function LayoutPage({
	pageName,
	children,
	pageActions,
	type,
	sidebar,
	secondaryTitle,
	displayFilter = true,
}) {
	const navigate = useNavigate();

	const goBack = () => {
		navigate(-1);
	};

	if (true) {
		return (
			<>
				<Styled.Main>
					{displayFilter && <GeneralFilter />}
					<Styled.Inner>
						<Styled.Content>{children}</Styled.Content>
					</Styled.Inner>
				</Styled.Main>
			</>
		);
	}
}

export default LayoutPage;
