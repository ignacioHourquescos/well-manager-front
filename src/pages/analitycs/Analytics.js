import { Typography } from "antd";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import { Styled } from "./Analytics.styles";
import { useTranslation } from "react-i18next";

const { Title } = Typography;

//comentario test para probar el pull request
function Analytics() {
	const { t } = useTranslation();

	return (
		<LayoutPage pageName="Analytics" displayFilter={false}>
			<Title level={4}>{t(`analytics.title`)}</Title>
			<Styled.Inner>{t(`analytics.subtitle`)}</Styled.Inner>
		</LayoutPage>
	);
}

export default Analytics;
