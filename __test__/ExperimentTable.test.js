import React from 'react'
import Enzyme from 'enzyme'
import {shallow, mount} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'
import {getRandomInt, TableCellDiv, data, tableHeader} from './TestUtils'
import ExperimentTable from '../src/ExperimentTable'
import TableFooter from '../src/TableFooter'
import { Table } from 'evergreen-ui'
import _ from "lodash"

Enzyme.configure({ adapter: new Adapter() })

describe(`ExperimentTable`, () => {
  const props = {
    data: data,
    tableHeader: tableHeader,
    host: `fool`,
    resource: `bool`,
    enableDownload: true,
    enableIndex: true,
    TableCellDiv: TableCellDiv
  }

  test(`should render three search general boxes and a table with head and body and two bottom info boxes`, () => {
    const wrapper = shallow(<ExperimentTable {...props}/>)
    expect(wrapper.find(`.small-8.columns`)).toHaveLength(3)

    expect(wrapper.find(Table)).toHaveLength(1)
    expect(wrapper.find(Table.Head)).toHaveLength(1)
    expect(wrapper.find(Table.Body)).toHaveLength(1)

    expect(wrapper.find(TableFooter)).toHaveLength(1)
  })


  test(`should sort table content and change header text icon`, () => {
    const randomColumn =  getRandomInt(1, tableHeader.length)
    props.tableHeader[randomColumn].type=`sort`
    const wrapper = mount(<ExperimentTable {...props}/>)

    expect(wrapper.find(`.icon.icon-common.icon-sort-up`)).toHaveLength(1)
    expect(wrapper.find(`.icon.icon-common.icon-sort-down`)).toHaveLength(0)

    const sortedHeader = wrapper.find(`.header${randomColumn}`).at(0)
    sortedHeader.simulate('click')
    wrapper.update()
    expect(wrapper.find(`.icon.icon-common.icon-sort-up`)).toHaveLength(0)
    sortedHeader.simulate('click')
    wrapper.update()
    expect(wrapper.find(`.icon.icon-common.icon-sort-up`)).toHaveLength(1)
  })

  test(`should filter based on kingdom selection`, () => {
    const event = {target: {name: `pollName`, value: `animals`}}
    const wrapper = mount(<ExperimentTable {...props}/>)
    const kingdomSearch = wrapper.find(`.kingdom`).at(0)
    kingdomSearch.simulate(`change`, event)

    expect(wrapper.state(`selectedKingdom`)).toEqual(`animals`)
    expect(wrapper.find(Table.Row).length).toBeLessThanOrEqual(data.length)
  })

  test(`should filter based on table header search`, () => {
    const randomValue = `si`
    const randomColumn = getRandomInt(1, tableHeader.length)
    props.tableHeader[randomColumn].type=`search`

    const wrapper = mount(<ExperimentTable {...props}/>)
    expect(wrapper.find(`.searchheader${randomColumn}`).exists()).toBe(true)
    wrapper.setState({searchQuery: randomValue})
    wrapper.update()
    expect(wrapper.find(Table.Row).length).toBeLessThanOrEqual(data.length)
  })

  test(`should change page by clicking buttons`, () => {
    const wrapper = mount(<ExperimentTable {...props}/>)
    const currentPage = wrapper.state().currentPage
    wrapper.setState({selectedNumber: 1, currentPage: 1})
    wrapper.update()

    const nextButton = wrapper.find('a.next')
    nextButton.simulate('click')
    wrapper.update()
    expect(wrapper.state().currentPage).toEqual(currentPage+1)

    const prevButton = wrapper.find('a.previous')
    prevButton.simulate('click')
    expect(wrapper.state().currentPage).toEqual(currentPage)

    const pageNumberButton = wrapper.find(`.paginate_button.number a`)
    const currentNumberButton = wrapper.find(`.paginate_button.number.current`)
    expect(pageNumberButton).toHaveLength(data.length-1)
    expect(currentNumberButton).toHaveLength(1)
  })

  test(`should show/hide download based on props`, () => {
    const wrapper = shallow(<ExperimentTable {...props} enableDownload={true}/>)
    expect(wrapper.find(`.downloadHeader`)).toHaveLength(1)

    const wrapperNoDownload= shallow(<ExperimentTable {...props} enableDownload={false}/>)
    expect(wrapperNoDownload.find(`.downloadHeader`)).toHaveLength(0)
  })

  test(`should save experiment accession by check download box`, () => {
    const randomRow = getRandomInt(0, data.length)

    const wrapper = mount(<ExperimentTable {...props} enableDownload={true}/>)
    const propKey = tableHeader[wrapper.state(`orderedColumn`)].dataParam
    const filteredElements = _.sortBy(data, propKey)

    expect(wrapper.state(`checkedArray`)).toEqual([])
    const checkbox = wrapper.find(`.checkbox`).at(randomRow)
    checkbox.simulate(`change`)
    expect(wrapper.state(`checkedArray`)).toEqual([filteredElements[randomRow].experimentAccession])
    checkbox.simulate(`change`)
    expect(wrapper.state(`checkedArray`)).toEqual([])
  })

})
