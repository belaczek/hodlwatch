import React from 'react'
import { compose, withState, withHandlers } from 'recompose'
import { connect } from 'react-redux'
import { Field, Label, Control, TextArea, Button, Input, Help } from 'bloomer'
import {
  exportStoreData,
  importStoreData,
  isStringValidExport
} from 'utils/localStorage'
import { openModal } from 'store/modules/modals'
import { IMPORT_SETTINGS_MODAL } from '../ModalContainer/modalTypes'

const renderImportExportForm = ({
  formData: { exportString, importError },
  handleGetExportString,
  handleImportStoreData,
  handleFocus,
  handleChange
}) => (
  <div>
    <Field>
      <Label>import data</Label>
      <Control>
        <Input
          name="importString"
          placeholder={'Paste your exported settings'}
          onChange={handleChange}
          isColor={importError ? 'danger' : null}
        />
        {importError && <Help isColor="danger">{importError}</Help>}
      </Control>
    </Field>
    <Field isGrouped>
      <Control>
        <Button onClick={handleImportStoreData}>import</Button>
      </Control>
    </Field>

    <Field>
      <Label>export data</Label>
      <Control>
        <Button onClick={handleGetExportString}>generate export string</Button>
      </Control>
      {exportString &&
        exportString.length && (
        <React.Fragment>
          <Help>
              Use the following string to import your api keys into another app
              instance
          </Help>
          <Control>
            <TextArea onClick={handleFocus} defaultValue={exportString} />
          </Control>
        </React.Fragment>
      )}
    </Field>
  </div>
)

const initialFormData = {
  importString: '',
  exportString: '',
  importError: null
}

export default compose(
  connect(
    null,
    dispatch => ({
      openImportSettingsModal: props =>
        dispatch(openModal(IMPORT_SETTINGS_MODAL, props))
    })
  ),
  withState('formData', 'setFormData', initialFormData),
  withHandlers({
    handleChange: ({ setFormData }) => ({ target }) => {
      setFormData(state => ({ ...state, [target.name]: target.value }))
    },

    // Generate export string
    handleGetExportString: ({ setFormData, focusExportText }) => () => {
      setFormData(state => ({ ...state, exportString: exportStoreData() }))
    },

    handleFocus: () => e => e.target.select(),

    // Check if import data are valid and open confirmation modal
    handleImportStoreData: ({
      setFormData,
      formData: { importString },
      openImportSettingsModal
    }) => () => {
      if (importString.length && isStringValidExport(importString)) {
        openImportSettingsModal({
          onSubmit: () => {
            importStoreData(importString)
            window.location.reload()
          }
        })
      } else {
        setFormData(state => ({
          ...state,
          importError: 'Invalid import string'
        }))
      }
    }
  })
)(renderImportExportForm)
