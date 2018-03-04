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
import { apiKeysByIdSelector, activeProxySelector } from 'store/modules/apiKeys'
import renderExchangeApiForm from './renderApiForm'
import { defaultErrorMessage } from './constants'
import withExchangeApiService from 'utils/decorators/withExchangeApiService'
import { unusedExchangesListSelector } from 'store/selectors'
import { openModal } from 'store/modules/modals'
import { DELETE_EXCHANGE_API } from '../ModalContainer/modalTypes'
import { exchangeByIdSelector } from 'store/modules/exchanges'
import { saveApiCredentials, deleteApiKeys } from 'store/actions'
// import { importToastService } from 'utils/asyncImportService'

const defaultFormDataState = {
  exchangeId: null,
  apiKey: '',
  secret: '',
  uid: '',
  password: '',
  useProxy: false,
  proxy: '',
  submitError: null,
  submitting: false
}

const ExchangeApiForm = compose(
  withExchangeApiService,
  connect(
    (state, { editExchangeId }) => ({
      exchanges: unusedExchangesListSelector(state),
      edittingExchange: exchangeByIdSelector(editExchangeId)(state),
      apiKeys: apiKeysByIdSelector(editExchangeId)(state),
      activeGlobalProxy: activeProxySelector(state)
    }),
    dispatch => ({
      saveApiCredentials: data => dispatch(saveApiCredentials(data)),
      openDeleteModal: props => dispatch(openModal(DELETE_EXCHANGE_API, props)),
      deleteApiKeys: id => dispatch(deleteApiKeys(id))
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

      setFormData(data => ({
        ...data,
        ...apiKeys,
        useProxy: !!get('proxy', apiKeys)
      }))
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
      const value = target.type === 'checkbox' ? target.checked : target.value
      setFormData(state => ({ ...state, [target.name]: value }))
    }
  }),

  withHandlers({
    handleSubmit: ({
      formData,
      saveApiCredentials,
      testExchangeConnection,
      setFormData,
      setFormState,
      onSuccess,
      activeGlobalProxy
    }) => async e => {
      setFormState(true)
      e.preventDefault()
      const { exchangeId, useProxy, proxy, ...apiCredentials } = formData
      try {
        // parse proxy for api module
        const credentials = {
          ...apiCredentials,
          proxy: useProxy ? proxy : activeGlobalProxy
        }

        // Test api keys by trying to fetch account balance from target exchange
        const data = await testExchangeConnection(exchangeId, credentials)
        console.log(data)
        setFormState(false, null)

        // Save valid apiKeys into store
        saveApiCredentials({ exchangeId, ...credentials })

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
    handleDelete: ({
      openDeleteModal,
      edittingExchange,
      editExchangeId,
      deleteApiKeys,
      onCancel
    }) => () => {
      openDeleteModal({
        exchangeName: get('name', edittingExchange),
        onSubmit: () => {
          onCancel()
          deleteApiKeys(editExchangeId)
        }
      })
    }
  })
)(renderExchangeApiForm)
export default ExchangeApiForm
