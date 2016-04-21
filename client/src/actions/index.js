import axios from 'axios';
import { browserHistory } from 'react-router';

import { AUTH_USER, UNAUTH_USER, AUTH_ERROR, FETCH_MESSAGE} from './types'

const ROOT_URL = 'http://localhost:3090';

export function signinUser({email, password}) {
  console.log(email, password);
  return function(dispatch) { // Redux Thunk give us a direct access to redux dispatch
    //Submit email/password to  our API server
    axios.post(`${ROOT_URL}/signin`, { email, password }) //ES6 {email: email, password: password}
      .then(response => { // .then == Success case
        //If request is good...
        //  - Update state to indicate user is authenticated
        dispatch({ type: AUTH_USER });

        //  - Save the JWT token
        localStorage.setItem('token', response.data.token);

        //  - redirect to the route '/feature'
        browserHistory.push('/feature');
      })
      .catch(() => { // .catch == fail case
        // Id request is bad...
        //  - Show an error to the user
        dispatch(authError('Bad Login Info'));

      });
  }
}

export function signupUser({email, password}) {
  return function(dispatch) {
    console.log(email, password);
    axios.post(`${ROOT_URL}/signup`, {email, password})
      .then(response => {
        dispatch({ type: AUTH_USER });
        localStorage.setItem('token', response.data.token);
        browserHistory.push('/feature');
      })
      .catch(response => {
        dispatch(authError(response.data.error));
      })
  }
}

export function authError(error) {
  return {
    type: AUTH_ERROR,
    payload: error
  }
}

export function signoutUser() {
  localStorage.removeItem('token');
  return { type: UNAUTH_USER }
}

export function fetchMessage() {
  return function(dispatch) {
    axios.get(ROOT_URL, {
      headers: { authorization: localStorage.getItem('token') }
    })
      .then(response => {
        dispatch({
          type: FETCH_MESSAGE,
          payload: response.data.message
        })
      })
  }
}