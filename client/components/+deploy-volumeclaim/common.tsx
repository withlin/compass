export interface VolumeClaimTemplateMetadata {
  isUseDefaultStorageClass: boolean;
  name: string;
  annotations: Map<string, string>;
}

export interface VolumeClaimTemplateSpecResourcesRequests {
  storage: string;
}

export interface VolumeClaimTemplateSpecResources {
  requests: VolumeClaimTemplateSpecResourcesRequests
}

export interface VolumeClaimTemplateSpec {
  accessModes: string[];
  storageClassName: string;
  resources: VolumeClaimTemplateSpecResources;
}

export interface VolumeClaimTemplate {
  metadata: VolumeClaimTemplateMetadata;
  spec: VolumeClaimTemplateSpec;
}

export interface VolumeClaimTemplates {
  status: boolean;
  volumeClaimTemplates: Array<VolumeClaimTemplate>;
}

export function annotations() {
  let map = new Map()
  map.set("volume.alpha.kubernetes.io/storage-class", "default")
  return map
}

export const volumeClaim: VolumeClaimTemplate = {
  metadata: {
    isUseDefaultStorageClass: true,
    name: "",
    annotations: annotations()
  },
  spec: {
    accessModes: ["ReadWriteOnce"],
    storageClassName: "",
    resources: {
      requests: {
        storage: "",
      }
    }
  }
}