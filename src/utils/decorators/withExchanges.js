import { compose } from 'recompose'
import { connect } from 'react-redux'
import { exchangesDataSelector } from 'store/selectors'

export default compose(
  connect(state => ({
    exchangesData: exchangesDataSelector(state)
  }))
)
