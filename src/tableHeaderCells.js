import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'

const TableSortHeaderCell = ({columnNumber, headerText, width, orderedColumnIndex, ascendingOrder, onClick}) =>
  <Table.TextHeaderCell
    className={`header${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
    onClick={() => onClick(columnNumber)}>
    <div style={{display: `ruby`, fontSize: `20px`}}>
      {headerText}
      { columnNumber === orderedColumnIndex ?
        ascendingOrder ?
          <i className={`icon icon-common icon-sort-up`} style={{paddingLeft: `3px`}}/> :
          <i className={`icon icon-common icon-sort-down`} style={{paddingLeft: `3px`}}/> :
        <i className={`icon icon-common icon-sort`} style={{paddingLeft: `3px`}}/>
      }
    </div>
  </Table.TextHeaderCell>

const TableSearchHeaderCell = ({columnNumber, headerText, width, searchedColumnIndex, searchQuery, onChange}) =>
  <Table.TextHeaderCell
    className={`searchheader${columnNumber}`}
    flexBasis={width} flexShrink={100} flexGrow={100}
  >
    <div style={{display: `flex`}}>
      <svg viewBox={`0 0 20 20`}
        style={{width: `20px`, fill: `#425A70`}}>
        <path
          d="M18.125,15.804l-4.038-4.037c0.675-1.079,1.012-2.308,1.01-3.534C15.089,4.62,12.199,1.75,8.584,1.75C4.815,1.75,1.982,4.726,2,8.286c0.021,3.577,2.908,6.549,6.578,6.549c1.241,0,2.417-0.347,3.44-0.985l4.032,4.026c0.167,0.166,0.43,0.166,0.596,0l1.479-1.478C18.292,16.234,18.292,15.968,18.125,15.804 M8.578,13.99c-3.198,0-5.716-2.593-5.733-5.71c-0.017-3.084,2.438-5.686,5.74-5.686c3.197,0,5.625,2.493,5.64,5.624C14.242,11.548,11.621,13.99,8.578,13.99 M16.349,16.981l-3.637-3.635c0.131-0.11,0.721-0.695,0.876-0.884l3.642,3.639L16.349,16.981z"></path>
      </svg>
      <input
        style={{display: `flex`, fontSize: `20px`, flex: `1`, border: `none`, background:`transparent`, color: `#425A70`}}
        value={columnNumber === searchedColumnIndex ? searchQuery : ``}
        onChange={e => onChange(e, columnNumber)}
        placeholder = {`Search by ${headerText} ...`} />
    </div>
  </Table.TextHeaderCell>


const tableHeaderCells = (tableHeader, searchedColumnIndex, searchQuery, orderedColumnIndex, ascendingOrder, onClick, onChange ) => {
  return tableHeader.map((header, index) => {
    switch(header.type) {
    case `sort`:
      return <TableSortHeaderCell  key={`sortheader${index}`} columnNumber={index} headerText={header.title} width={header.width}
        {...{orderedColumnIndex, ascendingOrder, onClick}}/>
    case `search`:
      return <TableSearchHeaderCell key={`searchheader${index}`} columnNumber={index} headerText={header.title} width={header.width}
        {...{searchedColumnIndex, searchQuery, onChange}}/>
    default:
      return <Table.TextHeaderCell key={header.title} flexBasis={header.width} flexShrink={100} flexGrow={100}>
        {header.title}
      </Table.TextHeaderCell>
    }}
  )
}

TableSearchHeaderCell.propTypes = {
  columnNumber: PropTypes.number.isRequired,
  headerText: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  searchedColumnIndex: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  onChange: PropTypes.func.isRequired
}

TableSortHeaderCell.propTypes = {
  columnNumber: PropTypes.number.isRequired,
  headerText: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  orderedColumnIndex: PropTypes.number.isRequired,
  ascendingOrder: PropTypes.bool.isRequired,
  onClick: PropTypes.func.isRequired
}

export default tableHeaderCells
