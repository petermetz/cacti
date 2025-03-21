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

// checks if the InvokeContractV1Response type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &InvokeContractV1Response{}

// InvokeContractV1Response struct for InvokeContractV1Response
type InvokeContractV1Response struct {
	Success bool `json:"success"`
	// Data returned from the JVM when no transaction is running
	CallOutput map[string]interface{} `json:"callOutput"`
	// The net.corda.core.flows.StateMachineRunId value returned by the flow execution.
	TransactionId *string `json:"transactionId,omitempty"`
	// An array of strings representing the aggregated stream of progress updates provided by a *tracked* flow invocation. If the flow invocation was not tracked, this array is still returned, but as empty.
	Progress []string `json:"progress,omitempty"`
	// The id for the flow handle
	FlowId string `json:"flowId"`
}

// NewInvokeContractV1Response instantiates a new InvokeContractV1Response object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewInvokeContractV1Response(success bool, callOutput map[string]interface{}, flowId string) *InvokeContractV1Response {
	this := InvokeContractV1Response{}
	this.Success = success
	this.CallOutput = callOutput
	this.FlowId = flowId
	return &this
}

// NewInvokeContractV1ResponseWithDefaults instantiates a new InvokeContractV1Response object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewInvokeContractV1ResponseWithDefaults() *InvokeContractV1Response {
	this := InvokeContractV1Response{}
	return &this
}

// GetSuccess returns the Success field value
func (o *InvokeContractV1Response) GetSuccess() bool {
	if o == nil {
		var ret bool
		return ret
	}

	return o.Success
}

// GetSuccessOk returns a tuple with the Success field value
// and a boolean to check if the value has been set.
func (o *InvokeContractV1Response) GetSuccessOk() (*bool, bool) {
	if o == nil {
		return nil, false
	}
	return &o.Success, true
}

// SetSuccess sets field value
func (o *InvokeContractV1Response) SetSuccess(v bool) {
	o.Success = v
}

// GetCallOutput returns the CallOutput field value
func (o *InvokeContractV1Response) GetCallOutput() map[string]interface{} {
	if o == nil {
		var ret map[string]interface{}
		return ret
	}

	return o.CallOutput
}

// GetCallOutputOk returns a tuple with the CallOutput field value
// and a boolean to check if the value has been set.
func (o *InvokeContractV1Response) GetCallOutputOk() (map[string]interface{}, bool) {
	if o == nil {
		return map[string]interface{}{}, false
	}
	return o.CallOutput, true
}

// SetCallOutput sets field value
func (o *InvokeContractV1Response) SetCallOutput(v map[string]interface{}) {
	o.CallOutput = v
}

// GetTransactionId returns the TransactionId field value if set, zero value otherwise.
func (o *InvokeContractV1Response) GetTransactionId() string {
	if o == nil || IsNil(o.TransactionId) {
		var ret string
		return ret
	}
	return *o.TransactionId
}

// GetTransactionIdOk returns a tuple with the TransactionId field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *InvokeContractV1Response) GetTransactionIdOk() (*string, bool) {
	if o == nil || IsNil(o.TransactionId) {
		return nil, false
	}
	return o.TransactionId, true
}

// HasTransactionId returns a boolean if a field has been set.
func (o *InvokeContractV1Response) HasTransactionId() bool {
	if o != nil && !IsNil(o.TransactionId) {
		return true
	}

	return false
}

// SetTransactionId gets a reference to the given string and assigns it to the TransactionId field.
func (o *InvokeContractV1Response) SetTransactionId(v string) {
	o.TransactionId = &v
}

// GetProgress returns the Progress field value if set, zero value otherwise.
func (o *InvokeContractV1Response) GetProgress() []string {
	if o == nil || IsNil(o.Progress) {
		var ret []string
		return ret
	}
	return o.Progress
}

// GetProgressOk returns a tuple with the Progress field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *InvokeContractV1Response) GetProgressOk() ([]string, bool) {
	if o == nil || IsNil(o.Progress) {
		return nil, false
	}
	return o.Progress, true
}

// HasProgress returns a boolean if a field has been set.
func (o *InvokeContractV1Response) HasProgress() bool {
	if o != nil && !IsNil(o.Progress) {
		return true
	}

	return false
}

// SetProgress gets a reference to the given []string and assigns it to the Progress field.
func (o *InvokeContractV1Response) SetProgress(v []string) {
	o.Progress = v
}

// GetFlowId returns the FlowId field value
func (o *InvokeContractV1Response) GetFlowId() string {
	if o == nil {
		var ret string
		return ret
	}

	return o.FlowId
}

// GetFlowIdOk returns a tuple with the FlowId field value
// and a boolean to check if the value has been set.
func (o *InvokeContractV1Response) GetFlowIdOk() (*string, bool) {
	if o == nil {
		return nil, false
	}
	return &o.FlowId, true
}

// SetFlowId sets field value
func (o *InvokeContractV1Response) SetFlowId(v string) {
	o.FlowId = v
}

func (o InvokeContractV1Response) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o InvokeContractV1Response) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	toSerialize["success"] = o.Success
	toSerialize["callOutput"] = o.CallOutput
	if !IsNil(o.TransactionId) {
		toSerialize["transactionId"] = o.TransactionId
	}
	if !IsNil(o.Progress) {
		toSerialize["progress"] = o.Progress
	}
	toSerialize["flowId"] = o.FlowId
	return toSerialize, nil
}

type NullableInvokeContractV1Response struct {
	value *InvokeContractV1Response
	isSet bool
}

func (v NullableInvokeContractV1Response) Get() *InvokeContractV1Response {
	return v.value
}

func (v *NullableInvokeContractV1Response) Set(val *InvokeContractV1Response) {
	v.value = val
	v.isSet = true
}

func (v NullableInvokeContractV1Response) IsSet() bool {
	return v.isSet
}

func (v *NullableInvokeContractV1Response) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableInvokeContractV1Response(val *InvokeContractV1Response) *NullableInvokeContractV1Response {
	return &NullableInvokeContractV1Response{value: val, isSet: true}
}

func (v NullableInvokeContractV1Response) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableInvokeContractV1Response) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


