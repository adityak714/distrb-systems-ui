// code source https://reactjs.org/docs/error-boundaries.html
import { Component } from "react";
import { Props, State } from "./ErrorBoundaryTypes";
import ServerError from "./ServerError";


export default class ErrorBoundary extends Component<Props, State> {
   state: State = {
    errorOccured: false
  };

   static getDerivedStateFromError(error: Error): State {
    // if there is an error, this will return true and return some page.
    return { errorOccured: true };
  }

  public render() {
      if (this.state.errorOccured) {
        //return a error page
      return <ServerError />;
    } else {
        // otherwise render as normal
        return this.props.children;
    }
  }
}

