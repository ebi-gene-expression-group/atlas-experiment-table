import React from 'react'
import ReactDOM from 'react-dom'

import ExperimentTable from '../src/index.js'

const render = (options, target) => {
  ReactDOM.render(<ExperimentTable {...options} />, document.getElementById(target))
}

export {render}
