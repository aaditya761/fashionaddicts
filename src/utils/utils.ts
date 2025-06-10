import { time } from 'console';
import { JwtPayload} from '../types';


const isExpiringSoon = (exp: number, thresholdInMinutes = 3): boolean => {
    const now = Math.floor(Date.now() / 1000);
    const timeLeft = exp - now;
    console.log(timeLeft);
    return timeLeft < thresholdInMinutes * 60;
  };
  
const parseJwt = (token:string) : JwtPayload => {
const base64Url = token.split('.')[1]; // Get the payload part
const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');

const jsonPayload = decodeURIComponent(
    atob(base64)
    .split('')
    .map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
    .join('')
);

return JSON.parse(jsonPayload);
}

  
export {
    isExpiringSoon,
    parseJwt
}