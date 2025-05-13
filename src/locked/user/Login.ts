import { fetchLocked, fetchFirebase } from "../../utils/Fetch";

export const sendVerificationCode = async (phone: string) => {
    const res: any = await fetchLocked(
        "https://api.locketcamera.com/sendVerificationCode",
        {
            method: "POST",
            body: JSON.stringify({
                data: {
                    deviceModel: "iPhone12,1",
                    operation: "hybrid",
                    phone: phone,
                    use_password_if_available: false,
                },
            }),
        }
    );
    console.log(res);
};

export const validateEmailAddress = async (email: string): Promise<any> => {
    return await fetchLocked(
        "https://api.locketcamera.com/validateEmailAddress",
        {
            method: "POST",
            body: JSON.stringify({
                data: {
                    email: email,
                    // client_token: "3f435338888bab4efa388976857e443bbf38ba96",
                    operation: "create_account",
                    platform: "ios",
                },
            }),
        }
    );
};

export const login = async (email: string, password: string): Promise<any> => {
    return await fetchFirebase(
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword",
        {
            method: "POST",
            body: JSON.stringify({
                email: email,
                password: password,
                clientType: "CLIENT_TYPE_IOS",
                returnSecureToken: true,
            }),
        }
    );
};
