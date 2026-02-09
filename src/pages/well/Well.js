import { Typography, Layout } from "antd";
import React from "react";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import { useParams } from "react-router-dom";

const { Title } = Typography;
const { Content } = Layout;

//comentario test para probar el pull request
function Well() {
	const { pozoCode } = useParams();
	return (
		<LayoutPage pageName="Well">
			{" "}
			<h1>Well Details</h1>
			<p>Pozo Code: {pozoCode}</p>
		</LayoutPage>
	);
}

export default Well;
