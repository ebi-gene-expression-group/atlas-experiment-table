import React from 'react'
import PropTypes from 'prop-types'

const TableSearchHeader = ({kingdomOptions, entriesPerPageOptions, aaData, searchAllOnChange, entityOnChange, kingdomOnChange}) => {
  return <div className={`row expanded`}>
    <div className={`small-12 medium-4 large-2 columns`}>
      <label> Kingdom:
        <select defaultValue={``} onChange={e => kingdomOnChange(e)}>
          <option value={``} >All</option>
          { kingdomOptions.map(kingdom => <option key={kingdom} value={kingdom}>{kingdom.charAt(0).toUpperCase() + kingdom.slice(1)}</option>) }
        </select>
      </label>
    </div>
    <div className={`small-12 medium-4 large-2 columns`}>
      <label>Entries per page:
        <select defaultValue={10} onChange={e => entityOnChange(e)}>
          { entriesPerPageOptions.map(entries => aaData.length >= entries ? <option key={entries} value={entries}>{entries}</option> : []) }
          <option value={aaData.length}>All</option>
        </select>
      </label>
    </div>
    <div className={`large-2 columns`}>
      <label>Search all columns:
        <input type={`search`} placeholder={`Type here ...`}
          onChange={e => searchAllOnChange(e)}/></label>
    </div>
  </div>
}

TableSearchHeader.propTypes = {
  kingdomOptions: PropTypes.array.isRequired,
  entriesPerPageOptions: PropTypes.array.isRequired,
  aaData: PropTypes.array.isRequired,
  searchAllOnChange: PropTypes.func.isRequired,
  entityOnChange: PropTypes.func.isRequired,
  kingdomOnChange: PropTypes.func.isRequired
}

export default TableSearchHeader