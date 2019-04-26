import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { data } from './TestUtils'

import TableContent from '../src/TableContent'
import { Table } from 'evergreen-ui'

Enzyme.configure({ adapter: new Adapter() })

describe(`TableContent`, () => {
  const props = {
    enableIndex: true,
    tableHeader: [`header1`, `header2`],
    searchedColumn: 2,
    searchQuery: `search`,
    orderedColumn: 1,
    ordering: true,
    enableDownload: true,
    checkedArray: [`first`, `last`],
    currentPageData: data,
    host: `boo`,
    entryPerPage: 2,
    currentPage: 1,
    tableHeaderOnClick: () => {},
    tableHeaderOnChange: () => {},
    downloadOnChange: () => {}
  }

  test(`should render a previous button, a next button and information text`, () => {
    const wrapper = shallow(<TableContent {...props}/>)
    expect(wrapper.find(Table)).toHaveLength(1)
    expect(wrapper.find(Table.Head)).toHaveLength(1)
    expect(wrapper.find(Table.Body)).toHaveLength(1)
  })

  test(`should show/hide download based on props`, () => {
    const wrapper = shallow(<TableContent {...props} enableDownload={true}/>)
    expect(wrapper.find(`.downloadHeader`)).toHaveLength(1)

    const wrapperNoDownload= shallow(<TableContent {...props} enableDownload={false}/>)
    expect(wrapperNoDownload.find(`.downloadHeader`)).toHaveLength(0)
  })
})
