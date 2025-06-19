import axios from "axios";
// import logo from '../../../../assets/images/logo.png';
const source = axios.CancelToken.source();
export const cancelToken = source.token

// colors
export const PRIMARY = '#481fa8'
export const SECONDARY = '#ff007a'
// export const Logo = logo;