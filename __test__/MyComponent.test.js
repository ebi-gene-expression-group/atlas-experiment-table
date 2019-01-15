import React from 'react'
import renderer from 'react-test-renderer'
import Enzyme from 'enzyme'
import {shallow, mount, render} from 'enzyme'
import Adapter from 'enzyme-adapter-react-16'

import ExperimentTable from '../src/ExperimentTable.js'

Enzyme.configure({ adapter: new Adapter() })

describe(`MyComponent`, () => {
  test(`should render without throwing an error`, () => {
     expect(shallow(<ExperimentTable />).contains(<div className="foo">Bar</div>)).toBe(true)
  })

  test(`should be selectable by class "foo"`, () => {
    expect(shallow(<ExperimentTable />).is(`.foo`)).toBe(true)
  })

  test(`should mount in a full DOM`, () => {
    expect(mount(<ExperimentTable />).find(`.foo`)).toHaveLength(1)
  })

  test(`should render to static HTML`, () => {
    expect(render(<ExperimentTable />).text()).toEqual(`Bar`)
  })

  test(`matches snapshot`, () => {
    const tree = renderer.create(<ExperimentTable />).toJSON()
    expect(tree).toMatchSnapshot()
  })
})
