import { Typography, Layout } from "antd";
import React from "react";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import { useParams } from "react-router-dom";
import { Styled } from "./Analytics.styles";
import { useTranslation } from "react-i18next";

const { Title } = Typography;
const { Content } = Layout;

//comentario test para probar el pull request
function Analytics() {
	const { pozoCode } = useParams();
	const { t } = useTranslation();

	return (
		<LayoutPage pageName="Analytics" displayFilter={false}>
			<Title level={4}>{t(`analytics.title`)}</Title>
			<Styled.Inner>{t(`analytics.subtitle`)}</Styled.Inner>
		</LayoutPage>
	);
}

export default Analytics;
