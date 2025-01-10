export interface OCR2KeyBundle {
  id: string;
  chainType: string;
  configPublicKey: string;
  onChainPublicKey: string;
  offChainPublicKey: string;
  __typename: string;
}

export interface OCR2KeyBundlesPayload {
  results: OCR2KeyBundle[];
  __typename: string;
}

export interface IOcr2KeyBundlesDtoData {
  ocr2KeyBundles: OCR2KeyBundlesPayload;
}

export interface IOcr2KeyBundlesDto {
  data: IOcr2KeyBundlesDtoData;
}
