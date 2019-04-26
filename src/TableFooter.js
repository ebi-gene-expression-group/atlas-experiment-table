import React from 'react'
import PropTypes from 'prop-types'

const TableFooter = ({dataArrayLength, currentPage, entryPerPage, onChange, dataLength}) => {
  const pageNumbers = []
  for (let i = 1; i <= Math.ceil(dataArrayLength / entryPerPage); i++) {
    pageNumbers.push( i === currentPage ? <li className={`current`} key={`bottom${i}`}>{currentPage}</li> :
      <li key={`bottom${i}`}><a onClick={() => onChange(i)}>{i}</a></li>)
  }
  return [
    <div key={`bottom-info`} className={`small-6 columns padding-top-medium`}>
      {
        dataArrayLength === 0 ?
          `There are no results for this query.` :
          `Showing ${dataArrayLength} out of ${dataLength} experiments.`
      }
    </div>,
    <div key={`bottom-button`} className={`small-6 columns padding-top-medium`}>
      <ul className={`pagination`} style={{textAlign: `right`}}>
        {[
          currentPage > 1 ?
            <li key={`previous`}><a onClick={() => {currentPage > 1 && onChange(currentPage - 1)}}>Previous</a></li> :
            <li key={`previous`} className={`disabled`}>Previous</li>,
          pageNumbers,
          dataArrayLength > currentPage * entryPerPage ?
            <li key={`next`}><a onClick={() => {dataArrayLength >= currentPage * entryPerPage && onChange(currentPage + 1)}}>Next</a></li> :
            <li key={`next`} className={`disabled`}>Next</li>
        ]}
      </ul>
    </div>
  ]
}

TableFooter.propTypes = {
  dataArrayLength: PropTypes.number.isRequired,
  currentPage: PropTypes.number.isRequired,
  entryPerPage: PropTypes.oneOfType([
  PropTypes.string,
  PropTypes.number
]),
  dataLength: PropTypes.number.isRequired,
  onChange: PropTypes.func.isRequired
}

export default TableFooter