import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';
import {QueryClient, QueryClientProvider} from 'react-query'
import '../../scss/app.scss';
import Router from './Router';
import ScrollToTop from './ScrollToTop';


const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 3000,
      retry: (failureCount, error) => {
        console.error(error.message);
        return failureCount < 2 && (!error?.response?.status || error.response.status >= 500);
      },
      retryDelay: attemptIndex => Math.min(1000 * 5 * (attemptIndex + 1), 10000),
    },
  },
})


class App extends Component {
  constructor() {
    super();
    this.state = {
      loading: true,
      loaded: false,
    };
  }

  componentDidMount() {
    window.addEventListener('load', () => {
      this.setState({loading: false, loaded: false});
      setTimeout(() => this.setState({loading: false, loaded: true}), 500);
    });
  }

  render() {
    const {loaded, loading} = this.state;
    return (
      <QueryClientProvider client={queryClient}>
        {/*<ReactQueryDevtools initialIsOpen={false}/>*/}
        <BrowserRouter>
          <ScrollToTop>
            {!loaded
              && (
                <div className={`load${loading ? '' : ' loaded'}`}>
                  <div className="load__icon-wrap">
                    <svg className="load__icon">
                      <path fill="#4ce1b6" d="M12,4V2A10,10 0 0,0 2,12H4A8,8 0 0,1 12,4Z"/>
                    </svg>
                  </div>
                </div>
              )
            }
            <div>
              <Router/>
            </div>
          </ScrollToTop>
        </BrowserRouter>
      </QueryClientProvider>
    );
  }
}

export default App;
