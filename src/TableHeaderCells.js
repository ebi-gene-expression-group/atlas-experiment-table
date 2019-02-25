import _ from "lodash"
import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import styled from 'styled-components'

const TableSearchHeaderCellDiv = styled.div`
 display: ruby;
`

function renderTableSortHeaderCell (columnNumber, headerText, width, orderedColumn, ordering, onClick) {
  return <Table.TextHeaderCell
    key={`header${columnNumber}`}
    className={`header${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
    onClick={() => onClick(columnNumber)}>
    <TableSearchHeaderCellDiv>
      {[
        `${headerText} `,
        columnNumber===orderedColumn ?
          ordering ?
            <i key={`up${columnNumber}`} className={`icon icon-common icon-sort-up`}/> : <i key={`down${columnNumber}`} className={`icon icon-common icon-sort-down`}/>
          : <i key={`updown${columnNumber}`} className={`icon icon-common icon-sort`}/>
      ]}
    </TableSearchHeaderCellDiv>
  </Table.TextHeaderCell>

}

function renderTableSearchHeaderCell(columnNumber, headerText, width, searchedColumn, searchQuery, onChange){
  return <Table.SearchHeaderCell
    key={`searchheader${columnNumber}`}
    className={`searchheader${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
    onChange={value => onChange(value, columnNumber)}
    value={columnNumber===searchedColumn ? searchQuery : ``}
    placeholder = {`Search by ${headerText} ...`}
  />
}

const TableHeaderCells = ({tableHeader, searchedColumn, searchQuery, onClick, onChange, orderedColumn, ordering}) => {
  return tableHeader.map((header, index) => {
    switch(header.type) {
    case `plain`:
      return <Table.TextHeaderCell key={header.title} flexBasis={header.width} flexShrink={100} flexGrow={100}>{header.title}</Table.TextHeaderCell>
    case `sort`:
      return renderTableSortHeaderCell(index, header.title, header.width, orderedColumn, ordering, onClick)
    case `search`:
      return renderTableSearchHeaderCell(index, header.title, header.width, searchedColumn, searchQuery, onChange)
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
  onClick: PropTypes.func.isRequired,
}

export default TableHeaderCells
