import React from 'react'
import PropTypes from 'prop-types'

const TableFooter = ({dataArray, currentPage, selectedNumber, onChange, data}) => {
  const pageNumbersButton = []
  for (let i = 1; i <= Math.ceil(dataArray.length/selectedNumber); i++) {
    pageNumbersButton.push( i === currentPage ? <li className={`paginate_button number current`} key={`bottom${i}`}>{currentPage}</li> :
      <li className={`paginate_button number`} key={`bottom${i}`}><a onClick={() => onChange(i)}>{i}</a></li>)
  }
  return [
    <div key={`bottom-info`} className={`small-6 columns`}>
      <div className={`dataTables_info`}>{dataArray.length === 0 ? `There is no search results under this query`
        : `Found ${dataArray.length} entries filtered from ${data.length} total entries.`} </div>
    </div>,
    <div key={`bottom-button`} className={`small-6 columns`}>
      <ul className={`pagination`}  style={{"textAlign": `right`}}>
        {[
          currentPage > 1 ?
            <li key={`previous`} className={`paginate_button previous`}><a className={`previous`} onClick={()=>{currentPage > 1 && onChange(currentPage - 1)}}>Previous</a></li> :
            <li key={`previous`} className={`paginate_button previous unavailable disabled`}>Previous</li>,
          pageNumbersButton,
          dataArray.length > currentPage*selectedNumber ?
            <li key={`next`} className={ `paginate_button next`}><a className={`next`} onClick={()=>{dataArray.length >= currentPage*selectedNumber && onChange(currentPage + 1)}}>Next</a></li> :
            <li key={`next`} className={`paginate_button next unavailable disabled`}>Next</li>
        ]}
      </ul>
    </div>
  ]
}

TableFooter.propTypes = {
  dataArray: PropTypes.array.isRequired,
  currentPage: PropTypes.number.isRequired,
  selectedNumber: PropTypes.number.isRequired,
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired
}

export default TableFooter