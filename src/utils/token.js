import moment from "moment";

export function isTokenExp(createAt,tokenType){
    const currentTime = moment();
    const expdate = tokenType === 'access_token'? 15 :1
    const dateFormat =  tokenType === 'access_token'? 'minute' :'days'
    const expirationTime = moment(createAt).add(expdate, dateFormat);

    return currentTime.isAfter(expirationTime);
}