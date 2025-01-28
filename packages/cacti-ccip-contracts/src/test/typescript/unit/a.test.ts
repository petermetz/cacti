import { ethers } from "hardhat";

describe("StructEncoding", () => {
  it("should encode and decode Any2EVMMessage correctly", async () => {
    // Deploy the contract
    const StructEncoding = await ethers.getContractFactory("StructEncoding");
    const structEncoding = await StructEncoding.deploy();
    await structEncoding.deployed();

    // Prepare test data
    const token = "0x1234567890123456789012345678901234567890";
    const message = {
      messageId: ethers.utils.formatBytes32String("exampleMessage"),
      sourceChainSelector: 1,
      sender: ethers.utils.defaultAbiCoder.encode(["address"], [token]),
      data: ethers.utils.defaultAbiCoder.encode(["string"], ["Hello, World!"]),
      destTokenAmounts: [
        {
          token: token,
          amount: 100,
        },
      ],
    };

    // Encode the message
    const cactiMsg = await structEncoding.encodeMessage(message);

    // Decode the message back
    const decodedMessage = await structEncoding.decodeMessage(cactiMsg.data);

    // Assertions
    expect(decodedMessage.messageId).toBe(message.messageId);
    expect(decodedMessage.sourceChainSelector).toBe(
      message.sourceChainSelector,
    );
    expect(decodedMessage.sender).toBe(message.sender);
    expect(decodedMessage.data).toBe(message.data);
    expect(decodedMessage.destTokenAmounts.length).toBe(1);
    expect(decodedMessage.destTokenAmounts[0].token).toBe(token);
    expect(decodedMessage.destTokenAmounts[0].amount).toBe(100);
  });
});
