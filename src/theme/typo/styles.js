import styled, { css } from "styled-components";
import { SIZES, COLORS, WEIGHT } from "../index";

export const Inner = styled.span`
	${(props) => {
		switch (props.level) {
			case 1:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level1};
					line-height: 1.23;
				`;
			case 2:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level2};
					line-height: 1.35;
				`;
			case 3:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level3};
					line-height: 1.35;
				`;
			case 4:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level4};
					line-height: 1.4;
				`;
			case 5:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level5};
					line-height: 1.5;
				`;
			case 6:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level6};
					line-height: 1.5;
				`;
			case 7:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level7};
					line-height: 1.5;
				`;
			case 8:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level8};
					line-height: 1.5;
				`;
			case 9:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level9};
					line-height: 1.5;
				`;
			case 11:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level11};
					line-height: 1.5;
				`;
			case 12:
				return css`
					font-weight: ${WEIGHT.Bold};
					font-size: ${SIZES.default};
					line-height: 1.5;
				`;
			default:
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level7};
					line-height: 1.5;
				`;
		}
	}}

	${(props) => {
		props.lightWeight &&
			css`
				font-weight: ${WEIGHT.Bold};
			`;
	}}

  ${(props) => {
		switch (props.lineHeight) {
			case props.lineHeight:
				return css`
					line-height: ${props.lineHeight};
				`;
			default:
				return css`
					line-height: 1.5;
				`;
		}
	}}

  ${(props) => {
		switch (props.texto) {
			case "medium":
				return css`
					font-family: "Roboto", sans-serif;
					font-weight: ${WEIGHT.SemiBold};
					font-size: ${SIZES.level11};
				`;
			case "light":
				return css`
					font-family: "Roboto", sans-serif;
					font-weight: ${WEIGHT.ExtraLight};
					font-size: ${SIZES.level4};
				`;
			case "bold":
				return css`
					font-family: "Roboto", sans-serif;
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level11};
				`;
			case "inputLabel":
				return css`
					font-weight: ${WEIGHT.ExtraBold};
					font-size: ${SIZES.level6};
					line-height: 1.5;
					overflow: hidden;
					width: 30px;
					text-overflow: ellipsis;
				`;
			case "italic":
				return css`
					font-family: "Roboto", sans-serif;
					font-weight: ${WEIGHT.SemiBold};
					font-size: ${SIZES.level6};
					font-style: italic;
				`;
			default:
				return css`
					font-family: "Roboto", sans-serif;
					font-weight: ${WEIGHT.SemiBold};
					font-size: ${SIZES.level11};
				`;
		}
	}}
  ${(props) => {
		switch (props.weight) {
			case "ExtraLight":
				return css`
					font-weight: ${WEIGHT.ExtraLight};
				`;
			case "Light":
				return css`
					font-weight: ${WEIGHT.Light};
				`;
			case "Bold":
				return css`
					font-weight: ${WEIGHT.Bold};
				`;
			case "ExtraBold":
				return css`
					font-weight: ${WEIGHT.ExtraBold};
				`;
			case "Black":
				return css`
					font-weight: ${WEIGHT.Black};
				`;
			case "SemiBold":
				return css`
					font-weight: ${WEIGHT.SemiBold};
				`;
			default:
				return css`
					font-weight: ${WEIGHT.Bold};
				`;
		}
	}}

  ${(props) => {
		switch (props.fontSize) {
			case props.fontSize:
				return css`
					font-size: ${props.fontSize}px;
				`;
			default:
				return css`
					font-size: ${SIZES.level5};
				`;
		}
	}}

  ${(props) => {
		switch (props.type) {
			case "primary":
				return css`
					color: ${COLORS.Primary};
				`;
			case "secondary":
				return css`
					color: ${COLORS.Secondary};
				`;
			case "terciary":
				return css`
					color: ${COLORS.Default};
				`;
			case "danger":
				return css`
					color: ${COLORS.Danger};
				`;
			case "warning":
				return css`
					color: ${COLORS.Warning};
				`;
			case "success":
				return css`
					color: ${COLORS.Success};
				`;
			case "muted":
				return css`
					color: ${COLORS.Grey};
				`;
			case "white":
				return css`
					color: ${COLORS.White};
				`;
			case "darkMuted":
				return css`
					color: ${COLORS.DarkGrey};
				`;
			case "green":
				return css`
					color: ${COLORS.StrongGreen};
				`;
			case "mediumGrey":
				return css`
					color: ${COLORS.MediumGrey};
				`;
			default:
				return css`
					color: ${COLORS.NearBlack};
				`;
		}
	}}

  ${(props) => {
		switch (props.hover) {
			case "primary":
				return css`
					&:hover {
						color: ${COLORS.Primary};
					}
				`;
			case "secondary":
				return css`
					&:hover {
						color: ${COLORS.Secondary};
					}
				`;
			case "terciary":
				return css`
					&:hover {
						color: ${COLORS.Default};
					}
				`;
			case "danger":
				return css`
					&:hover {
						color: ${COLORS.Danger};
					}
				`;
			case "warning":
				return css`
					&:hover {
						color: ${COLORS.Warning};
					}
				`;
			case "success":
				return css`
					&:hover {
						color: ${COLORS.Success};
					}
				`;
			case "muted":
				return css`
					&:hover {
						color: ${COLORS.Grey};
					}
				`;
			case "white":
				return css`
					&:hover {
						color: ${COLORS.White};
					}
				`;
			case "darkMuted":
				return css`
					&:hover {
						color: ${COLORS.DarkGrey};
					}
				`;
			default:
				return css`
					&:hover {
						color: ${COLORS.DarkGrey};
					}
				`;
		}
	}}
`;
