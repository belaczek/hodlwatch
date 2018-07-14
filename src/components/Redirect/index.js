import react from 'react'
import Router from 'next/router'

class Redirect extends react.Component {
  // componentDidMount () {
  //   console.log(this.props)

  //   const { to, as, options } = this.props
  //   if (to) {
  //     Router.push(to, as, options)
  //   }
  // }

  componentDidMount () {
    const { to, as, options, replace } = this.props
    if (to) {
      if (replace) {
        Router.replace(to, as, options)
      } else {
        Router.push(to, as, options)
      }
    }
  }

  render () {
    return null
  }
}

export default Redirect
