import React from 'react'
import * as FileSaver from 'file-saver'
import * as XLSX from 'xlsx'
import CIcon from "@coreui/icons-react"

export const ExportCSV = ({csvData, fileName, headings, wscols}) => {

  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  const fileExtension = '.xlsx'

  const exportToCSV = (csvData, fileName, headings, wscols) => {

    const ws = XLSX.utils.book_new()
    ws['!cols'] = wscols
    XLSX.utils.sheet_add_aoa(ws, [headings])
    XLSX.utils.sheet_add_json(ws, csvData, { origin: 'A2', skipHeader: true });
    const wb = { Sheets: { 'data': ws }, SheetNames: ['data'] }
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' })
    const data = new Blob([excelBuffer], {type: fileType})
    FileSaver.saveAs(data, fileName + fileExtension);
  }

  return (
    <button
      className="btn btn-success"
      onClick={(e) => exportToCSV(csvData, fileName, headings, wscols)}
    >
      <CIcon name="cil-data-transfer-down"/> Экспортировать в xlsx
    </button>
  )
}
