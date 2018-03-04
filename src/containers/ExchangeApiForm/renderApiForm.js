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
  Notification,
  Help
} from 'bloomer'
import { DEFAULT_PROXY_URL } from 'appConstants'

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
    submitError,
    proxy,
    useProxy
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
                  <option value="" key="placeholder" disabled selected>
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

          <Field>
            <Label>advanced</Label>
            <Control>
              <input
                id="useProxySwitch"
                type="checkbox"
                name="useProxy"
                className="switch is-rounded is-success"
                checked={useProxy}
                onChange={handleChange}
              />
              <label htmlFor="useProxySwitch">enable proxy</label>
            </Control>
            {useProxy && (
              <Control className="mt-10">
                <Input
                  name="proxy"
                  type="text"
                  placeholder="proxy url"
                  defaultValue={DEFAULT_PROXY_URL}
                  value={proxy}
                  onChange={handleChange}
                  required
                />
                <Help>Example proxy: {DEFAULT_PROXY_URL}</Help>
                <Help isColor="danger">
                  WARNING: using proxy server of any third party may pose a
                  safety risk as proxy provider may have access to all your
                  requests content
                </Help>
              </Control>
            )}
          </Field>

          {submitError && (
            <React.Fragment>
              <Notification isColor="danger">{submitError}</Notification>
              {useProxy ? null : (
                <Notification isColor="warning">
                  TIP: If you receive an error repatedly, try enabling and
                  setting up a proxy server to avoid issues with{' '}
                  <a href="https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS">
                    CORS
                  </a>
                </Notification>
              )}
            </React.Fragment>
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
