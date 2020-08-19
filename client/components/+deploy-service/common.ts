
export interface ServicePorts {
    name: string,
    protocol: string,
    port: string,
    targetPort: string
}

export interface Service {
    type: string,
    ports: ServicePorts[],
}

export const deployPort: ServicePorts = {
    name: "",
    protocol: "",
    port: "",
    targetPort: ""
}

export const deployService: Service = {
    type: "",
    ports: []
}