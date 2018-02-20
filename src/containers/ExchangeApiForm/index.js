import { compose, withHandlers, withState, withPropsOnChange } from 'recompose'
// @ts-ignore
import { isFunction } from 'lodash/fp'
import { connect } from 'react-redux'
import { setExchangeCredentials } from 'store/modules/apiKeys'
import renderExchangeApiForm from './renderApiForm'
import { defaultErrorMessage } from './constants'
import withExchangeApiService from 'utils/decorators/withExchangeApiService'
import { unusedExchangesListSelector } from 'store/selectors'
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

// const castApiCredsSuccess = async () => {
//   const { toast } = await importToastService()
//   toast.success(`Exchange connected!`)
// }

const ExchangeApiForm = compose(
  withExchangeApiService,
  connect(
    state => ({
      exchanges: unusedExchangesListSelector(state)
    }),
    dispatch => ({
      setExchangeCredentials: formData =>
        dispatch(setExchangeCredentials(formData))
    })
  ),
  withState('formData', 'setFormData', defaultFormDataState),

  /**
   * Get required fields based on selected exchange
   */
  withPropsOnChange(
    (
      { exchanges, formData: { exchangeId } },
      { nextExchanges, formData: { nextExchangeId } }
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
      setExchangeCredentials,
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
        setExchangeCredentials(formData)

        // Notify parent about success
        if (isFunction(onSuccess)) {
          onSuccess()
        }
      } catch (e) {
        console.log(e)
        setFormState(false, defaultErrorMessage)
      }
    }
  })
)(renderExchangeApiForm)
export default ExchangeApiForm
