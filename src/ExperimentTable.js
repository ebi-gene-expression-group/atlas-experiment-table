import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import TableFooter from './TableFooter'
import TableSearchHeader from './TableSearchHeader'
import TableContent from './TableContent'

class ExperimentTable extends React.Component {
  constructor(props) {
    super(props)
    this.entriesPerPageOptions = [10, 25, 50]
    this.state = {
      searchQuery: this.props.species.trim(),
      orderedColumnIndex: 0,
      searchedColumnIndex: this.props.species.trim() ?
        this.props.tableHeader.findIndex(header => header.dataParam === `species`) : 1,
      ascendingOrder: false,
      checkedRows: [],
      currentPage: 1,
      entriesPerPage: this.entriesPerPageOptions[0],
      selectedSearch: ``,
      selectedDropdownFilters: []
    }

    this.sort = this.sort.bind(this)
    this.filter = this.filter.bind(this)
    this._isContains = this._isContains.bind(this)
    this.dropdownFilterOnChange = this.dropdownFilterOnChange.bind(this)
    this.searchAllOnChange = this.searchAllOnChange.bind(this)
    this.numberOfEntriesPerPageOnChange = this.numberOfEntriesPerPageOnChange.bind(this)

    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.tableHeaderOnChange = this.tableHeaderOnChange.bind(this)
    this.tableHeaderOnClick = this.tableHeaderOnClick.bind(this)
  }

  sort(data) {
    const reverseDateRepresentation = date => {
      let parts = date.split(`-`)
      return `${parts[2]}-${parts[1]}-${parts[0]}`
    }
    const {ascendingOrder, orderedColumnIndex} = this.state
    const propKey = this.props.tableHeader[orderedColumnIndex].dataParam
    const sortedAscendingElements = propKey === `lastUpdate` ?
      _.sortBy(data, (o) => reverseDateRepresentation(o[propKey])) :
      _.sortBy(data, propKey)
    return ascendingOrder ? sortedAscendingElements : sortedAscendingElements.reverse()
  }

  filter(data, tableHeader) {
    const searchQuery = this.state.searchQuery.trim()
    return searchQuery.length === 0 ? data :
      data.filter(row => Array.isArray(row[tableHeader[this.state.searchedColumnIndex].dataParam]) ?
        _.flattenDeep(row[tableHeader[this.state.searchedColumnIndex].dataParam])
          .some(item => item.toLowerCase().includes(searchQuery.toLowerCase()))
        :
        row[tableHeader[this.state.searchedColumnIndex].dataParam].toString().toLowerCase()
          .includes(searchQuery.toLowerCase())
      )
  }

  _isContains(data, value) {
    let contains = false
    Object.keys(data).some(key => {
      contains = typeof data[key] === `object` ? this._isContains(data[key], value) : data[key] === value
      return contains
    })
    return contains
  }

  handleCheckbox(accession) {
    const checkedArray = this.state.checkedRows.includes(accession) ?
      this.state.checkedRows.filter(e => e !== accession) :
      this.state.checkedRows.concat(accession)

    this.setState({checkedRows: checkedArray})
  }

  dropdownFilterOnChange(e, label) {
    const selectedDropdown = {
      label: label,
      value: e.target.value
    }
    const currentDropdownFilters = this.state.selectedDropdownFilters
    const index = this.state.selectedDropdownFilters.findIndex(dropdown => dropdown.label === label)
    if(index !== -1) {
      selectedDropdown.value !== `` ?
        currentDropdownFilters[index].value = e.target.value : currentDropdownFilters.splice(index,1)
      this.setState({
        selectedDropdownFilters: currentDropdownFilters,
        currentPage: 1
      })
    } else {
      currentDropdownFilters.push(selectedDropdown)
      this.setState({
        selectedDropdownFilters: currentDropdownFilters,
        currentPage: 1
      })
    }
  }

  searchAllOnChange(e) {
    this.setState({
      selectedSearch: e.target.value.toLowerCase(),
      currentPage: 1
    })
  }

  numberOfEntriesPerPageOnChange(e) {
    this.setState({
      entriesPerPage: e.target.value,
      currentPage: 1
    })
  }

  tableHeaderOnClick(columnNumber) {
    this.setState({
      orderedColumnIndex: columnNumber,
      ascendingOrder: !this.state.ascendingOrder
    })
  }

  tableHeaderOnChange(value, columnNumber) {
    this.setState({
      searchQuery: value,
      searchedColumnIndex: columnNumber
    })
  }

  render() {
    const { searchQuery, searchedColumnIndex, selectedSearch, selectedDropdownFilters, checkedRows } = this.state
    const { orderedColumnIndex, ascendingOrder } = this.state
    const { entriesPerPage, currentPage } = this.state
    const { host, aaData, tableHeader, enableDownload, downloadTooltip, dropdownFilters } = this.props

    const displayedFields = tableHeader.map(header => header.dataParam)

    const selectedSearchFilteredExperiments = this.sort(aaData).filter(data => data &&
      Object.keys(data).map(key => displayedFields.includes(key) ? data[key] : null)
        .some(value => value && value.toString().toLowerCase().includes(selectedSearch)))

    const dropdownFilteredExperiments = selectedDropdownFilters.length === 0 ?
      this.filter(this.sort(aaData), tableHeader) :
      this.filter(this.sort(aaData), tableHeader).filter(data => {
        return selectedDropdownFilters.every(filter => {
          return filter ? this._isContains(data, filter.value) : true
        })
      })

    const dataArray = selectedSearch.trim() ?
      _.intersection(selectedSearchFilteredExperiments, dropdownFilteredExperiments) :
      dropdownFilteredExperiments

    const currentPageData = entriesPerPage ?
      dataArray.slice(entriesPerPage * (currentPage - 1), entriesPerPage * currentPage) : dataArray

    return (
      <div className={`row expanded`}>
        <TableSearchHeader
          dropdownFilters={dropdownFilters}
          totalNumberOfRows={aaData.length}
          entriesPerPageOptions={this.entriesPerPageOptions}
          searchAllOnChange={this.searchAllOnChange}
          numberOfEntriesPerPageOnChange={this.numberOfEntriesPerPageOnChange}
          dropdownFiltersOnChange={this.dropdownFilterOnChange}/>

        <TableContent
          {...{
            checkedRows,
            tableHeader,
            entriesPerPage,
            currentPage,
            searchedColumnIndex,
            searchQuery,
            orderedColumnIndex,
            ascendingOrder,
            host,
            enableDownload,
            currentPageData,
            downloadTooltip
          }}
          tableHeaderOnChange={this.tableHeaderOnChange}
          tableHeaderOnClick={this.tableHeaderOnClick}
          downloadOnChange={accession => this.handleCheckbox(accession)}/>


        <TableFooter
          {...{
            currentPage,
            entriesPerPage
          }}
          currentPageDataLength={currentPageData.length}
          dataArrayLength={dataArray.length}
          dataLength={aaData.length}
          onChange={i => this.setState({currentPage: i})}/>
      </div>
    )
  }
}

ExperimentTable.propTypes = {
  aaData: PropTypes.array.isRequired,
  host: PropTypes.string.isRequired,
  species: PropTypes.string,
  resource: PropTypes.string.isRequired,
  tableHeader: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.string.isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      dataParam: PropTypes.string.isRequired
    })
  ),
  enableDownload: PropTypes.bool.isRequired,
  downloadTooltip: PropTypes.string.isRequired,
  dropdownFilters: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      options: PropTypes.arrayOf(PropTypes.string).isRequired
    }).isRequired
  )
}

ExperimentTable.defaultProps = {
  species: ``
}

export default ExperimentTable
