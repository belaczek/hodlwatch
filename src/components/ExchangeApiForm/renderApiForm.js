import React, { Fragment } from 'react'
import { pure } from 'recompose'
import {
  Field,
  Label,
  Control,
  Input,
  Select,
  Button,
  Notification
} from 'bloomer'

const defaultApiCredentials = {
  apiKey: true,
  secret: true,
  uid: false,
  password: false
}

const renderExchangeApiForm = ({
  exchanges = [],
  handleSubmit,
  handleChange,
  formFields: {
    apiKey: apiKeyField,
    secret: secretField,
    uid: uidField,
    password: passwordField
  } = defaultApiCredentials,
  formData: {
    exchangeId,
    apiKey,
    secret,
    uid,
    password,
    submitting,
    submitError
  }
}) => {
  return (
    <form onSubmit={handleSubmit}>
      {exchanges.length && (
        <Fragment>
          <Field>
            <Label>Exchange</Label>
            <Control>
              <Select
                name='exchangeId'
                value={exchangeId}
                onChange={handleChange}
                required
              >
                <option value='' key='placeholder' disabled>
                  Select exchange
                </option>
                {exchanges.map(({ name, id }) => (
                  <option key={id} value={id}>
                    {name}
                  </option>
                ))}
              </Select>
            </Control>
          </Field>

          {apiKeyField && (
            <Field>
              <Label>Public api key</Label>
              <Control>
                <Input
                  name='apiKey'
                  type='text'
                  placeholder='Public api key'
                  required
                  value={apiKey}
                  onChange={handleChange}
                />
              </Control>
            </Field>
          )}

          {secretField && (
            <Field>
              <Label>Private api key (secret)</Label>
              <Control>
                <Input
                  name='secret'
                  type='password'
                  required
                  placeholder='secret'
                  value={secret}
                  onChange={handleChange}
                />
              </Control>
            </Field>
          )}

          {uidField && (
            <Field>
              <Label>Client ID</Label>
              <Control>
                <Input
                  name='uid'
                  type='text'
                  placeholder='uid'
                  value={uid}
                  onChange={handleChange}
                  required
                />
              </Control>
            </Field>
          )}

          {passwordField && (
            <Field>
              <Label>Password</Label>
              <Control>
                <Input
                  name='password'
                  type='password'
                  required
                  placeholder='password'
                  value={password}
                  onChange={handleChange}
                />
              </Control>
            </Field>
          )}

          {submitError && (
            <Notification isColor='danger'>{submitError}</Notification>
          )}

          <Field isGrouped>
            <Control>
              <Button isColor='primary' isLoading={submitting} type='submit'>
                Save
              </Button>
            </Control>
            <Control>
              <Button isColor='light'>Cancel</Button>
            </Control>
          </Field>
        </Fragment>
      )}
    </form>
  )
}

export default pure(renderExchangeApiForm)
