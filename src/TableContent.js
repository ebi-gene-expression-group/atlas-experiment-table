import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import URI from 'urijs'
import _ from 'lodash'

import tableHeaderCells from './tableHeaderCells'

const TableContent = ({enableIndex, tableHeader, searchedColumn, searchQuery, orderedColumn,
  ordering, enableDownload, checkedArray, currentPageData, host, entryPerPage, currentPage,
  tableHeaderOnClick, tableHeaderOnChange, downloadOnChange}) => {
  return <Table border>
    <Table.Head>
      {enableIndex && <Table.TextHeaderCell key={`index`} flexBasis={100} flexShrink={100} flexGrow={100}>Index</Table.TextHeaderCell>}
      {tableHeaderCells(tableHeader, searchedColumn, searchQuery, orderedColumn, ordering,
        columnNumber => tableHeaderOnClick(columnNumber),
        (value, columnNumber) => tableHeaderOnChange(value, columnNumber)
      )}
      {
        enableDownload && <Table.TextHeaderCell className={`downloadHeader`} flexBasis={100} flexShrink={100} flexGrow={100}>
          {
            checkedArray.length > 0 ?
              <a href={URI(`${host}experiments/download/zip`).search({accession: checkedArray})}>
              Download {checkedArray.length} {checkedArray.length === 1 ? `entry` : `entries`}</a> :
              `Download`
          }
        </Table.TextHeaderCell>
      }
    </Table.Head>

    <Table.Body>
      {currentPageData.map((data, index) => {
        return (
          <Table.Row height={`auto`} backgroundColor={index % 2 === 0 ? `white`:`#F5F6F7`} paddingY={14} key={`row${index}`}>

            {[
              enableIndex && <Table.Cell key={index} flexBasis={100} flexShrink={100} flexGrow={100}>
                {`${index + 1 + entryPerPage * (currentPage - 1)} `}
              </Table.Cell>,

              tableHeader.map((header, index) => {
                const cellItem = _.isArray(data[header.dataParam]) ?
                  <ul key={`cell${index}`}>{data[header.dataParam].map(factor => <li key={factor}>{factor}</li>)}</ul> :
                  data[header.dataParam]
                return <Table.Cell key={`${cellItem}`} flexBasis={header.width} flexShrink={100} flexGrow={100}>
                  {
                    header.link ?
                      <a href={URI(`${host}${header.resource}/${data[header.link]}/${header.endpoint}`)}>{cellItem}</a> :
                      cellItem
                  }
                </Table.Cell>
              }),

              enableDownload && <Table.Cell key={`checkbox`} flexBasis={100} flexShrink={100} flexGrow={100}>
                <input type={`checkbox`} className={`checkbox`} checked={checkedArray.includes(data.experimentAccession)}
                  onChange={() => downloadOnChange(data.experimentAccession)} />
              </Table.Cell>
            ]}

          </Table.Row>)
      })
      }
    </Table.Body>
  </Table>
}

TableContent.propTypes = {
  enableIndex: PropTypes.bool.isRequired,
  tableHeader: PropTypes.array.isRequired,
  searchedColumn: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  orderedColumn: PropTypes.number.isRequired,
  ordering: PropTypes.bool.isRequired,
  enableDownload: PropTypes.bool.isRequired,
  checkedArray: PropTypes.array.isRequired,
  currentPageData: PropTypes.array.isRequired,
  host: PropTypes.string.isRequired,
  entryPerPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  currentPage: PropTypes.number.isRequired,
  tableHeaderOnClick: PropTypes.func.isRequired,
  tableHeaderOnChange: PropTypes.func.isRequired,
  downloadOnChange: PropTypes.func.isRequired
}

export default TableContent