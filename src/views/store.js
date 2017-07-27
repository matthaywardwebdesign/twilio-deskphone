import { createStore, applyMiddleware } from 'redux';
import { createLogger } from 'redux-logger';
import thunk from 'redux-thunk';
import { routerMiddleware } from 'react-router-redux';
import { browserHistory } from 'react-router';
import reducers from 'views/reducers';


const DEVELOPMENT = ( process.env.NODE_ENV === 'development' );

const middleware = ( DEVELOPMENT )
  ? applyMiddleware(
    routerMiddleware( browserHistory ),
    createLogger(),
    thunk,
  ) : applyMiddleware(
    routerMiddleware( browserHistory ),
    thunk,
  );
const store = createStore( reducers, middleware );


export default store;
