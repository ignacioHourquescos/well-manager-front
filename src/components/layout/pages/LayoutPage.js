import { Styled } from "./LayoutPage.styles";
import GeneralFilter from "../general-filter/GeneralFilter";

function LayoutPage({ children, displayFilter = true }) {
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
