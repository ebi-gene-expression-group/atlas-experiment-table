import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import _ from 'lodash'

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
      userNumber: 10
    }

    this.sort = this.sort.bind(this)
    this.renderTableSortHeaderCell = this.renderTableSortHeaderCell.bind(this)
    this.filter = this.filter.bind(this)
    this.renderTableSearchHeaderCell = this.renderTableSearchHeaderCell.bind(this)
    this.setValue = this.setValue.bind(this)
    this.handleCheckbox = this.handleCheckbox.bind(this)
    this.renderTableBottomInfo = this.renderTableBottomInfo.bind(this)
    this.renderTableHeader = this.renderTableHeader.bind(this)
  }

  renderTableSortHeaderCell (columnNumber, headerText, width) {
    return <Table.TextHeaderCell
      key={`header${columnNumber}`}
      className={`header${columnNumber}`}
      flexBasis={width} flexShrink={0} flexGrow={0}
      onClick={() =>
        this.setState({
          orderedColumn: columnNumber,
          ordering: !this.state.ordering})}>
      {[
        `${headerText} `,
        columnNumber===this.state.orderedColumn ?
          this.state.ordering ?
            <i key={`up${columnNumber}`} className={`icon icon-common icon-sort-up`}/> : <i key={`down${columnNumber}`} className={`icon icon-common icon-sort-down`}/>
          : <i key={`updown${columnNumber}`} className={`icon icon-common icon-sort`}/>
      ]}
    </Table.TextHeaderCell>
  }

  sort(profiles) {
    const {ordering, orderedColumn} = this.state
    const propKey = this.props.tableHeader[orderedColumn].dataParam
    const filteredElements = _.sortBy(profiles, propKey)
    return ordering ? filteredElements :  filteredElements.reverse()
  }

  // Filter the profiles based on the name property.
  filter(profiles, tableHeader){
    const searchQuery = this.state.searchQuery.trim()
    return searchQuery.length === 0 ? profiles :
      profiles.filter(profile => _.isArray(profile[tableHeader[this.state.searchedColumn].dataParam]) ?
        _.flattenDeep(profile[tableHeader[this.state.searchedColumn].dataParam]).some(item=>item.toLowerCase().includes(searchQuery.toLowerCase())) :
        profile[tableHeader[this.state.searchedColumn].dataParam].toString().toLowerCase().includes(searchQuery.toLowerCase())
      )
  }

  renderTableSearchHeaderCell(columnNumber, headerText, width){
    return <Table.SearchHeaderCell
      key={`searchheader${columnNumber}`}
      className={`searchheader${columnNumber}`}
      flexBasis={width} flexShrink={0} flexGrow={0}
      onChange={value =>
        this.setState({
          searchQuery: value,
          searchedColumn: columnNumber
        })
      }
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

  renderTableBottomInfo(dataArray){
    const {currentPage, userNumber} = this.state
    const pageNumbersButton = []
    for (let i = 1; i <= Math.ceil(dataArray.length/userNumber); i++) {
      pageNumbersButton.push( i === currentPage ? <li className={`paginate_button number current`} key={`bottom${i}`}>{currentPage}</li> :
        <li className={`paginate_button number`} key={`bottom${i}`}><a onClick={() => this.setState({currentPage: i})}>{i}</a></li>)
    }
    return [
      <div key={`bottom-info`} className={`small-6 columns`}>
        <div className={`dataTables_info`}>{dataArray.length === 0 ? `There is no search results under this query`
          : `Found ${dataArray.length} entries filtered from ${this.props.aaData.length} total entries.`} </div>
      </div>,
      <div key={`bottom-button`} className={`small-6 columns`}>
        <ul className={`pagination`}  style={{"textAlign": `right`}}>
          {[
            currentPage > 1 ?
              <li key={`previous`} className={`paginate_button previous`}><a className={`previous`} onClick={()=>{currentPage > 1 && this.setState({currentPage: currentPage-1})}}>Previous</a></li> :
              <li key={`previous`} className={`paginate_button previous unavailable disabled`}>Previous</li>,
            pageNumbersButton,
            dataArray.length > currentPage*userNumber ?
              <li key={`next`} className={ `paginate_button next`}><a className={`next`} onClick={()=>{dataArray.length >= currentPage*userNumber && this.setState({currentPage: currentPage+1})}}>Next</a></li> :
              <li key={`next`} className={`paginate_button next unavailable disabled`}>Next</li>
          ]}
        </ul>
      </div>
    ]
  }

  renderTableHeader(tableHeader){
    return tableHeader.map((header, index) => {
      switch(header.type) {
      case `plain`:
        return <Table.TextHeaderCell key={header.title} flexBasis={header.width} flexShrink={0} flexGrow={0}>{header.title}</Table.TextHeaderCell>
      case `sort`:
        return this.renderTableSortHeaderCell(index, header.title, header.width)
      case `search`:
        return this.renderTableSearchHeaderCell(index, header.title, header.width)
      default:
        return <Table.TextHeaderCell key={header.title}>{header.title}</Table.TextHeaderCell>
      }}
    )
  }

  render() {
    const {userSearch, userKingdom, checkedArray, userNumber, currentPage} = this.state
    const {host, aaData, tableHeader, enableDownload, TableCellDiv} = this.props
    const dataArray = userSearch ? this.sort(aaData).filter(data => data && Object.values(data).some(value => value.toString().toLowerCase().includes(userSearch.toLowerCase()))) :
      this.filter(this.sort(aaData), tableHeader).filter(data=> userKingdom ? data.kingdom===userKingdom : true)
    const currentPageData = userNumber ? dataArray.slice(userNumber*(currentPage-1), userNumber*currentPage) : dataArray

    return [
      <div key={`tableHead`} className={`row expanded`}>
        <div className={`large-2 medium-4 small-8 columns`}>
          <label> Kingdom:
            <select defaultValue={``} className={`kingdom`}
              onChange={event => this.setState({userKingdom: event.target.value})}>
              <option value={``} >All</option>
              <option value={`animals`}>Plants</option>
              <option value={`plants`}>Animals</option>
              <option value={`fungi`}>Fungi</option>
            </select>
          </label>
        </div>
        <div className={`large-2 medium-4 small-8 columns`}>
          <label>Entries per page:
            <select defaultValue={10} onChange={this.setValue(`userNumber`)}>
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
              <option value={aaData.length}>All</option>
            </select>
          </label>
        </div>
        <div className={`small-8 columns`}>
          <label>Search all columns:
            <input type={`search`} placeholder={`Type here ...`}
              onChange={this.setValue(`userSearch`)}/></label>
        </div>
      </div>,

      <Table border key={`table`}>
        <Table.Head>
          <Table.TextHeaderCell key={`index`} flexBasis={60} flexShrink={0} flexGrow={0}>Index</Table.TextHeaderCell>
          {[
            this.renderTableHeader(tableHeader),
            enableDownload && <Table.TextHeaderCell className={`downloadHeader`} key={`download`}>
              {checkedArray.length > 0 ?
                <a href={`${host}experimentlist/${checkedArray.toString()}/download/zip?fileType=marker-genes&accessKey=`}>Download {checkedArray.length} entries</a>
                : `Download`}
            </Table.TextHeaderCell>
          ]}
        </Table.Head>

        <Table.Body>
          {currentPageData.map((data, index) => {
            return (
              <Table.Row height="auto" backgroundColor={index%2===0 ? `white`:`#F5F6F7`} paddingY={14} key={`row${index}`}>

                <Table.Cell key={`index${index}`} flexBasis={60} flexShrink={0} flexGrow={0}>
                  <TableCellDiv>{`${index + 1 + userNumber*(currentPage-1)} `}</TableCellDiv>
                </Table.Cell>

                {[
                  tableHeader.map((header, index) => {
                    const cellItem = _.isArray(data[header.dataParam]) ?
                      <ul key={`cell${index}`}>{data[header.dataParam].map(factor => <li key={factor}>{factor}</li>)}</ul>
                      : data[header.dataParam]
                    return <Table.Cell key={`${cellItem}`} flexBasis={header.width} flexShrink={0} flexGrow={0}>
                      <TableCellDiv>
                        {header.link ? <a href={`${host}/${header.resource}/${data[header.link]}/${header.endpoint}`}>{cellItem}</a> : cellItem}
                      </TableCellDiv>
                    </Table.Cell>
                  }),

                  enableDownload && <Table.Cell key={`checkbox`} flexBasis={60} flexShrink={0} flexGrow={0}>
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
      </Table>,
      <br  key={`space`}/>,
      <div key={`tableFoot`} className={`row`}>
        {this.renderTableBottomInfo(dataArray)}
      </div>

    ]
  }
}

ExperimentTable.propTypes = {
  aaData: PropTypes.array,
  host: PropTypes.string.isRequired,
  resource: PropTypes.string.isRequired,
  tableHeader: PropTypes.array.isRequired,
  enableDownload: PropTypes.bool.isRequired,
  TableCellDiv: PropTypes.object.isRequired
}

export default ExperimentTable
