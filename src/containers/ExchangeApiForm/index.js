import {
  compose,
  withHandlers,
  withState,
  withPropsOnChange,
  lifecycle
} from 'recompose'
// @ts-ignore
import { isFunction, get } from 'lodash/fp'
import { connect } from 'react-redux'
import { apiKeysByIdSelector } from 'store/modules/apiKeys'
import renderExchangeApiForm from './renderApiForm'
import { defaultErrorMessage } from './constants'
import withExchangeApiService from 'utils/decorators/withExchangeApiService'
import { unusedExchangesListSelector } from 'store/selectors'
import { openModal } from 'store/modules/modals'
import { DELETE_EXCHANGE_API } from '../ModalContainer/modalTypes'
import { exchangeByIdSelector } from 'store/modules/exchanges'
import { saveApiCredentials } from 'store/actions'
// import { importToastService } from 'utils/asyncImportService'

const defaultFormDataState = {
  exchangeId: '',
  apiKey: '',
  secret: '',
  uid: '',
  password: '',
  submitError: null,
  submitting: false
}

const ExchangeApiForm = compose(
  withExchangeApiService,
  connect(
    (state, { editExchangeId }) => ({
      exchanges: unusedExchangesListSelector(state),
      edittingExchange: exchangeByIdSelector(editExchangeId)(state),
      apiKeys: apiKeysByIdSelector(editExchangeId)(state)
    }),
    dispatch => ({
      saveApiCredentials: formData => dispatch(saveApiCredentials(formData)),
      openDeleteModal: props => dispatch(openModal(DELETE_EXCHANGE_API, props))
    })
  ),

  // Form state, that has exchangeId auto selected when editting existing record
  withState('formData', 'setFormData', ({ editExchangeId }) => ({
    ...defaultFormDataState,
    exchangeId: editExchangeId
  })),

  lifecycle({
    // When the existing apikeys are received from store, merge it into the form state
    componentDidMount () {
      const { apiKeys, setFormData } = this.props
      setFormData(data => ({ ...data, ...apiKeys }))
    }
  }),

  /**
   * Get required fields based on selected exchange
   */
  withPropsOnChange(
    (
      { exchanges = [], formData: { exchangeId } },
      { nextExchanges = [], formData: { nextExchangeId } }
    ) =>
      exchangeId !== nextExchangeId ||
      exchanges.length !== nextExchanges.length,

    ({ formData: { exchangeId }, getExchangeRequiredCredentialsList }) => {
      return { formFields: getExchangeRequiredCredentialsList(exchangeId) }
    }
  ),

  withHandlers({
    setFormState: ({ setFormData }) => (isSubmitting, error) =>
      setFormData(state => ({
        ...state,
        submitError: isSubmitting ? null : error,
        submitting: isSubmitting
      })),
    handleChange: ({ setFormData }) => ({ target }) => {
      setFormData(state => ({ ...state, [target.name]: target.value }))
    }
  }),

  withHandlers({
    handleSubmit: ({
      formData,
      saveApiCredentials,
      testExchangeConnection,
      setFormData,
      setFormState,
      onSuccess
    }) => async e => {
      setFormState(true)
      e.preventDefault()
      const { exchangeId, ...apiCredentials } = formData
      try {
        // Test api keys by trying to fetch account balance from target exchange
        const data = await testExchangeConnection(exchangeId, apiCredentials)
        console.log(data)
        setFormState(false, null)

        // Save valid apiKeys into store
        saveApiCredentials(formData)

        // Notify parent about success
        if (isFunction(onSuccess)) {
          onSuccess()
        }
      } catch (e) {
        console.log(e)
        setFormState(false, defaultErrorMessage)
      }
    },
    handleCancel: ({ onCancel }) => () => {
      onCancel()
    },
    handleDelete: ({ openDeleteModal, edittingExchange }) => exchangeId => {
      openDeleteModal({
        exchangeName: get('name', edittingExchange),
        onSubmit: () => {
          // TODO
          console.log('submitted')
        }
      })
    }
  })
)(renderExchangeApiForm)
export default ExchangeApiForm
