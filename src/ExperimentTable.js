import React from 'react'
import PropTypes from 'prop-types'
import {TextInputField, SelectField, Table, Pane, minorScale } from 'evergreen-ui'
import _ from 'lodash'

const headerToParam = headerText => {
  switch (headerText) {
  case 1:
    return `lastUpdate`
  case 2:
    return `species`
  case 3:
    return `experimentDescription`
  case 4:
    return `experimentalFactors`
  case 5:
    return `numberOfAssays`
  case 6:
    return `downloads`
  default:
    return `lastUpdate`
  }
}

class ExperimentTable extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      searchQuery: ``,
      orderedColumn: 1,
      searchedColumn: 1,
      ordering: true,
      checkedArray: [],
      currentPage: 1,
      userNumber: 1
    }
    this.sort = this.sort.bind(this)
    this.renderTableHeaderCell = this.renderTableHeaderCell.bind(this)
    this.filter = this.filter.bind(this)
    this.renderTableSearchHeaderCell = this.renderTableSearchHeaderCell.bind(this)
    this.setValue = this.setValue.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
  }

  renderTableHeaderCell (columnNumber, headerText, width) {
    return (
      <Table.TextHeaderCell
        flexBasis={width} flexShrink={0} flexGrow={0}
        onClick={() =>
          this.setState({
            orderedColumn: columnNumber,
            ordering: !this.state.ordering})}>
        {[
          `${headerText} `,
          columnNumber===this.state.orderedColumn ?
            this.state.ordering ?
              <i className="icon icon-common icon-sort-up"/> : <i className="icon icon-common icon-sort-down"/>
            : <i className={`icon icon-common icon-sort`}/>
        ]}
      </Table.TextHeaderCell>
    )
  }

  sort(profiles) {
    const {ordering, orderedColumn} = this.state
    let propKey = headerToParam(orderedColumn)
    const filteredElements = _.sortBy(profiles, propKey)
    return ordering ? filteredElements :  filteredElements.reverse()
  }

  // Filter the profiles based on the name property.
  filter(profiles){
    const searchQuery = this.state.searchQuery.trim()
    // If the searchQuery is empty, return the profiles as is.
    if (searchQuery.length === 0) return profiles

    return profiles.filter(profile => _.isArray(profile[headerToParam(this.state.searchedColumn)]) ?
      _.flattenDeep(profile[headerToParam(this.state.searchedColumn)]).toLowerCase().some(item=>item.includes(searchQuery.toLowerCase())) :
      profile[headerToParam(this.state.searchedColumn)].toLowerCase().includes(searchQuery.toLowerCase())
    )
  }

  renderTableSearchHeaderCell(columnNumber, headerText, width){
    return <Table.SearchHeaderCell
      flexBasis={width} flexShrink={0} flexGrow={0}
      onChange={ (value) => {
        this.setState({
          searchQuery: value,
          searchedColumn: columnNumber})
      }}
      value={columnNumber===this.state.searchedColumn ? this.state.searchQuery : ``}
      placeholder = {`Search by ${headerText} ...`}
    />
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
    const {userSearch, userKingdom, checkedArray, userNumber, currentPage} = this.state
    const dataArray = userSearch ? this.sort(this.props.aaData).filter(data => data && Object.values(data).some(value => value.toString().toLowerCase().includes(userSearch.toLowerCase()))) :
      this.filter(this.sort(this.props.aaData)).filter(data=> userKingdom ? data.kingdom===userKingdom : true)
    const currentPageData = userNumber ? dataArray.slice(userNumber*(currentPage-1), userNumber*currentPage) : dataArray

    return [
      <Pane display="flex">
        <SelectField
          id={`gxaExperimentsTableKingdomSelect`}
          label="Kingdom"
          marginRight={minorScale(4)}
          onChange={event => this.setState({ userKingdom: event.target.value })}
        >
          <option value="" checked>All</option>
          <option value="animals">Animals</option>
          <option value="plants">Plants</option>
          <option value="fungi">Fungi</option>
        </SelectField>
        <SelectField
          label="Show entries"
          marginRight={minorScale(4)}
          onChange={this.setValue(`userNumber`)}
        >
          <option value="1" checked>1</option>
          <option value="2">2</option>
          <option value="3">3</option>
          <option value="100">100</option>
          <option value="">All</option>
        </SelectField>
        <TextInputField
          label="Search all columns"
          marginRight={minorScale(4)}
          onChange={this.setValue(`userSearch`)}
        />

      </Pane>,
      <Table>
        <Table.Head>
          <Table.TextHeaderCell flexBasis={60} flexShrink={0} flexGrow={0}>Index</Table.TextHeaderCell>
          {this.renderTableHeaderCell(1, `Loaded date`, 120)}
          {this.renderTableSearchHeaderCell(2, `species`, 160)}
          {this.renderTableSearchHeaderCell(3, `experiment description`, 300)}
          {this.renderTableSearchHeaderCell(4, `experimental variables`, 260)}
          {this.renderTableHeaderCell(5, `Number of assays`, 160)}
          <Table.TextHeaderCell><a onClick={()=>alert(checkedArray)}>Download {checkedArray.length} entries</a></Table.TextHeaderCell>
        </Table.Head>
        <Table.Body>
          {currentPageData.map((data, index) => {
            return (
              <Table.Row height="auto" backgroundColor={index%2===0?`white`:`rgb(237, 240, 242)`} paddingY={14} key={index}>
                <Table.TextCell flexBasis={60} flexShrink={0} flexGrow={0}>{`${index + 1 + userNumber*(currentPage-1)} `}</Table.TextCell>
                <Table.TextCell flexBasis={160} flexShrink={0} flexGrow={0}>{data.lastUpdate}</Table.TextCell>
                <Table.TextCell flexBasis={160} flexShrink={0} flexGrow={0}>{data.species}</Table.TextCell>
                <Table.Cell flexBasis={360} flexShrink={0} flexGrow={0}>{data.experimentDescription}</Table.Cell>
                <Table.TextCell flexBasis={260} flexShrink={0} flexGrow={0}>
                  <ul>{data.experimentalFactors.map(factor => <li key={index+factor}>{factor}</li>)}</ul>
                </Table.TextCell>
                <Table.TextCell flexBasis={160} flexShrink={0} flexGrow={0}>{data.numberOfAssays}</Table.TextCell>
                <Table.TextCell flexBasis={60} flexShrink={0} flexGrow={0}>
                  <input type="checkbox" checked={checkedArray.includes(data.experimentAccession)} onChange={()=>this.handleCheckbox(data.experimentAccession)} />
                </Table.TextCell>
              </Table.Row>)
          })
          }
        </Table.Body>
      </Table>,
      <br />,
      <div className={`row`}>
        <div className={`small-6 columns`}>
          <div className={`dataTables_info`}>{dataArray.length === 0 ? `There is no search results under this query`
            : `Found ${dataArray.length} entries filtered from ${this.props.aaData.length} total entries.`} </div>
        </div>
        <div className={`small-6 columns`}><div className={`dataTables_paginate paging_simple_numbers`}>
          <ul className={`pagination`}>
            <li className={currentPage>1? `paginate_button previous` : `paginate_button previous unavailable disabled`} aria-controls="experiments-table" tabIndex="0"
              id="experiments-table_previous"  onClick={()=>{currentPage>1&&this.setState({currentPage: currentPage-1})}} >Previous
            </li>
            <li className="paginate_button current" aria-controls="experiments-table" tabIndex="0">{currentPage}</li>
            <li className={this.props.aaData.length>currentPage*userNumber ? `paginate_button next`:`paginate_button next unavailable disabled`} aria-controls="experiments-table" tabIndex="0"
              id="experiments-table_next" onClick={()=>{this.props.aaData.length>currentPage*userNumber && this.setState({currentPage: currentPage+1})}}>Next
            </li>
          </ul>
        </div>
        </div>
      </div>

    ]
  }
}

ExperimentTable.propTypes = {
  aaData: PropTypes.array
}

export default ExperimentTable
