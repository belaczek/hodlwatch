import React, { Fragment } from 'react'
import { pure } from 'recompose'
import {
  Field,
  Label,
  Title,
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
  editExchangeId,
  edittingExchange,
  exchanges = [],
  handleSubmit,
  handleChange,
  handleCancel,
  handleDelete,
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
  // const exchangeName = getExchangeName(exchanges, exchangeId)
  return (
    <form onSubmit={handleSubmit}>
      {exchanges.length && (
        <Fragment>
          <Field>
            <Label>exchange</Label>
            {editExchangeId ? (
              <Title isSize={4}>{edittingExchange.name}</Title>
            ) : (
              <Control>
                <Select
                  name="exchangeId"
                  value={exchangeId}
                  onChange={handleChange}
                  required
                >
                  <option value="" key="placeholder" disabled>
                    select exchange
                  </option>
                  {exchanges.map(({ name, id }) => (
                    <option key={id} value={id}>
                      {name}
                    </option>
                  ))}
                </Select>
              </Control>
            )}
          </Field>

          {apiKeyField && (
            <Field>
              <Label>public api key</Label>
              <Control>
                <Input
                  name="apiKey"
                  type="text"
                  placeholder="Public api key"
                  required
                  value={apiKey}
                  onChange={handleChange}
                />
              </Control>
            </Field>
          )}

          {secretField && (
            <Field>
              <Label>private api key (secret)</Label>
              <Control>
                <Input
                  name="secret"
                  type="password"
                  required
                  placeholder="secret"
                  value={secret}
                  onChange={handleChange}
                />
              </Control>
            </Field>
          )}

          {uidField && (
            <Field>
              <Label>client ID</Label>
              <Control>
                <Input
                  name="uid"
                  type="text"
                  placeholder="uid"
                  value={uid}
                  onChange={handleChange}
                  required
                />
              </Control>
            </Field>
          )}

          {passwordField && (
            <Field>
              <Label>password</Label>
              <Control>
                <Input
                  name="password"
                  type="password"
                  required
                  placeholder="password"
                  value={password}
                  onChange={handleChange}
                />
              </Control>
            </Field>
          )}

          {submitError && (
            <Notification isColor="danger">{submitError}</Notification>
          )}

          <Field isGrouped>
            <Control>
              <Button isColor="primary" isLoading={submitting} type="submit">
                save
              </Button>
            </Control>
            <Control>
              <Button isColor="light" onClick={handleCancel}>
                cancel
              </Button>
            </Control>
            {editExchangeId && (
              <Control>
                <Button className="is-text" onClick={handleDelete}>
                  delete
                </Button>
              </Control>
            )}
          </Field>
        </Fragment>
      )}
    </form>
  )
}

export default pure(renderExchangeApiForm)
