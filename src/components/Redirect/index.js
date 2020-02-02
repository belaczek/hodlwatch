import react from "react";
import Router from "next/router";

class Redirect extends react.PureComponent {
  componentDidMount() {
    const { to, as, options, replace } = this.props;
    if (to) {
      if (replace) {
        Router.replace(to, as, options);
      } else {
        Router.push(to, as, options);
      }
    }
  }

  render() {
    return null;
  }
}

export default Redirect;
