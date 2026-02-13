import React from "react";
import { Typography, Form, Input, Row, Col, message, Select } from "antd";
import LayoutPage from "../../components/layout/pages/LayoutPage";
import { Styled } from "./MyAccount.styles";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import { update_user } from "../../services/general";
import Image from "../../components/common/image/Image";
import esFlag from "../../assets/images/es.png";
import enFlag from "../../assets/images/en.png";
import { Typo } from "../../theme";

const { Title } = Typography;

//comentario test para probar el pull request
function MyAccount() {
	const { t, i18n } = useTranslation();
	const { dbUser } = useAuth();
	const user = JSON.parse(localStorage.getItem("user")) || {};

	const handleLanguageChange = async (value) => {
		try {
			i18n.changeLanguage(value);
			if (dbUser && dbUser.id) {
				const updateData = {
					language: value,
				};
				await update_user(dbUser.id, updateData);
				message.success(t("myAccount.languageUpdated"));
			}
		} catch (error) {
			console.error("Error actualizando idioma:", error);
			message.error(t("myAccount.languageUpdateError"));
		}
	};

	const getRoleLabel = () => {
		if (user.is_admin) return t("myAccount.roles.manager");
		if (user.is_technician) return t("myAccount.roles.supervisor");
		return t("myAccount.roles.operator");
	};

	const flagOptions = [
		{
			value: "es",
			label: (
				<Typo>
					<Image src={esFlag} width={20} height={"100%"} />{" "}
					{t("myAccount.languages.es")}
				</Typo>
			),
		},
		{
			value: "en",
			label: (
				<Typo>
					<Image src={enFlag} width={20} /> {t("myAccount.languages.en")}
				</Typo>
			),
		},
	];

	return (
		<LayoutPage pageName="My Account" displayFilter={false}>
			<Title level={4}>{t("myAccount.title")}</Title>
			<Styled.Inner>
				<Form
					layout="vertical"
					style={{
						width: "100%",
						background: "transparent",
						borderRadius: 8,
					}}
				>
					<Row gutter={16}>
						<Col span={6}>
							<Form.Item label={t("myAccount.firstName")}>
								<Input value={user.name} disabled />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={t("myAccount.lastName")}>
								<Input value={user.lastname} disabled />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={t("myAccount.email")}>
								<Input value={user.email} disabled />
							</Form.Item>
						</Col>
						<Col span={6}>
							<Form.Item label={t("myAccount.document")}>
								<Input value={user.document} disabled />
							</Form.Item>
						</Col>
					</Row>

					<Row gutter={16}>
						<Col span={6}>
							<Form.Item label={t("myAccount.phone")}>
								<Input value={user.telephone} disabled />
							</Form.Item>
						</Col>
						<Col span={18}>
							<Form.Item label={t("myAccount.address")}>
								<Input value={user.address} disabled />
							</Form.Item>
						</Col>
					</Row>
					<Row gutter={16}>
						<Col span={12}>
							<Form.Item label={t("myAccount.role")}>
								<Input value={getRoleLabel()} disabled />
							</Form.Item>
						</Col>
						<Col span={12}>
							<Form.Item label={t("myAccount.language")}>
								<Select
									defaultValue={dbUser?.language || "es"}
									onChange={handleLanguageChange}
									style={{ width: 200 }}
									options={flagOptions}
								/>
							</Form.Item>
						</Col>
					</Row>
				</Form>
			</Styled.Inner>
		</LayoutPage>
	);
}

export default MyAccount;
