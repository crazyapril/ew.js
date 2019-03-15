import axios from 'axios';

/**
 * Config global for axios/django
 */
axios.defaults.withCredentials = true
axios.defaults.xsrfHeaderName = "X-CSRFToken"
axios.defaults.xsrfCookieName = 'csrftoken'

export default axios;
