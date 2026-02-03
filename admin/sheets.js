const SHEET_ID = "1GUNfJ-OO7DqEqd2UEUcrNRPhy9Sp5HYTedUrq9hk7Qk";
const SHEET_NAME = "LoginADM";


async function getUsers() {
const url = `https://opensheet.elk.sh/${SHEET_ID}/${SHEET_NAME}`;
const res = await fetch(url);
return await res.json();
}
