// code source: https://github.com/agneym/react-loading
import React from 'react';
import { LoaderProvider, useLoading, Oval } from "@agney/react-loading";
import './LoadingScreen.css';

const LoadingScreen: React.FC = () => {
    const { containerProps, indicatorEl } = useLoading({
        loading: true,
        indicator: <Oval />
      });

return (
    <div id='loading-screen'>
    <section {...containerProps}>
      {indicatorEl}
    </section>
  </div>
)
}

export default LoadingScreen;