import React from 'react';
import { styled, useTheme } from '@material-ui/core/styles';
import MUICard, { CardProps } from '@material-ui/core/Card';
import MUITypography from '@material-ui/core/Typography';
import { Label } from '../Labels/Label';

export interface ProposalCardProps {
  /**
   * TransactionHash of the proposal
   */
  transactionHash: string;
  /**
   * Date of proposal
   */
  proposalDate: string | React.ReactNode;
  /**
   * Status of the proposal
   */
  proposalStatus: string;
  /**
   * Optional Function Handler
   */
  onClickProposalCard?: () => void;
}

export const ProposalCard: React.FC<ProposalCardProps> = ({
  transactionHash,
  proposalDate,
  proposalStatus,
  onClickProposalCard,
  ...props
}) => {
  const theme = useTheme();

  const ProposalCard = styled(MUICard)({
    backgroundColor: theme.custom.proposalCard.background,
    height: '150px',
    width: '400px',
    border: `2px solid ${theme.custom.proposalCard.border}`,
    paddingLeft: '0px',
    paddingTop: '21px',
    borderRadius: '8px',
    boxSizing: 'border-box',
    boxShadow: '0px 6px 6px rgba(180, 193, 228, 0.35)',
    cursor: 'pointer',
  });

  const ProposalHash = styled(MUITypography)({
    color: theme.custom.proposalCard.labelColor,
    lineHeight: theme.custom.proposalCard.labelLineHeight,
    fontSize: theme.custom.proposalCard.labelFontSize,
    fontWeight: theme.custom.proposalCard.labelFontWeight,
    fontFamily: theme.custom.proposalCard.fontFamily,
    fontStyle: theme.custom.proposalCard.fontStyle,
    marginTop: '14px',
    marginLeft: '32px',
  });

  const ProposalDateText = styled(MUITypography)({
    color: theme.custom.proposalCard.dateColor,
    lineHeight: theme.custom.proposalCard.dateLineHeight,
    fontSize: theme.custom.proposalCard.dateFontSize,
    fontWeight: theme.custom.proposalCard.dateFontWeight,
    fontFamily: theme.custom.proposalCard.fontFamily,
    fontStyle: theme.custom.proposalCard.fontStyle,
    marginTop: '14px',
    marginLeft: '32px',
  });

  const getColorOfLabel = () => {
    if (proposalStatus === 'Scheduled') return 'yellow';
    if (proposalStatus === 'Executed') return 'green';
    if (proposalStatus === 'Challenged') return 'red';
  };

  const getSlicedTransactionHash = () => {
    const hash =
      transactionHash.slice(0, 6) +
      '...' +
      transactionHash.slice(
        transactionHash.length - 5,
        transactionHash.length - 1,
      );
    return hash;
  };

  return (
    <ProposalCard onClick={onClickProposalCard}>
      <div style={{ marginLeft: '32px' }}>
        <Label labelColor={getColorOfLabel()} labelText={proposalStatus} />
      </div>
      <ProposalHash>{getSlicedTransactionHash()}</ProposalHash>
      <ProposalDateText>{proposalDate}</ProposalDateText>
    </ProposalCard>
  );
};
