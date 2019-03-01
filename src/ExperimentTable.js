import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import _ from 'lodash'
import styled from 'styled-components'

import TableFooter from './TableFooter'
import TableHeaderCells from './TableHeaderCells'

const TableFooterDiv = styled.div`
  &:before {
    content: '';
    width: 100%;
    height: 1em;
  }
`

const TableCellDiv = styled.div`
  font-size: 13px;
  font-family: Helvetica, Arial, FreeSans, "Liberation Sans", sans-serif;
`

class ExperimentTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: ``,
      orderedColumn: 0,
      searchedColumn: 1,
      ordering: true,
      checkedArray: [],
      currentPage: 1,
      selectedNumber: 10
    }

    this.sort = this.sort.bind(this)
    this.filter = this.filter.bind(this)
    this.setValue = this.setValue.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  sort(data) {
    const {ordering, orderedColumn} = this.state
    const propKey = this.props.tableHeader[orderedColumn].dataParam
    const filteredElements = _.sortBy(data, propKey)
    return ordering ? filteredElements :  filteredElements.reverse()
  }

  filter(data, tableHeader){
    const searchQuery = this.state.searchQuery.trim()
    return searchQuery.length === 0 ? data :
      data.filter(profile => _.isArray(profile[tableHeader[this.state.searchedColumn].dataParam]) ?
        _.flattenDeep(profile[tableHeader[this.state.searchedColumn].dataParam]).some(item=>item.toLowerCase().includes(searchQuery.toLowerCase())) :
        profile[tableHeader[this.state.searchedColumn].dataParam].toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
  }

  setValue(property){
    return e => {
      this.setState({
        [property]: e.target.value,
        currentPage: 1
      })
    }
  }

  handleCheckbox(accession){
    const checkedArray = this.state.checkedArray.slice()
    checkedArray.includes(accession) ?
      _.remove(checkedArray, function(n) {return n === accession})
      : checkedArray.push(accession)
    this.setState({checkedArray: checkedArray})
  }

  render() {
    const {selectedSearch, selectedKingdom, checkedArray, selectedNumber, currentPage, searchedColumn, searchQuery, orderedColumn, ordering} = this.state
    const {host, data, tableHeader, enableDownload, enableIndex} = this.props

    const dataArray = selectedSearch ? this.sort(data).filter(data => data && Object.values(data).some(value => value.toString().toLowerCase().includes(selectedSearch.toLowerCase()))) :
      this.filter(this.sort(data), tableHeader).filter(data => selectedKingdom ? data.kingdom === selectedKingdom : true)
    const currentPageData = selectedNumber ? dataArray.slice(selectedNumber*(currentPage-1), selectedNumber*currentPage) : dataArray

    return (
      <div>
        <div className={`row expanded`}>
          <div className={`large-2 medium-4 small-8 columns`}>
            <label> Kingdom:
              <select defaultValue={``} className={`kingdom`}
                onChange={event => this.setState({selectedKingdom: event.target.value})}>
                <option value={``} >All</option>
                <option value={`animals`}>Plants</option>
                <option value={`plants`}>Animals</option>
                <option value={`fungi`}>Fungi</option>
              </select>
            </label>
          </div>
          <div className={`large-2 medium-4 small-8 columns`}>
            <label>Entries per page:
              <select defaultValue={10} onChange={this.setValue(`selectedNumber`)}>
                <option value={10}>10</option>
                <option value={25}>25</option>
                <option value={50}>50</option>
                <option value={100}>100</option>
                <option value={data.length}>All</option>
              </select>
            </label>
          </div>
          <div className={`large-2 medium-4 small-8 columns`}>
            <label>Search all columns:
              <input type={`search`} placeholder={`Type here ...`}
                onChange={this.setValue(`selectedSearch`)}/></label>
          </div>
        </div>

        <Table border style={{display:`grid`}}>
          <Table.Head>
            {enableIndex &&<Table.TextHeaderCell key={`index`} flexBasis={100} flexShrink={100} flexGrow={100}>Index</Table.TextHeaderCell>}
            <TableHeaderCells {...{tableHeader, searchedColumn, searchQuery, orderedColumn, ordering}}
              onClick={(columnNumber) =>
                this.setState({
                  orderedColumn: columnNumber,
                  ordering: !this.state.ordering})}
              onChange={(value, columnNumber) =>
                this.setState({
                  searchQuery: value,
                  searchedColumn: columnNumber
                })}
            />
            {
              enableDownload && <Table.TextHeaderCell className={`downloadHeader`} flexBasis={100} flexShrink={100} flexGrow={100}>
                {
                  checkedArray.length > 0 ?
                    <a href={`${host}experimentlist/download/zip?experimentAccessions=${checkedArray.toString()}`}>
                    Download {checkedArray.length} {checkedArray.length === 1 ? `entry` : `entries`}</a>
                    : `Download`
                }
              </Table.TextHeaderCell>
            }
          </Table.Head>

          <Table.Body>
            {currentPageData.map((data, index) => {
              return (
                <Table.Row height="auto" backgroundColor={index%2===0 ? `white`:`#F5F6F7`} paddingY={14} key={`row${index}`}>

                  {[
                    enableIndex && <Table.Cell key={index} flexBasis={100} flexShrink={100} flexGrow={100}>
                      <TableCellDiv>{`${index + 1 + selectedNumber*(currentPage-1)} `}</TableCellDiv>
                    </Table.Cell>,

                    tableHeader.map((header, index) => {
                      const cellItem = _.isArray(data[header.dataParam]) ?
                        <ul key={`cell${index}`}>{data[header.dataParam].map(factor => <li key={factor}>{factor}</li>)}</ul>
                        : data[header.dataParam]
                      return <Table.Cell key={`${cellItem}`} flexBasis={header.width} flexShrink={100} flexGrow={100}>
                        <TableCellDiv>
                          {header.link ? <a href={`${host}${header.resource}/${data[header.link]}/${header.endpoint}`}>{cellItem}</a> : cellItem}
                        </TableCellDiv>
                      </Table.Cell>
                    }),

                    enableDownload && <Table.Cell key={`checkbox`} flexBasis={100} flexShrink={100} flexGrow={100}>
                      <TableCellDiv>
                        <input type={`checkbox`} className={`checkbox`} checked={checkedArray.includes(data.experimentAccession)}
                          onChange={()=>this.handleCheckbox(data.experimentAccession)} />
                      </TableCellDiv>
                    </Table.Cell>
                  ]}

                </Table.Row>)
            })
            }
          </Table.Body>
        </Table>
        <TableFooterDiv className={`row expanded`}>
          <TableFooter {...{dataArray, data, currentPage, selectedNumber}} onChange={i => this.setState({currentPage: i})}/>
        </TableFooterDiv>
      </div>
    )
  }
}

ExperimentTable.propTypes = {
  data: PropTypes.array,
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  tableHeader: PropTypes.array.isRequired,
  enableDownload: PropTypes.bool.isRequired,
  enableIndex: PropTypes.bool.isRequired,
}

export default ExperimentTable
