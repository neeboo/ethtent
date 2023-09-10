"use strict";
Object.defineProperty(exports, "__esModule", {
    value: true
});
function _export(target, all) {
    for(var name in all)Object.defineProperty(target, name, {
        enumerable: true,
        get: all[name]
    });
}
_export(exports, {
    _createActor: function() {
        return _createActor;
    },
    getActor: function() {
        return getActor;
    },
    hasOwnProperty: function() {
        return hasOwnProperty;
    }
});
const _agent = require("@dfinity/agent");
const _principal = require("@dfinity/principal");
async function _createActor(interfaceFactory, canisterId, identity, host) {
    var _ref;
    let actualHost = (_ref = host !== null && host !== void 0 ? host : 'http://127.0.0.1:8080') !== null && _ref !== void 0 ? _ref : 'https://icp-api.io';
    const agent = new _agent.HttpAgent({
        identity,
        host: actualHost
    });
    if (actualHost !== 'https://icp-api.io') {
        await agent.fetchRootKey();
    }
    const actor = _agent.Actor.createActor(interfaceFactory, {
        agent,
        canisterId: canisterId === '' ? _principal.Principal.fromText('aaaaa-aa') : canisterId
    });
    return {
        actor,
        agent
    };
}
const getActor = async (signIdentity, interfaceFactory, canisterId, host)=>{
    const actor = await _createActor(interfaceFactory, canisterId, signIdentity, host);
    return actor.actor;
};
function hasOwnProperty(obj, prop) {
    return Object.prototype.hasOwnProperty.call(obj, prop);
}
