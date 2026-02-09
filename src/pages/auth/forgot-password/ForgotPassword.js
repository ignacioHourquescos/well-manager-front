import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
	openNotificationWithIcon,
	TYPE,
} from "../../../utils/notificationToast";
import { Form, Input } from "antd";
import { Typo } from "../../../theme";
import {
	AntdButton,
	AppName,
	Logo,
	Body,
	Container,
	InnerForm,
	Instruction,
	NavLink,
	Section,
	SplashContainer,
} from "./styles";

export default function ForgotPassword() {
	const { resetPassword } = useAuth();
	const [form] = Form.useForm();
	const [submitting, setSubmitting] = useState(false);
	const navigate = useNavigate();

	const onFinish = async (values) => {
		try {
			setSubmitting(true);

			if (!values.email) return false;
			await resetPassword(values.email);
		} catch (error) {
			openNotificationWithIcon(
				TYPE.ERROR,
				"Error al reestablecer la contraseña",
				"Por favor verifique el correo o contacte a soporte"
			);
		} finally {
			setSubmitting(false);
		}
	};

	return (
		<SplashContainer>
			<Body>
				<Logo src={"/logo_energy.png"} alt="OG Logo" />
				<AppName>OG WELL MANAGER</AppName>
				<Instruction>TRACK, MANAGE & OPTIMIZE</Instruction>
				<Form
					form={form}
					name="sign-in-form"
					onFinish={onFinish}
					requiredMark={false}
					layout="vertical"
				>
					<InnerForm>
						<Section>
							<Form.Item
								name="email"
								rules={[
									{
										required: true,
										message: "Este campo es obligatorio",
									},
								]}
							>
								<Input placeholder="@Mail" type="email" size="large" />
							</Form.Item>
						</Section>
						<Section>
							<Container>
								<AntdButton
									size="large"
									style={{ width: "100%" }}
									htmlType="submit"
									loading={submitting}
								>
									Recuperar contraseña
								</AntdButton>
							</Container>
						</Section>
					</InnerForm>
				</Form>
			</Body>
		</SplashContainer>
	);
}
