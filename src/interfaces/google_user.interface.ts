export interface UserFromGoogle {
    additionalUserInfo: AdditionalUserInfo;
    user:               GoogleUser;
}

export interface AdditionalUserInfo {
    providerId: string;
    profile:    Profile;
    isNewUser:  boolean;
}

export interface Profile {
    email_verified: boolean;
    picture:        string;
    name:           string;
    sub:            string;
    iss:            string;
    email:          string;
    iat:            number;
    exp:            number;
    azp:            string;
    aud:            string;
    family_name:    string;
    locale:         string;
    given_name:     string;
}

export interface GoogleUser {
    multiFactor:   MultiFactor;
    metadata:      Metadata;
    photoURL:      string;
    phoneNumber:   null;
    tenantId:      null;
    displayName:   string;
    emailVerified: boolean;
    isAnonymous:   boolean;
    uid:           string;
    email:         string;
    providerData:  ProviderDatum[];
    providerId:    string;
}

export interface Metadata {
    lastSignInTime: number;
    creationTime:   number;
}

export interface MultiFactor {
    enrolledFactors: any[];
}

export interface ProviderDatum {
    email:       string;
    providerId:  string;
    photoURL:    string;
    phoneNumber: null;
    displayName: string;
    uid:         string;
}