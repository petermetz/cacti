/*
 * Copyright IBM Corp. All Rights Reserved.
 *
 * SPDX-License-Identifier: Apache-2.0
 */

/* eslint-disable no-unused-expressions */
/* eslint-disable no-new */
/* eslint-disable no-underscore-dangle */

const rewire = require("rewire");

const RelayHelper = rewire("../src/Relay");
const chai = require("chai");

const sinon = require("sinon");
const sinonChai = require("sinon-chai");

import statePb from "@hyperledger-labs/weaver-protos-js/common/state_pb";
import ackPb from "@hyperledger-labs/weaver-protos-js/common/ack_pb";
import networksGrpcPb from "@hyperledger-labs/weaver-protos-js/networks/networks_grpc_pb";
import networksPb from "@hyperledger-labs/weaver-protos-js/networks/networks_pb";

const { expect } = chai;
chai.use(sinonChai);
const { Relay } = RelayHelper;
var PROTO_PATH = 'networks/networks.proto';
var grpc = require('@grpc/grpc-js');
var protoLoader = require('@grpc/proto-loader');
// Suggested options for similarity to existing grpc.load behavior
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true,
     includeDirs: [__dirname + '/../../../../common/protos']
    });
var networksProto = grpc.loadPackageDefinition(packageDefinition);
// The protoDescriptor object has the full package hierarchy

const expectThrowsAsync = async (method, errorMessage) => {
    let error = null;
    try {
        await method();
    } catch (err) {
        error = err;
    }
    expect(error).to.be.an("Error");
    if (errorMessage) {
        expect(error.message).to.equal(errorMessage);
    }
};

function getState(inputmsg) {
    const meta = new statePb.Meta();
    meta.setProtocol(statePb.Meta.Protocol.FABRIC);
    meta.setTimestamp(new Date().toISOString());
    meta.setProofType('Notarization');
    meta.setSerializationFormat('STRING');
    
    const view = new statePb.View();
    view.setMeta(meta);
    view.setData(Buffer.from('1'));
    const relayResponse = new statePb.RequestState();
    relayResponse.setRequestId("ABC-123");
    relayResponse.setStatus(statePb.RequestState.COMPLETED);
    relayResponse.setView(view);
    console.log("Returning from getState in server")
    return relayResponse
}
function requestState(query) {
    const ack = new ackPb.Ack();
    ack.setStatus(ackPb.Ack.STATUS.OK)
    ack.setRequestId("ABC-123")
    return ack
}

// TODO: Add more testing for relay, need a mock gRPC endpoint
describe("Relay", () => {
    let revert;

    const sandbox = sinon.createSandbox();
    let FakeLogger;
    let FakeUtils;

    beforeEach(() => {
        revert = [];
        FakeLogger = {
            debug: () => {},
            error: () => {},
            warn: () => {},
        };
        sandbox.stub(FakeLogger, "debug");
        sandbox.stub(FakeLogger, "error");
        sandbox.stub(FakeLogger, "warn");

        FakeUtils = {
            getConfigSetting: () => {},
            checkIntegerConfig: () => {},
            pemToDER: () => {},
        };
        sandbox.stub(FakeUtils);
    });

    afterEach(() => {
        if (revert.length) {
            revert.forEach(Function.prototype.call, Function.prototype.call);
        }
        sandbox.restore();
    });

    describe("#constructor", () => {
        it("should not permit creation without an url", () => {
            (() => {
                new Relay();
            }).should.throw(/Invalid Arguments/);
        });

        it("should create a valid instance without any opts", () => {
            (() => {
                new Relay("http://someurl");
            }).should.not.throw();
        });
    });

    describe("#getEndpoint", () => {
        let relay;

        beforeEach(() => {
            relay = new Relay("http://someurl");
        });

        it("should set the _endPoint property", () => {
            const expectedUrl = "somenewurl";
            relay._endPoint = expectedUrl;
            relay.getEndpoint().should.equal(expectedUrl);
        });
    });

    describe("#performRemoteRequest", () => {
        let relay;

        it("catch invalid url while doing DNS lookup", async () => {
            relay = new Relay("https://someurl:9080");
            await expectThrowsAsync(() =>
                relay.ProcessRequest("address", "policy", "requestingNetwork", "cert", "sig", "nonce"),
            );
        });
    });
    
    describe("#getState", () => {
        const relay = new Relay("localhost:9080");

        
        // let networkClientStub;
        var relayServer = new grpc.Server();
        beforeEach(() => {
            relayServer.addService(networksProto.networks.networks.Network.service, {
                getState: getState,
                requestState: requestState
            });
            relayServer.bindAsync('0.0.0.0:9080', grpc.ServerCredentials.createInsecure(), () => {
                relayServer.start();
            });
            // networkClientStub = sinon.stub(networksGrpcPb.NetworkClient.prototype)
            // networkClientStub.getState.returns(relayResponse);
            // networkClientStub.requestState.returns(ack);
        });
        afterEach(() => {
            // relayServer.forceShutdown()
        });
        it("successful send request", async () => {
            const res = await relay.GetRequest("");
            console.log("return")
            expect(res).to.equal(ack);
            done();
        });
    });
});
