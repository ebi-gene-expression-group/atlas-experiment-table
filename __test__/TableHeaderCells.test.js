import React from 'react'
import Enzyme from 'enzyme'
import { mount } from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {getRandomInt, tableHeader} from './TestUtils'
import TableHeaderCells from '../src/TableHeaderCells'
import { Table } from 'evergreen-ui'

Enzyme.configure({ adapter: new Adapter() })
const randomColumn =  getRandomInt(1, tableHeader.length)

describe(`TableHeaderCells`, () => {
  const props = {
    tableHeader: tableHeader,
    searchedColumn: randomColumn,
    searchQuery: `bool`,
    orderedColumn: randomColumn,
    ordering: true,
    onChange: ()=>{},
    onClick: ()=>{}
  }

  test(`should render different table header based on types`, () => {
    props.tableHeader[randomColumn].type=`sort`
    const wrapper = mount(<TableHeaderCells {...props}/>)

    expect(wrapper.find(`.icon.icon-common.icon-sort-up`)).toHaveLength(1)
    expect(wrapper.find(`.icon.icon-common.icon-sort-down`)).toHaveLength(0)

    props.tableHeader[1].type=`search`
    const wrapper2 = mount(<TableHeaderCells {...props}/>)
    expect(wrapper2.find(Table.SearchHeaderCell)).toHaveLength(1)
  })

})
