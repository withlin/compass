export interface CephParams {
    monitors: string,
    adminId: string,
    adminSecretName: string,
    adminSecretNamespace: string,
    pool: string,
    userId: string,
    userSecretNamespace: string,
    userSecretName: string,
    fsType: string,
    imageFormat: string,
    imageFeatures: string
}

export const cephParams: CephParams = {
    monitors: "",
    adminId: "",
    adminSecretName: "",
    adminSecretNamespace: "",
    pool: "",
    userId: "",
    userSecretNamespace: "",
    userSecretName: "",
    fsType: "ext4",
    imageFormat: "2",
    imageFeatures: "layering"
}