import { Table, Text } from '@mantine/core';
import { useTranslation } from 'next-i18next';
import React from 'react';

import { StageItemWithRounds } from '../../interfaces/stage_item';
import { StageItemInputFinal, formatStageItemInput } from '../../interfaces/stage_item_input';
import { PlayerScore } from '../info/player_score';
import { WinDistribution } from '../info/player_statistics';
import { EmptyTableInfo } from '../no_content/empty_table_info';
import { WinDistributionTitle } from './players';
import { ThNotSortable, ThSortable, getTableState, sortTableEntries } from './table';
import TableLayoutLarge from './table_large';

export function StandingsTableForStageItem({
  teams_with_inputs,
  stageItem,
  fontSizeInPixels,
  stageItemsLookup,
  maxTeamsToDisplay,
}: {
  teams_with_inputs: StageItemInputFinal[];
  stageItem: StageItemWithRounds;
  fontSizeInPixels: number;
  stageItemsLookup: any;
  maxTeamsToDisplay: number;
}) {
  const { t } = useTranslation();
  const tableState = getTableState('points', false);

  const minPoints = Math.min(...teams_with_inputs.map((input) => input.points));
  const maxPoints = Math.max(...teams_with_inputs.map((input) => input.points));

  const rows = teams_with_inputs
    .sort((p1: StageItemInputFinal, p2: StageItemInputFinal) => (p1.points > p2.points ? 1 : -1))
    .sort((p1: StageItemInputFinal, p2: StageItemInputFinal) =>
      sortTableEntries(p1, p2, tableState)
    )
    .slice(0, maxTeamsToDisplay)
    .map((team_with_input, index) => (
      <Table.Tr key={team_with_input.id}>
        <Table.Td style={{ width: '2rem' }}>{index + 1}</Table.Td>
        <Table.Td style={{ width: '20rem' }}>
          <Text truncate="end" lineClamp={1} inherit>
            {formatStageItemInput(team_with_input, stageItemsLookup)}
          </Text>
        </Table.Td>
        <Table.Td style={{ minWidth: '10rem' }}>
          <WinDistribution
            wins={team_with_input.wins}
            draws={team_with_input.draws}
            losses={team_with_input.losses}
            fontSizeInPixels={fontSizeInPixels}
          />
        </Table.Td>
      </Table.Tr>
    ));

  if (rows.length < 1) return <EmptyTableInfo entity_name={t('teams_title')} />;

  return (
    <TableLayoutLarge display_mode="presentation">
      <Table.Thead>
        <Table.Tr>
          <ThNotSortable>#</ThNotSortable>
          <ThSortable state={tableState} field="name">
            {t('name_table_header')}
          </ThSortable>
          {stageItem.type === 'SWISS' ? (
            <>
              <ThNotSortable>
                <WinDistributionTitle />
              </ThNotSortable>
            </>
          ) : (
            <>
              <ThNotSortable>
                <WinDistributionTitle />
              </ThNotSortable>
            </>
          )}
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>{rows}</Table.Tbody>
    </TableLayoutLarge>
  );
}
