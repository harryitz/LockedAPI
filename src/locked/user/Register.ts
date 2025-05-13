import { fetchLocked, fetchFirebase } from "../../utils/Fetch";
import { getOobConfirmationCode, verifyCustomToken } from "./Account";

export const register = async (
    last_name: string,
    first_name: string,
    username: string,
    email: string,
    password: string
): Promise<any> => {
    const regRes = await fetchLocked(
        "https://api.locketcamera.com/createAccountWithEmailPassword",
        {
            method: "POST",
            body: JSON.stringify({
                data: {
                    password: password,
                    email: email,
                    client_email_verif: true,
                    platform: "ios",
                },
            }),
        }
    );
    const customToken = await verifyCustomToken(regRes["result"]["token"]);
    const oob = await getOobConfirmationCode(customToken["idToken"]);
    return await fetchLocked(
        "https://api.locketcamera.com/finalizeTemporaryUser",
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${oob["idToken"]}`,
            },
            body: JSON.stringify({
                data: {
                    username: username,
                    last_name: last_name,
                    require_username: true,
                    first_name: first_name,
                },
            }),
        }
    );
};
