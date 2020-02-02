import React from "react";
import { Box, Button, Title, Field, Label, Control, Select } from "bloomer";
import ModalWrapper from "./ModalWrapper";
import { connect } from "react-redux";
import { compose, withProps, withHandlers } from "recompose";
import { RESET_APP_MODAL } from "containers/ModalContainer/modalTypes";
import ImportExportFormContainer from "containers/ImportExportFormContainer";
import { openModal } from "store/modules/modals";
import { changeQuoteCurrency } from "store/actions";
import { quoteSymbolSelector } from "store/modules/core";
import { QUOTE_SYMBOL_LIST } from "appConstants";

const renderResetAppModalBody = ({
  openResetModal,
  quoteSymbol,
  quoteSymbolList,
  handleChangeQuoteCurrency
}) => (
  <Box hasTextAlign="left">
    <Title>settings</Title>

    <Field>
      <Label>quote currency</Label>
      <Control>
        <Select
          value={quoteSymbol}
          onChange={handleChangeQuoteCurrency}
          required
        >
          {quoteSymbolList.map(name => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </Select>
      </Control>
    </Field>

    <ImportExportFormContainer />

    <Field className="mt-10">
      <Label>reset App</Label>
      <Control>
        <Button isSize="small" isColor="danger" onClick={openResetModal}>
          RESET
        </Button>
      </Control>
    </Field>
  </Box>
);

export default compose(
  ModalWrapper,
  connect(
    state => ({
      quoteSymbol: quoteSymbolSelector(state)
    }),
    dispatch => ({
      openResetModal: () => dispatch(openModal(RESET_APP_MODAL)),
      changeQuoteCurrency: currency => dispatch(changeQuoteCurrency(currency))
    })
  ),
  withProps({
    quoteSymbolList: QUOTE_SYMBOL_LIST
  }),
  withHandlers({
    handleChangeQuoteCurrency: ({ changeQuoteCurrency }) => e =>
      changeQuoteCurrency(e.target.value)
  })
)(renderResetAppModalBody);
