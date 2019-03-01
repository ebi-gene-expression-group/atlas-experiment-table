import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import styled from 'styled-components'

const TableSearchHeaderCellDiv = styled.div`
 display: ruby;
`

const RenderTableSortHeaderCell = ({columnNumber, headerText, width, orderedColumn, ordering, onClick}) =>
  <Table.TextHeaderCell
    className={`header${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
    onClick={() => onClick(columnNumber)}>
    <TableSearchHeaderCellDiv>
      {headerText}
      { columnNumber===orderedColumn ?
        ordering ?
          <i className={`icon icon-common icon-sort-up`} style={{paddingLeft: `1em`}}/>
          : <i className={`icon icon-common icon-sort-down`} style={{paddingLeft: `1em`}}/>
        : <i className={`icon icon-common icon-sort`} style={{paddingLeft: `1em`}}/>
      }
    </TableSearchHeaderCellDiv>
  </Table.TextHeaderCell>

const RenderTableSearchHeaderCell = ({columnNumber, headerText, width, searchedColumn, searchQuery, onChange}) =>
  <Table.SearchHeaderCell
    className={`searchheader${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
    onChange={value => onChange(value, columnNumber)}
    value={columnNumber===searchedColumn ? searchQuery : ``}
    placeholder = {`Search by ${headerText} ...`}
  />

const TableHeaderCells = ({tableHeader, searchedColumn, searchQuery, onClick, onChange, orderedColumn, ordering}) => {
  return tableHeader.map((header, index) => {
    switch(header.type) {
    case `plain`:
      return <Table.TextHeaderCell key={header.title} flexBasis={header.width} flexShrink={100} flexGrow={100}>{header.title}</Table.TextHeaderCell>
    case `sort`:
      return <RenderTableSortHeaderCell  key={`sortheader${index}`}columnNumber={index} headerText={header.title} width={header.width} {...{orderedColumn, ordering, onClick}}/>
    case `search`:
      return <RenderTableSearchHeaderCell key={`searchheader${index}`} columnNumber={index} headerText={header.title} width={header.width} {...{searchedColumn, searchQuery, onChange}}/>
    default:
      return <Table.TextHeaderCell key={header.title}>{header.title}</Table.TextHeaderCell>
    }}
  )
}


TableHeaderCells.propTypes = {
  tableHeader: PropTypes.array.isRequired,
  searchedColumn: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  orderedColumn: PropTypes.number.isRequired,
  ordering: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
  onClick: PropTypes.func.isRequired
}

RenderTableSearchHeaderCell.propTypes = {
  columnNumber: PropTypes.number.isRequired,
  headerText: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  searchedColumn: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

RenderTableSortHeaderCell.propTypes = {
  columnNumber: PropTypes.number.isRequired,
  headerText: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  orderedColumn: PropTypes.number.isRequired,
  ordering: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default TableHeaderCells
