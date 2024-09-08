import * as apiSurface from "@hyperledger/cacti-plugin-ledger-connector-chainlink";

test("Library can be loaded", async () => {
  expect(apiSurface).toBeTruthy();
});
