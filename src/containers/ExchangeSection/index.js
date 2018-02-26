import React from 'react'
// @ts-ignore
import { Section, Container, Tile, Title, Button, Box } from 'bloomer'
import { compose, pure, withHandlers, withState } from 'recompose'
import { connect } from 'react-redux'
import { savedExchangesListSelector } from 'store/selectors'
import { setExchangeFilter } from 'store/modules/core'
import ExchangeApiForm from 'containers/ExchangeApiForm'

// TODO
const renderExchangeSection = ({
  exchanges,
  handleSetFilter,
  editExchangeId,
  showExchangeForm,
  handleFormCancel,
  handleFormSuccess,
  handleOpenExchangeForm
}) => (
  <Section>
    <Container>
      <Title isSize={4}>
        Exchanges{' '}
        {!showExchangeForm && (
          <Button className="is-text" onClick={() => handleOpenExchangeForm()}>
            Add new
          </Button>
        )}
      </Title>

      {showExchangeForm && (
        <Box>
          <ExchangeApiForm
            editExchangeId={editExchangeId}
            onCancel={handleFormCancel}
            onSuccess={handleFormSuccess}
          />
        </Box>
      )}
      <Tile isAncestor>
        <Tile isParent>
          {exchanges &&
            exchanges.map(({ name, id }) => (
              <Tile isChild key={id}>
                <Title isSize={5} onClick={() => handleSetFilter(id)}>
                  {name}
                </Title>
                <Button
                  isSize="small"
                  onClick={() => handleOpenExchangeForm(id)}
                >
                  edit
                </Button>
              </Tile>
            ))}
        </Tile>
      </Tile>
    </Container>
  </Section>
)

const ExchangeSection = compose(
  connect(
    state => ({
      exchanges: savedExchangesListSelector(state)
    }),
    dispatch => ({
      handleSetFilter: id => dispatch(setExchangeFilter(id))
    })
  ),
  withState('showExchangeForm', 'setExchangeFormState', false),
  withState('editExchangeId', 'setEditExchangeId', null),
  withHandlers({
    handleFormCancel: ({ setExchangeFormState, setEditExchangeId }) => () => {
      setExchangeFormState(false)
      setEditExchangeId(null)
    },
    handleFormSuccess: ({ setExchangeFormState, setEditExchangeId }) => () => {
      setExchangeFormState(false)
      setEditExchangeId(null)
    },
    handleOpenExchangeForm: ({
      setExchangeFormState,
      setEditExchangeId
    }) => id => {
      setEditExchangeId(() => id)
      setExchangeFormState(true)
    }
  }),
  pure
)

export default ExchangeSection(renderExchangeSection)
