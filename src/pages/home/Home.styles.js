import styled from "styled-components";

export const Styled = {
	Inner: styled.div`
		display: flex;
		flex-direction: row;
		align-items: center;
		justify-content: center;

		width: 100%;
	`,
	MobileContainer: styled.div`
		width: 100%;
		max-width: 720px;
		padding: 12px 12px 72px 12px;
		margin: 0 auto;
	`,
	SearchBar: styled.div`
		display: flex;
		align-items: center;
		gap: 8px;
		padding: 8px 12px;
		border: 1px solid #e5e7eb;
		border-radius: 10px;
		background: #ffffff;
		position: sticky;
		top: 8px;
		z-index: 2;
		margin-bottom: 12px;

		input {
			flex: 1;
			border: none;
			outline: none;
			font-size: 14px;
			background: transparent;
		}
	`,
	Cards: styled.div`
		display: grid;
		grid-template-columns: 1fr;
		gap: 12px;
	`,
	Card: styled.div`
		background: #ffffff;
		border: 1px solid #e5e7eb;
		border-radius: 12px;
		padding: 12px;
		display: flex;
		flex-direction: column;
		gap: 6px;
	`,
	CardHeader: styled.div`
		display: flex;
		align-items: center;
		justify-content: space-between;
	`,
	Badge: styled.span`
		font-size: 12px;
		padding: 2px 8px;
		border-radius: 999px;
		border: 1px solid #e5e7eb;
		color: #374151;
		background: #f9fafb;
	`,
	Meta: styled.div`
		display: grid;
		grid-template-columns: 1fr;
		gap: 8px 0;
		font-size: 12px;
		color: #4b5563;
	`,
	MetaItem: styled.div`
		strong {
			color: #111827;
		}
	`,
};
