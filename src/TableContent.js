import React from 'react'
import PropTypes from 'prop-types'
import { Table } from 'evergreen-ui'
import URI from 'urijs'
import ReactTooltip from 'react-tooltip'
import _ from 'lodash'
import Popup from 'react-popup'

import Prompt from './Prompt'
import tableHeaderCells from './tableHeaderCells'
import TooltipIcon from './TooltipIcon'

const fetchJson = async (endpoint, host, queryParams) => {
  const url = URI(endpoint, host).search(queryParams).toString()
  const response = await fetch(url)
  return await response.json()
}

const alertInvalidFiles = async (host, checkedRows, fileTypes) => {
  const endpoint = `json/experiments/download/zip/check`

  try {
    const response = await fetchJson(endpoint, host, {accession: checkedRows, fileType: fileTypes})
    const data = response.invalidFiles
    const invalidFiles = !_.isEmpty(data) && Object.keys(data).map((experiment) => `${data[experiment].join(`\n`)}`)
    const downloadUrl = URI(`experiments/download/zip`, host).search({accession: checkedRows, fileType: fileTypes}).toString()

    if (_.isEmpty(Object.values(data)[0])) {
      window.location.replace(downloadUrl)
    }
    else if (window.confirm(`The following files are not available.\n${invalidFiles.join(`\n`)}\nWould you like to continue?`))
    {
      window.location.replace(downloadUrl)
    }
  } catch (e) {
    console.log(`error`, e)
  }
}


class TableContent extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      fileTypes: props.enableDownload && props.downloadFileTypes.map(fileType => fileType.id)
    }

    this.onClick = this.onClick.bind(this)
    this.onChange = this.onChange.bind(this)

    Popup.registerPlugin(
      `prompt`,
      (downloadFileTypes, onChange, callback) => {
        Popup.create({
          title: `Download`,
          content: <Prompt downloadFileTypes={downloadFileTypes} onSelect={(v) => onChange(v)}/>,
          buttons: {
            left: [`cancel`],
            right:
              [{
                text: `Download`,
                className: `success`,
                action: () => {
                  callback()
                  Popup.close()
                }
              }]
          }
        })
      }
    )
  }

  onClick(host, checkedRows) {
    Popup.plugins().prompt(
      this.props.downloadFileTypes,
      this.onChange,
      () => { alertInvalidFiles(host, checkedRows, this.state.fileTypes) }
    )
  }

  onChange(fileTypes) {
    this.setState(
      { fileTypes: fileTypes },
      () => {
        Popup.close()
        this.onClick(this.props.host, this.props.checkedRows)
      })
  }

  render() {
    const { tableHeader, searchedColumnIndex, searchQuery, orderedColumnIndex, ascendingOrder, enableDownload,
      checkedRows, currentPageData, host,
      tableHeaderOnClick, tableHeaderOnChange, downloadOnChange, downloadTooltip } = this.props

    return (
      <div className={`row expanded`}>
        <Popup />
        <div className={`small-12 columns`} >
          <Table border>
            <Table.Head>

              {
                tableHeaderCells(tableHeader, searchedColumnIndex, searchQuery, orderedColumnIndex, ascendingOrder,
                  columnNumber => tableHeaderOnClick(columnNumber),
                  (value, columnNumber) => tableHeaderOnChange(value, columnNumber)
                )
              }

              {
                enableDownload && <Table.TextHeaderCell className={`downloadHeader`} flexBasis={100} flexShrink={100} flexGrow={100}>
                  {
                    <div>
                      {
                        checkedRows.length > 0 ?

                          <a className={`downloadButton`}
                             onClick={() => this.onClick(host, checkedRows)}>
                            {/*onClick={() => alertInvalidFiles(host, checkedRows)}>*/}
                            Download {checkedRows.length} {checkedRows.length === 1 ? `entry` : `entries`}
                          </a>
                          :
                          `Download`
                      }
                      <TooltipIcon tooltipText={downloadTooltip}/>
                    </div>
                  }
                </Table.TextHeaderCell>
              }
            </Table.Head>
            <ReactTooltip effect={`solid`}/>
            <Table.Body style={{ overflowY:`hidden` }}>
              {currentPageData.map((data, index) => {
                return (
                  <Table.Row height={`auto`} backgroundColor={index % 2 === 0 ? `white`:`#F1F1F1`} paddingY={14} key={`row${index}`}>

                    {[
                      tableHeader.map((header, index) => {
                        const cellItem = header.image ?
                          header.image[data[header.dataParam]] ?
                            <img src={header.image[data[header.dataParam]].src} alt={header.image[data[header.dataParam]].alt}/> :
                            <span className={`unknown`}>❔</span> :
                          Array.isArray(data[header.dataParam]) ?
                            <ul key={`cell${index}`}>{data[header.dataParam].map(element => <li key={`${element}`}>{element}</li>)}</ul> :
                            data[header.dataParam]

                        return <Table.Cell key={`${cellItem}${index}`} flexBasis={header.width} flexShrink={100} flexGrow={100}>
                          {
                            header.link ?
                              <div><a href={URI(`${header.resource}/${data[header.link]}/${header.endpoint}`, host)}>{cellItem}</a></div>:
                              cellItem
                          }
                        </Table.Cell>
                      }),

                      enableDownload && <Table.Cell key={`checkbox`} flexBasis={100} flexShrink={100} flexGrow={100}>
                        <input type={`checkbox`} className={`checkbox`} checked={checkedRows.includes(data.experimentAccession)}
                               onChange={() => downloadOnChange(data.experimentAccession)} />
                      </Table.Cell>
                    ]}

                  </Table.Row>)
              })
              }
            </Table.Body>
          </Table>
        </div>
      </div>
    )
  }
}

TableContent.propTypes = {
  tableHeader: PropTypes.arrayOf(
    PropTypes.shape({
      type: PropTypes.oneOf([`sort`, `search`, ``]).isRequired,
      title: PropTypes.string.isRequired,
      width: PropTypes.number.isRequired,
      dataParam: PropTypes.string.isRequired,
      image: PropTypes.objectOf(
        PropTypes.shape({
          src: PropTypes.string,
          alt: PropTypes.string
        })
      )
    })
  ),
  searchedColumnIndex: PropTypes.number.isRequired,
  searchQuery: PropTypes.string.isRequired,
  orderedColumnIndex: PropTypes.number.isRequired,
  ascendingOrder: PropTypes.bool.isRequired,
  enableDownload: PropTypes.bool.isRequired,
  checkedRows: PropTypes.arrayOf(PropTypes.string).isRequired,
  currentPageData: PropTypes.arrayOf(PropTypes.object).isRequired,
  host: PropTypes.string.isRequired,
  entriesPerPage: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.number
  ]),
  currentPage: PropTypes.number.isRequired,
  tableHeaderOnClick: PropTypes.func.isRequired,
  tableHeaderOnChange: PropTypes.func.isRequired,
  downloadOnChange: PropTypes.func.isRequired,
  downloadTooltip: PropTypes.string,
  downloadFileTypes: PropTypes.arrayOf(
    PropTypes.shape({
      description: PropTypes.string,
      id: PropTypes.string
    })
  )
}

export {TableContent as default, alertInvalidFiles}
