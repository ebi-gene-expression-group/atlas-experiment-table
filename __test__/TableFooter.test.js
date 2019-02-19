import React from 'react'
import Enzyme from 'enzyme'
import {shallow} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import { data} from './TestUtils'
import TableFooter from '../src/TableFooter'

Enzyme.configure({ adapter: new Adapter() })

describe(`TableFooter`, () => {
  const props = {
    dataArray: data,
    currentPage: 1,
    selectedNumber: 2,
    data: data,
    onChange: ()=>{}
  }

  test(`should render a previous button, a next button and information text`, () => {
    const wrapper = shallow(<TableFooter {...props}/>)
    expect(wrapper.find('li.next')).toHaveLength(1)
    expect(wrapper.find('li.previous')).toHaveLength(1)
    expect(wrapper.find(`.dataTables_info`)).toHaveLength(1)
  })

})
