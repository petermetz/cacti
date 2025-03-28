/*
Hyperledger Cacti Plugin - Connector Corda

Can perform basic tasks on a Corda ledger

API version: 2.1.0
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-corda

import (
	"encoding/json"
)

// checks if the NodeInfo type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &NodeInfo{}

// NodeInfo struct for NodeInfo
type NodeInfo struct {
	Addresses []NetworkHostAndPort `json:"addresses"`
	PlatformVersion int32 `json:"platformVersion"`
	Serial float32 `json:"serial"`
	LegalIdentities []Party `json:"legalIdentities"`
	LegalIdentitiesAndCerts []map[string]interface{} `json:"legalIdentitiesAndCerts"`
}

// NewNodeInfo instantiates a new NodeInfo object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewNodeInfo(addresses []NetworkHostAndPort, platformVersion int32, serial float32, legalIdentities []Party, legalIdentitiesAndCerts []map[string]interface{}) *NodeInfo {
	this := NodeInfo{}
	this.Addresses = addresses
	this.PlatformVersion = platformVersion
	this.Serial = serial
	this.LegalIdentities = legalIdentities
	this.LegalIdentitiesAndCerts = legalIdentitiesAndCerts
	return &this
}

// NewNodeInfoWithDefaults instantiates a new NodeInfo object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewNodeInfoWithDefaults() *NodeInfo {
	this := NodeInfo{}
	return &this
}

// GetAddresses returns the Addresses field value
func (o *NodeInfo) GetAddresses() []NetworkHostAndPort {
	if o == nil {
		var ret []NetworkHostAndPort
		return ret
	}

	return o.Addresses
}

// GetAddressesOk returns a tuple with the Addresses field value
// and a boolean to check if the value has been set.
func (o *NodeInfo) GetAddressesOk() ([]NetworkHostAndPort, bool) {
	if o == nil {
		return nil, false
	}
	return o.Addresses, true
}

// SetAddresses sets field value
func (o *NodeInfo) SetAddresses(v []NetworkHostAndPort) {
	o.Addresses = v
}

// GetPlatformVersion returns the PlatformVersion field value
func (o *NodeInfo) GetPlatformVersion() int32 {
	if o == nil {
		var ret int32
		return ret
	}

	return o.PlatformVersion
}

// GetPlatformVersionOk returns a tuple with the PlatformVersion field value
// and a boolean to check if the value has been set.
func (o *NodeInfo) GetPlatformVersionOk() (*int32, bool) {
	if o == nil {
		return nil, false
	}
	return &o.PlatformVersion, true
}

// SetPlatformVersion sets field value
func (o *NodeInfo) SetPlatformVersion(v int32) {
	o.PlatformVersion = v
}

// GetSerial returns the Serial field value
func (o *NodeInfo) GetSerial() float32 {
	if o == nil {
		var ret float32
		return ret
	}

	return o.Serial
}

// GetSerialOk returns a tuple with the Serial field value
// and a boolean to check if the value has been set.
func (o *NodeInfo) GetSerialOk() (*float32, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Serial, true
}

// SetSerial sets field value
func (o *NodeInfo) SetSerial(v float32) {
	o.Serial = v
}

// GetLegalIdentities returns the LegalIdentities field value
func (o *NodeInfo) GetLegalIdentities() []Party {
	if o == nil {
		var ret []Party
		return ret
	}

	return o.LegalIdentities
}

// GetLegalIdentitiesOk returns a tuple with the LegalIdentities field value
// and a boolean to check if the value has been set.
func (o *NodeInfo) GetLegalIdentitiesOk() ([]Party, bool) {
	if o == nil {
		return nil, false
	}
	return o.LegalIdentities, true
}

// SetLegalIdentities sets field value
func (o *NodeInfo) SetLegalIdentities(v []Party) {
	o.LegalIdentities = v
}

// GetLegalIdentitiesAndCerts returns the LegalIdentitiesAndCerts field value
func (o *NodeInfo) GetLegalIdentitiesAndCerts() []map[string]interface{} {
	if o == nil {
		var ret []map[string]interface{}
		return ret
	}

	return o.LegalIdentitiesAndCerts
}

// GetLegalIdentitiesAndCertsOk returns a tuple with the LegalIdentitiesAndCerts field value
// and a boolean to check if the value has been set.
func (o *NodeInfo) GetLegalIdentitiesAndCertsOk() ([]map[string]interface{}, bool) {
	if o == nil {
		return nil, false
	}
	return o.LegalIdentitiesAndCerts, true
}

// SetLegalIdentitiesAndCerts sets field value
func (o *NodeInfo) SetLegalIdentitiesAndCerts(v []map[string]interface{}) {
	o.LegalIdentitiesAndCerts = v
}

func (o NodeInfo) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o NodeInfo) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["addresses"] = o.Addresses
	toSerialize["platformVersion"] = o.PlatformVersion
	toSerialize["serial"] = o.Serial
	toSerialize["legalIdentities"] = o.LegalIdentities
	toSerialize["legalIdentitiesAndCerts"] = o.LegalIdentitiesAndCerts
	return toSerialize, nil
}

type NullableNodeInfo struct {
	value *NodeInfo
	isSet bool
}

func (v NullableNodeInfo) Get() *NodeInfo {
	return v.value
}

func (v *NullableNodeInfo) Set(val *NodeInfo) {
	v.value = val
	v.isSet = true
}

func (v NullableNodeInfo) IsSet() bool {
	return v.isSet
}

func (v *NullableNodeInfo) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableNodeInfo(val *NodeInfo) *NullableNodeInfo {
	return &NullableNodeInfo{value: val, isSet: true}
}

func (v NullableNodeInfo) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableNodeInfo) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


