import { fetchLocked, fetchFirebase } from "../../utils/Fetch";

export const getAccountInfo = async (idToken: string): Promise<any> => {
    return await fetchFirebase(
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getAccountInfo",
        {
            method: "POST",
            body: JSON.stringify({
                idToken: idToken,
            }),
        }
    );
};

export const verifyCustomToken = async (customToken: string): Promise<any> => {
    return await fetchFirebase(
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyCustomToken",
        {
            method: "POST",
            body: JSON.stringify({
                token: customToken,
                returnSecureToken: true,
            }),
        }
    );
};

export const getOobConfirmationCode = async (idToken: string): Promise<any> => {
    return await fetchFirebase(
        "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getOobConfirmationCode",
        {
            method: "POST",
            body: JSON.stringify({
                idToken: idToken,
                requestType: "VERIFY_EMAIL",
                clientType: "CLIENT_TYPE_IOS",
            }),
        }
    );
};

export const createPost = async (
    token: string,
    thumbUrl: string,
    caption: string | null | undefined
): Promise<any> => {
    return await fetchLocked("https://api.locketcamera.com/postMomentV2", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: !caption
                ? {
                      thumbnail_url: thumbUrl,
                      recipients: [],
                      overlays: [],
                  }
                : {
                      caption,
                      thumbnail_url: thumbUrl,
                      recipients: [],
                      overlays: [
                          {
                              overlay_id: "caption:standard",
                              overlay_type: "caption",
                              data: {
                                  text_color: "#FFFFFFE6",
                                  text: caption,
                                  type: "standard",
                                  max_lines: 4,
                                  background: {
                                      colors: [],
                                      material_blur: "ultra-thin",
                                  },
                              },
                              alt_text: caption,
                          },
                      ],
                  },
        }),
    });
};

export const getLastPost = async (token: string): Promise<any> => {
    return await fetchLocked("https://api.locketcamera.com/getLatestMomentV2", {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                last_fetch: 1,
                should_count_missed_moments: true,
            },
        }),
    });
};

export const fetchUserV2 = async (uid: string): Promise<any> => {
    return await fetchLocked(`https://api.locketcamera.com/fetchUserV2`, {
        method: "POST",
        body: JSON.stringify({
            data: {
                user_id: uid,
            },
        }),
    });
};

export const getUserByUsername = async (username: string): Promise<any> => {
    return await fetchLocked(`https://api.locketcamera.com/getUserByUsername`, {
        method: "POST",
        body: JSON.stringify({
            data: {
                username: username,
            },
        }),
    });
};

export const sendFriendRequest = async (
    username: string,
    token: string
): Promise<any> => {
    const getUserRes = await getUserByUsername(username);
    if (getUserRes['result']['status'] !== 200) {
        return false;
    }
    const uid = getUserRes['result']['data']['user_id'];
    return await fetchLocked(`https://api.locketcamera.com/sendFriendRequest`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
            data: {
                user_uid: uid,
                source: "navStandard",
                messenger: "Messages",
                platform: "iOS",
                get_reengagement_status: false,
                share_history_eligible: true,
                create_ofr_for_temp_users: false,
                invite_variant: {
                    "@type": "type.googleapis.com/google.protobuf.Int64Value",
                    value: "1002",
                },
                prompted_reengagement: false,
                rollcall: false,
            },
        }),
    });
};
