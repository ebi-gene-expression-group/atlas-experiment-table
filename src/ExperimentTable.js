import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import _ from 'lodash'

import TableFooter from './TableFooter'
import tableHeaderCells from './tableHeaderCells'

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
      entryPerPage: 10
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

  filter(data, tableHeader) {
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

  handleCheckbox(accession) {
    const checkedArray = this.state.checkedArray.slice()
    checkedArray.includes(accession) ?
      _.remove(checkedArray, function(n) {return n === accession}) :
      checkedArray.push(accession)
    this.setState({checkedArray: checkedArray})
  }

  render() {
    const {selectedSearch, selectedKingdom, checkedArray, entryPerPage, currentPage, searchedColumn, searchQuery, orderedColumn, ordering} = this.state
    const {host, aaData, tableHeader, enableDownload, enableIndex} = this.props

    const dataArray = selectedSearch ?
      this.sort(aaData).filter(data => data && Object.values(data).some(value => value.toString().toLowerCase().includes(selectedSearch.toLowerCase()))) :
      this.filter(this.sort(aaData), tableHeader).filter(data => selectedKingdom ? data.kingdom === selectedKingdom : true)
    const currentPageData = entryPerPage ? dataArray.slice(entryPerPage * (currentPage - 1), entryPerPage * currentPage) : dataArray
    const kingdomOptions = [...new Set(aaData.map(data => data.kingdom ))]
    const entriesPerPageOptions = [10, 25, 50]

    return (
      <div className={`row expanded`}>
        <div className={`row expanded`}>
          <div className={`small-12 medium-4 large-2 columns`}>
            <label> Kingdom:
              <select defaultValue={``} className={`kingdom`} onChange={event => this.setState({selectedKingdom: event.target.value})}>
                <option value={``} >All</option>
                {kingdomOptions.map(kingdom => <option value={kingdom}>{kingdom.charAt(0).toUpperCase() + kingdom.slice(1)}</option>)}
              </select>
            </label>
          </div>
          <div className={`small-12 medium-4 large-2 columns`}>
            <label>Entries per page:
              <select defaultValue={10} onChange={this.setValue(`selectedNumber`)}>
                { entriesPerPageOptions.map(entries => aaData.length >= entries ? <option value={entries}>{entries}</option> : []) }
                <option value={aaData.length}>All</option>
              </select>
            </label>
          </div>
          <div className={`large-2 columns`}>
            <label>Search all columns:
              <input type={`search`} placeholder={`Type here ...`}
                onChange={this.setValue(`selectedSearch`)}/></label>
          </div>
        </div>
        <div className={`small-12 columns`} >
          <Table border>
            <Table.Head>
              {enableIndex && <Table.TextHeaderCell key={`index`} flexBasis={100} flexShrink={100} flexGrow={100}>Index</Table.TextHeaderCell>}
              {tableHeaderCells(tableHeader, searchedColumn, searchQuery, orderedColumn, ordering,
                (columnNumber) =>
                  this.setState({
                    orderedColumn: columnNumber,
                    ordering: !this.state.ordering}),
                (value, columnNumber) =>
                  this.setState({
                    searchQuery: value,
                    searchedColumn: columnNumber
                  })
              )}
              {
                enableDownload && <Table.TextHeaderCell className={`downloadHeader`} flexBasis={100} flexShrink={100} flexGrow={100}>
                  {
                    checkedArray.length > 0 ?
                      <a href={`${host}experiments/download/zip?${checkedArray.map(accession => `accession=${accession}`).toString().replace(`,`,`&`)}`}>
                        Download {checkedArray.length} {checkedArray.length === 1 ? `entry` : `entries`}</a> : `Download`
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
                              <a href={`${host}${header.resource}/${data[header.link]}/${header.endpoint}`}>{cellItem}</a> :
                              cellItem
                          }
                        </Table.Cell>
                      }),

                      enableDownload && <Table.Cell key={`checkbox`} flexBasis={100} flexShrink={100} flexGrow={100}>
                        <input type={`checkbox`} className={`checkbox`} checked={checkedArray.includes(data.experimentAccession)}
                          onChange={()=>this.handleCheckbox(data.experimentAccession)} />
                      </Table.Cell>
                    ]}

                  </Table.Row>)
              })
              }
            </Table.Body>
          </Table>
        </div>
        <TableFooter {...{currentPage, entryPerPage}} dataArrayLength={dataArray.length} dataLength={aaData.length} onChange={i => this.setState({currentPage: i})}/>
      </div>
    )
  }
}

ExperimentTable.propTypes = {
  aaData: PropTypes.array,
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  tableHeader: PropTypes.array.isRequired,
  enableDownload: PropTypes.bool.isRequired,
  enableIndex: PropTypes.bool.isRequired,
}

export default ExperimentTable
