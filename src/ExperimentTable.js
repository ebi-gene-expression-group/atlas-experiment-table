import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import TableFooter from './TableFooter'
import TableSearchHeader from './TableSearchHeader'
import TableContent from './TableContent'

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

    this.kingdomOnChange = this.kingdomOnChange.bind(this)
    this.searchAllOnChange = this.searchAllOnChange.bind(this)
    this.entityOnChange = this.entityOnChange.bind(this)

    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.tableHeaderOnChange = this.tableHeaderOnChange.bind(this)
    this.tableHeaderOnClick = this.tableHeaderOnClick.bind(this)
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

  handleCheckbox(accession) {
    const checkedArray = Array.from(this.state.checkedArray)
    if(checkedArray.includes(accession)) {
      _.remove(checkedArray, (n) => n === accession)
    } else {
      checkedArray.push(accession)
    }
    this.setState({checkedArray: checkedArray})
  }

  kingdomOnChange(e) {
    this.setState({selectedKingdom: e.target.value})
  }

  searchAllOnChange(e) {
    this.setState({
      selectedSearch: e.target.value,
      currentPage: 1
    })
  }

  entityOnChange(e) {
    this.setState({
      entryPerPage: e.target.value,
      currentPage: 1
    })
  }

  tableHeaderOnClick(columnNumber) {
    this.setState({
      orderedColumn: columnNumber,
      ordering: !this.state.ordering})
  }

  tableHeaderOnChange(value, columnNumber) {
    this.setState({
      searchQuery: value,
      searchedColumn: columnNumber
    })
  }

  render() {
    const { selectedSearch, selectedKingdom, checkedArray, entryPerPage, currentPage, searchedColumn, searchQuery,
      orderedColumn, ordering } = this.state
    const {host, aaData, tableHeader, enableDownload, enableIndex} = this.props

    const dataArray = selectedSearch ?
      this.sort(aaData).filter(data => data && Object.values(data).some(value => value.toString().toLowerCase().includes(selectedSearch.toLowerCase()))) :
      this.filter(this.sort(aaData), tableHeader).filter(data => selectedKingdom ? data.kingdom === selectedKingdom : true)
    const currentPageData = entryPerPage ? dataArray.slice(entryPerPage * (currentPage - 1), entryPerPage * currentPage) : dataArray
    const kingdomOptions = [...new Set(aaData.map(data => data.kingdom ))]
    const entriesPerPageOptions = [1, 10, 25, 50]

    return (
      <div className={`row expanded`}>
        <TableSearchHeader {...{kingdomOptions, entriesPerPageOptions, aaData}}
          searchAllOnChange={this.searchAllOnChange} entityOnChange={this.entityOnChange} kingdomOnChange={this.kingdomOnChange}/>
        <div className={`small-12 columns`} >
          <TableContent {...{checkedArray, tableHeader, entryPerPage, currentPage, searchedColumn, searchQuery,
            orderedColumn, ordering, host, enableDownload, enableIndex, currentPageData}}
          tableHeaderOnChange={this.tableHeaderOnChange} tableHeaderOnClick={this.tableHeaderOnClick} downloadOnChange={accession => this.handleCheckbox(accession)}/>
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
