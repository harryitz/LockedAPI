
export const fetchFirebase = async (url: string, options: RequestInit = {}) => {
    const response = await fetch(url + "?key=AIzaSyCQngaaXQIfJaH0aS2l7REgIjD7nL431So", {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            'Accept-Language': 'en-US',
            'baggage': 'sentry-environment=production,sentry-public_key=78fa64317f434fd89d9cc728dd168f50,sentry-release=com.locket.Locket%401.118.0%2B1,sentry-trace_id=881eafa47c4c4f3e9cc27d48d6e2fa51',
            'X-Client-Version': 'iOS/FirebaseSDK/10.23.1/FirebaseCore-iOS',
            'X-Firebase-AppCheck': 'eyJraWQiOiJEX28wMGciLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOjY0MTAyOTA3NjA4Mzppb3M6Y2M4ZWI0NjI5MGQ2OWIyMzRmYTYwNiIsImF1ZCI6WyJwcm9qZWN0c1wvNjQxMDI5MDc2MDgzIiwicHJvamVjdHNcL2xvY2tldC00MjUyYSJdLCJwcm92aWRlciI6ImRldmljZV9jaGVja19kZXZpY2VfaWRlbnRpZmljYXRpb24iLCJpc3MiOiJodHRwczpcL1wvZmlyZWJhc2VhcHBjaGVjay5nb29nbGVhcGlzLmNvbVwvNjQxMDI5MDc2MDgzIiwiZXhwIjoxNzQ0MzAwMDU4LCJpYXQiOjE3NDQyOTY0NTgsImp0aSI6ImxwV01uS20yWXhYNnZJZS1VZkVFTmloM3ZZX3hONkhJQzJVTXpnbEpkNFEifQ.LPCvc3INsD6-ivIiuhnSFXRHDQ1U7huB1iqKJZIR974PWjVLeFIvt7PkQLvWwhRHOHM9bp3WGFK8u6_7C6mMWGM2ytujZceCayMH9xG9dMuWVAIuX1eO79L1vm9rR4ngqEZJiA3pzob0rWWexkD2kR6NdBbvCZYg3ZqTLV7NCkaBMJMQqK0qAI9C5mFMNBOQQv9uQmrCIK9hSjOGkNN0EvnsjT4LgV8Sz-S4Z337JKHIXNLolHCzNtiAgOUMROStuGK7mj-oCPV56SxdGTx4PTOweHNDwKrWZrdHqXHv9R8decSZGB812_ExCDW0P2UUUqIQZDU9mqYzl81rWyjNofFKSMbHW0yVzk8F7P2tgw2igtP-gCAmwRMW5l93u4irryaTiJrIXGmy8x6gUa6Z_bC9MiDSTDfk91Q44zX1NwrVA6lR2mMpbmFAbxUqvfaUgvNLIbaATa360l-weyxJEhmrz2CdMRYgPXcBNsDPUT5fQrm4uRs0w4ujdB7rx8Sw',
            'User-Agent': 'FirebaseAuth.iOS/10.23.1 com.locket.Locket/1.118.0 iPhone/18.4 hw/iPhone13_3',
            'X-Firebase-GMPID': '1:641029076083:ios:cc8eb46290d69b234fa606',
            'X-Ios-Bundle-Identifier': 'com.locket.Locket',
            ...options.headers
        },
    });
    
    if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
    }
    
    const data = await response.json();
    return data;
}

export const fetchLocked = async (url: string, options: RequestInit = {}): Promise<any> => {
    return new Promise((resolve, reject) => {
        return fetch(url, {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                'Accept-Language': 'en-US',
                'User-Agent': 'com.locket.Locket/1.118.0 iPhone/18.4 hw/iPhone13_3',
                'baggage': 'sentry-environment=production,sentry-public_key=78fa64317f434fd89d9cc728dd168f50,sentry-release=com.locket.Locket%401.118.0%2B1,sentry-trace_id=881eafa47c4c4f3e9cc27d48d6e2fa51',
                'Firebase-Instance-ID-Token': 'ekgSkqndwUGusC7rJcjDFu:APA91bHED2BKuDwpQW49ETx4Xtw0F3bUMl9v9sxKWz7oIT9DG3fw7Ot_z0W5pBmiPpcY-xKDiIzanBctgQutIa172u-RYpXWlL1YPp1_KJsUEJt6I2c9DOQ',
                'X-Firebase-AppCheck': 'eyJraWQiOiJEX28wMGciLCJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJzdWIiOiIxOjY0MTAyOTA3NjA4Mzppb3M6Y2M4ZWI0NjI5MGQ2OWIyMzRmYTYwNiIsImF1ZCI6WyJwcm9qZWN0c1wvNjQxMDI5MDc2MDgzIiwicHJvamVjdHNcL2xvY2tldC00MjUyYSJdLCJwcm92aWRlciI6ImRldmljZV9jaGVja19kZXZpY2VfaWRlbnRpZmljYXRpb24iLCJpc3MiOiJodHRwczpcL1wvZmlyZWJhc2VhcHBjaGVjay5nb29nbGVhcGlzLmNvbVwvNjQxMDI5MDc2MDgzIiwiZXhwIjoxNzQ0MzAwMDU4LCJpYXQiOjE3NDQyOTY0NTgsImp0aSI6ImxwV01uS20yWXhYNnZJZS1VZkVFTmloM3ZZX3hONkhJQzJVTXpnbEpkNFEifQ.LPCvc3INsD6-ivIiuhnSFXRHDQ1U7huB1iqKJZIR974PWjVLeFIvt7PkQLvWwhRHOHM9bp3WGFK8u6_7C6mMWGM2ytujZceCayMH9xG9dMuWVAIuX1eO79L1vm9rR4ngqEZJiA3pzob0rWWexkD2kR6NdBbvCZYg3ZqTLV7NCkaBMJMQqK0qAI9C5mFMNBOQQv9uQmrCIK9hSjOGkNN0EvnsjT4LgV8Sz-S4Z337JKHIXNLolHCzNtiAgOUMROStuGK7mj-oCPV56SxdGTx4PTOweHNDwKrWZrdHqXHv9R8decSZGB812_ExCDW0P2UUUqIQZDU9mqYzl81rWyjNofFKSMbHW0yVzk8F7P2tgw2igtP-gCAmwRMW5l93u4irryaTiJrIXGmy8x6gUa6Z_bC9MiDSTDfk91Q44zX1NwrVA6lR2mMpbmFAbxUqvfaUgvNLIbaATa360l-weyxJEhmrz2CdMRYgPXcBNsDPUT5fQrm4uRs0w4ujdB7rx8Sw',
                ...options.headers
            },
        })
        .then((response) => {
            if (!response.ok) {
                reject(new Error(`Error: ${response.status} ${response.statusText}`));
            } else {
                return response.json();
            }
        })
        .then((data) => resolve(data))
        .catch((error) => reject(error));
    });
}