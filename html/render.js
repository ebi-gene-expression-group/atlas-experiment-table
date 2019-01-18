import React from 'react'
import ReactDOM from 'react-dom'
import styled from 'styled-components'

import ExperimentTable from '../src/index.js'

const TableCellDiv = styled.div`
  font-size: 13px;
  font-family: Helvetica, Arial, FreeSans, "Liberation Sans", sans-serif;
`

const render = (options, target) => {
  ReactDOM.render(<ExperimentTable {...options} TableCellDiv={TableCellDiv}/>, document.getElementById(target))
}

export {render}
