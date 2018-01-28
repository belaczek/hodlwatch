import React, { Fragment } from 'react'
import { compose, withProps, withHandlers, withState } from 'recompose'
import { Field, Label, Control, Input, Select, Button } from 'bloomer'
import { connect } from 'react-redux'
import { exchangesDataSelector, selectExchangeByName } from 'store/selectors'

const renderExchangeApiForm = ({
  exchanges = [],
  handleSubmit,
  handleChange,
  formData: { exchange, apiKey, secret }
}) => (
  <form onSubmit={handleSubmit}>
    {exchanges.length && (
      <Fragment>
        <Field>
          <Label>Exchange</Label>
          <Control>
            <Select
              name='exchange'
              value={exchange}
              onChange={e => handleChange('exchange', e.target.value)}
              required
            >
              <option value='' key='placeholder' disabled>
                Select exchange
              </option>
              {exchanges.map(({ name }) => (
                <option key={name} value={name}>
                  {name}
                </option>
              ))}
            </Select>
          </Control>
        </Field>
        <Field>
          <Label>Public api key</Label>
          <Control>
            <Input
              name='public'
              type='text'
              placeholder='Public api key'
              value={apiKey}
              onChange={e => handleChange('apiKey', e.target.value)}
            />
          </Control>
        </Field>
        <Field>
          <Label>Private api key</Label>
          <Control>
            <Input
              name='private'
              type='password'
              placeholder='Private api key'
              value={secret}
              onChange={e => handleChange('secret', e.target.value)}
            />
          </Control>
        </Field>
        <Field isGrouped>
          <Control>
            <Button isOutlined isColor='primary'>
              Test connection
            </Button>
          </Control>
          <Control>
            <Button isColor='primary' type='submit'>
              Submit
            </Button>
          </Control>
          <Control>
            <Button isColor='white'>Cancel</Button>
          </Control>
        </Field>
      </Fragment>
    )}
  </form>
)

const ExchangeApiForm = compose(
  connect(state => ({
    exchangesData: exchangesDataSelector(state),
    getExchangeByName: name => selectExchangeByName(name)(state)
  })),
  withProps(
    ({
      exchangesData: {
        data: exchanges,
        loading: exchangesIsLoading,
        error: exchangesError
      }
    }) => ({ exchanges, exchangesIsLoading, exchangesError })
  ),
  withState('formData', 'setFormData', {
    exchange: '',
    apiKey: '',
    secret: ''
  }),
  withHandlers({
    handleChange: ({ setFormData }) => (name, value) =>
      setFormData(state => ({ ...state, [name]: value })),
    handleSubmit: ({ formData }) => e => {
      e.preventDefault()
    },
    // TODO
    handleTestConnection: () => () => {}
  })
)(renderExchangeApiForm)

export default ExchangeApiForm
