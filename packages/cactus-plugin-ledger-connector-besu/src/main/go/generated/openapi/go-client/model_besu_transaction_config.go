/*
Hyperledger Cactus Plugin - Connector Besu

Can perform basic tasks on a Besu ledger

API version: 2.1.0
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-besu

import (
	"encoding/json"
)

// checks if the BesuTransactionConfig type satisfies the MappedNullable interface at compile time
var _ MappedNullable = &BesuTransactionConfig{}

// BesuTransactionConfig struct for BesuTransactionConfig
type BesuTransactionConfig struct {
	RawTransaction *string `json:"rawTransaction,omitempty"`
	From *Web3BlockHeaderTimestamp `json:"from,omitempty"`
	To *BesuTransactionConfigTo `json:"to,omitempty"`
	Value *Web3BlockHeaderTimestamp `json:"value,omitempty"`
	Gas *Web3BlockHeaderTimestamp `json:"gas,omitempty"`
	GasPrice *Web3BlockHeaderTimestamp `json:"gasPrice,omitempty"`
	Nonce *float32 `json:"nonce,omitempty"`
	Data *BesuTransactionConfigTo `json:"data,omitempty"`
	AdditionalProperties map[string]interface{}
}

type _BesuTransactionConfig BesuTransactionConfig

// NewBesuTransactionConfig instantiates a new BesuTransactionConfig object
// This constructor will assign default values to properties that have it defined,
// and makes sure properties required by API are set, but the set of arguments
// will change when the set of required properties is changed
func NewBesuTransactionConfig() *BesuTransactionConfig {
	this := BesuTransactionConfig{}
	return &this
}

// NewBesuTransactionConfigWithDefaults instantiates a new BesuTransactionConfig object
// This constructor will only assign default values to properties that have it defined,
// but it doesn't guarantee that properties required by API are set
func NewBesuTransactionConfigWithDefaults() *BesuTransactionConfig {
	this := BesuTransactionConfig{}
	return &this
}

// GetRawTransaction returns the RawTransaction field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetRawTransaction() string {
	if o == nil || IsNil(o.RawTransaction) {
		var ret string
		return ret
	}
	return *o.RawTransaction
}

// GetRawTransactionOk returns a tuple with the RawTransaction field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetRawTransactionOk() (*string, bool) {
	if o == nil || IsNil(o.RawTransaction) {
		return nil, false
	}
	return o.RawTransaction, true
}

// HasRawTransaction returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasRawTransaction() bool {
	if o != nil && !IsNil(o.RawTransaction) {
		return true
	}

	return false
}

// SetRawTransaction gets a reference to the given string and assigns it to the RawTransaction field.
func (o *BesuTransactionConfig) SetRawTransaction(v string) {
	o.RawTransaction = &v
}

// GetFrom returns the From field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetFrom() Web3BlockHeaderTimestamp {
	if o == nil || IsNil(o.From) {
		var ret Web3BlockHeaderTimestamp
		return ret
	}
	return *o.From
}

// GetFromOk returns a tuple with the From field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetFromOk() (*Web3BlockHeaderTimestamp, bool) {
	if o == nil || IsNil(o.From) {
		return nil, false
	}
	return o.From, true
}

// HasFrom returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasFrom() bool {
	if o != nil && !IsNil(o.From) {
		return true
	}

	return false
}

// SetFrom gets a reference to the given Web3BlockHeaderTimestamp and assigns it to the From field.
func (o *BesuTransactionConfig) SetFrom(v Web3BlockHeaderTimestamp) {
	o.From = &v
}

// GetTo returns the To field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetTo() BesuTransactionConfigTo {
	if o == nil || IsNil(o.To) {
		var ret BesuTransactionConfigTo
		return ret
	}
	return *o.To
}

// GetToOk returns a tuple with the To field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetToOk() (*BesuTransactionConfigTo, bool) {
	if o == nil || IsNil(o.To) {
		return nil, false
	}
	return o.To, true
}

// HasTo returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasTo() bool {
	if o != nil && !IsNil(o.To) {
		return true
	}

	return false
}

// SetTo gets a reference to the given BesuTransactionConfigTo and assigns it to the To field.
func (o *BesuTransactionConfig) SetTo(v BesuTransactionConfigTo) {
	o.To = &v
}

// GetValue returns the Value field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetValue() Web3BlockHeaderTimestamp {
	if o == nil || IsNil(o.Value) {
		var ret Web3BlockHeaderTimestamp
		return ret
	}
	return *o.Value
}

// GetValueOk returns a tuple with the Value field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetValueOk() (*Web3BlockHeaderTimestamp, bool) {
	if o == nil || IsNil(o.Value) {
		return nil, false
	}
	return o.Value, true
}

// HasValue returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasValue() bool {
	if o != nil && !IsNil(o.Value) {
		return true
	}

	return false
}

// SetValue gets a reference to the given Web3BlockHeaderTimestamp and assigns it to the Value field.
func (o *BesuTransactionConfig) SetValue(v Web3BlockHeaderTimestamp) {
	o.Value = &v
}

// GetGas returns the Gas field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetGas() Web3BlockHeaderTimestamp {
	if o == nil || IsNil(o.Gas) {
		var ret Web3BlockHeaderTimestamp
		return ret
	}
	return *o.Gas
}

// GetGasOk returns a tuple with the Gas field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetGasOk() (*Web3BlockHeaderTimestamp, bool) {
	if o == nil || IsNil(o.Gas) {
		return nil, false
	}
	return o.Gas, true
}

// HasGas returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasGas() bool {
	if o != nil && !IsNil(o.Gas) {
		return true
	}

	return false
}

// SetGas gets a reference to the given Web3BlockHeaderTimestamp and assigns it to the Gas field.
func (o *BesuTransactionConfig) SetGas(v Web3BlockHeaderTimestamp) {
	o.Gas = &v
}

// GetGasPrice returns the GasPrice field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetGasPrice() Web3BlockHeaderTimestamp {
	if o == nil || IsNil(o.GasPrice) {
		var ret Web3BlockHeaderTimestamp
		return ret
	}
	return *o.GasPrice
}

// GetGasPriceOk returns a tuple with the GasPrice field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetGasPriceOk() (*Web3BlockHeaderTimestamp, bool) {
	if o == nil || IsNil(o.GasPrice) {
		return nil, false
	}
	return o.GasPrice, true
}

// HasGasPrice returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasGasPrice() bool {
	if o != nil && !IsNil(o.GasPrice) {
		return true
	}

	return false
}

// SetGasPrice gets a reference to the given Web3BlockHeaderTimestamp and assigns it to the GasPrice field.
func (o *BesuTransactionConfig) SetGasPrice(v Web3BlockHeaderTimestamp) {
	o.GasPrice = &v
}

// GetNonce returns the Nonce field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetNonce() float32 {
	if o == nil || IsNil(o.Nonce) {
		var ret float32
		return ret
	}
	return *o.Nonce
}

// GetNonceOk returns a tuple with the Nonce field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetNonceOk() (*float32, bool) {
	if o == nil || IsNil(o.Nonce) {
		return nil, false
	}
	return o.Nonce, true
}

// HasNonce returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasNonce() bool {
	if o != nil && !IsNil(o.Nonce) {
		return true
	}

	return false
}

// SetNonce gets a reference to the given float32 and assigns it to the Nonce field.
func (o *BesuTransactionConfig) SetNonce(v float32) {
	o.Nonce = &v
}

// GetData returns the Data field value if set, zero value otherwise.
func (o *BesuTransactionConfig) GetData() BesuTransactionConfigTo {
	if o == nil || IsNil(o.Data) {
		var ret BesuTransactionConfigTo
		return ret
	}
	return *o.Data
}

// GetDataOk returns a tuple with the Data field value if set, nil otherwise
// and a boolean to check if the value has been set.
func (o *BesuTransactionConfig) GetDataOk() (*BesuTransactionConfigTo, bool) {
	if o == nil || IsNil(o.Data) {
		return nil, false
	}
	return o.Data, true
}

// HasData returns a boolean if a field has been set.
func (o *BesuTransactionConfig) HasData() bool {
	if o != nil && !IsNil(o.Data) {
		return true
	}

	return false
}

// SetData gets a reference to the given BesuTransactionConfigTo and assigns it to the Data field.
func (o *BesuTransactionConfig) SetData(v BesuTransactionConfigTo) {
	o.Data = &v
}

func (o BesuTransactionConfig) MarshalJSON() ([]byte, error) {
	toSerialize,err := o.ToMap()
	if err != nil {
		return []byte{}, err
	}
	return json.Marshal(toSerialize)
}

func (o BesuTransactionConfig) ToMap() (map[string]interface{}, error) {
	toSerialize := map[string]interface{}{}
	if !IsNil(o.RawTransaction) {
		toSerialize["rawTransaction"] = o.RawTransaction
	}
	if !IsNil(o.From) {
		toSerialize["from"] = o.From
	}
	if !IsNil(o.To) {
		toSerialize["to"] = o.To
	}
	if !IsNil(o.Value) {
		toSerialize["value"] = o.Value
	}
	if !IsNil(o.Gas) {
		toSerialize["gas"] = o.Gas
	}
	if !IsNil(o.GasPrice) {
		toSerialize["gasPrice"] = o.GasPrice
	}
	if !IsNil(o.Nonce) {
		toSerialize["nonce"] = o.Nonce
	}
	if !IsNil(o.Data) {
		toSerialize["data"] = o.Data
	}

	for key, value := range o.AdditionalProperties {
		toSerialize[key] = value
	}

	return toSerialize, nil
}

func (o *BesuTransactionConfig) UnmarshalJSON(bytes []byte) (err error) {
	varBesuTransactionConfig := _BesuTransactionConfig{}

	if err = json.Unmarshal(bytes, &varBesuTransactionConfig); err == nil {
		*o = BesuTransactionConfig(varBesuTransactionConfig)
	}

	additionalProperties := make(map[string]interface{})

	if err = json.Unmarshal(bytes, &additionalProperties); err == nil {
		delete(additionalProperties, "rawTransaction")
		delete(additionalProperties, "from")
		delete(additionalProperties, "to")
		delete(additionalProperties, "value")
		delete(additionalProperties, "gas")
		delete(additionalProperties, "gasPrice")
		delete(additionalProperties, "nonce")
		delete(additionalProperties, "data")
		o.AdditionalProperties = additionalProperties
	}

	return err
}

type NullableBesuTransactionConfig struct {
	value *BesuTransactionConfig
	isSet bool
}

func (v NullableBesuTransactionConfig) Get() *BesuTransactionConfig {
	return v.value
}

func (v *NullableBesuTransactionConfig) Set(val *BesuTransactionConfig) {
	v.value = val
	v.isSet = true
}

func (v NullableBesuTransactionConfig) IsSet() bool {
	return v.isSet
}

func (v *NullableBesuTransactionConfig) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableBesuTransactionConfig(val *BesuTransactionConfig) *NullableBesuTransactionConfig {
	return &NullableBesuTransactionConfig{value: val, isSet: true}
}

func (v NullableBesuTransactionConfig) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableBesuTransactionConfig) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


