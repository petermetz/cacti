declare module "sshpk" {
  export interface IParsedKeyMetadata {
    type: string;
    size: number;
    comment: string;
    fingerprint: (format?: string) => { toString(format?: string): string };
    toBuffer: (format?: string) => Buffer;
  }

  export function parseKey(key: string, format: "ssh" | "pem"): IParsedKeyMetadata;
}
