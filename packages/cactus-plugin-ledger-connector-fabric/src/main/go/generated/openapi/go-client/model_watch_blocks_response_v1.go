/*
Hyperledger Cactus Plugin - Connector Fabric

Can perform basic tasks on a fabric ledger

API version: 2.1.0
*/

// Code generated by OpenAPI Generator (https://openapi-generator.tech); DO NOT EDIT.

package cactus-plugin-ledger-connector-fabric

import (
	"encoding/json"
	"fmt"
)

// WatchBlocksResponseV1 - Response block from WatchBlocks endpoint. Depends on 'type' passed in subscription options.
type WatchBlocksResponseV1 struct {
	CactiBlockFullResponseV1 *CactiBlockFullResponseV1
	CactiBlockTransactionsResponseV1 *CactiBlockTransactionsResponseV1
	WatchBlocksCactusErrorResponseV1 *WatchBlocksCactusErrorResponseV1
	WatchBlocksFilteredResponseV1 *WatchBlocksFilteredResponseV1
	WatchBlocksFullResponseV1 *WatchBlocksFullResponseV1
	WatchBlocksPrivateResponseV1 *WatchBlocksPrivateResponseV1
}

// CactiBlockFullResponseV1AsWatchBlocksResponseV1 is a convenience function that returns CactiBlockFullResponseV1 wrapped in WatchBlocksResponseV1
func CactiBlockFullResponseV1AsWatchBlocksResponseV1(v *CactiBlockFullResponseV1) WatchBlocksResponseV1 {
	return WatchBlocksResponseV1{
		CactiBlockFullResponseV1: v,
	}
}

// CactiBlockTransactionsResponseV1AsWatchBlocksResponseV1 is a convenience function that returns CactiBlockTransactionsResponseV1 wrapped in WatchBlocksResponseV1
func CactiBlockTransactionsResponseV1AsWatchBlocksResponseV1(v *CactiBlockTransactionsResponseV1) WatchBlocksResponseV1 {
	return WatchBlocksResponseV1{
		CactiBlockTransactionsResponseV1: v,
	}
}

// WatchBlocksCactusErrorResponseV1AsWatchBlocksResponseV1 is a convenience function that returns WatchBlocksCactusErrorResponseV1 wrapped in WatchBlocksResponseV1
func WatchBlocksCactusErrorResponseV1AsWatchBlocksResponseV1(v *WatchBlocksCactusErrorResponseV1) WatchBlocksResponseV1 {
	return WatchBlocksResponseV1{
		WatchBlocksCactusErrorResponseV1: v,
	}
}

// WatchBlocksFilteredResponseV1AsWatchBlocksResponseV1 is a convenience function that returns WatchBlocksFilteredResponseV1 wrapped in WatchBlocksResponseV1
func WatchBlocksFilteredResponseV1AsWatchBlocksResponseV1(v *WatchBlocksFilteredResponseV1) WatchBlocksResponseV1 {
	return WatchBlocksResponseV1{
		WatchBlocksFilteredResponseV1: v,
	}
}

// WatchBlocksFullResponseV1AsWatchBlocksResponseV1 is a convenience function that returns WatchBlocksFullResponseV1 wrapped in WatchBlocksResponseV1
func WatchBlocksFullResponseV1AsWatchBlocksResponseV1(v *WatchBlocksFullResponseV1) WatchBlocksResponseV1 {
	return WatchBlocksResponseV1{
		WatchBlocksFullResponseV1: v,
	}
}

// WatchBlocksPrivateResponseV1AsWatchBlocksResponseV1 is a convenience function that returns WatchBlocksPrivateResponseV1 wrapped in WatchBlocksResponseV1
func WatchBlocksPrivateResponseV1AsWatchBlocksResponseV1(v *WatchBlocksPrivateResponseV1) WatchBlocksResponseV1 {
	return WatchBlocksResponseV1{
		WatchBlocksPrivateResponseV1: v,
	}
}


// Unmarshal JSON data into one of the pointers in the struct
func (dst *WatchBlocksResponseV1) UnmarshalJSON(data []byte) error {
	var err error
	match := 0
	// try to unmarshal data into CactiBlockFullResponseV1
	err = newStrictDecoder(data).Decode(&dst.CactiBlockFullResponseV1)
	if err == nil {
		jsonCactiBlockFullResponseV1, _ := json.Marshal(dst.CactiBlockFullResponseV1)
		if string(jsonCactiBlockFullResponseV1) == "{}" { // empty struct
			dst.CactiBlockFullResponseV1 = nil
		} else {
			match++
		}
	} else {
		dst.CactiBlockFullResponseV1 = nil
	}

	// try to unmarshal data into CactiBlockTransactionsResponseV1
	err = newStrictDecoder(data).Decode(&dst.CactiBlockTransactionsResponseV1)
	if err == nil {
		jsonCactiBlockTransactionsResponseV1, _ := json.Marshal(dst.CactiBlockTransactionsResponseV1)
		if string(jsonCactiBlockTransactionsResponseV1) == "{}" { // empty struct
			dst.CactiBlockTransactionsResponseV1 = nil
		} else {
			match++
		}
	} else {
		dst.CactiBlockTransactionsResponseV1 = nil
	}

	// try to unmarshal data into WatchBlocksCactusErrorResponseV1
	err = newStrictDecoder(data).Decode(&dst.WatchBlocksCactusErrorResponseV1)
	if err == nil {
		jsonWatchBlocksCactusErrorResponseV1, _ := json.Marshal(dst.WatchBlocksCactusErrorResponseV1)
		if string(jsonWatchBlocksCactusErrorResponseV1) == "{}" { // empty struct
			dst.WatchBlocksCactusErrorResponseV1 = nil
		} else {
			match++
		}
	} else {
		dst.WatchBlocksCactusErrorResponseV1 = nil
	}

	// try to unmarshal data into WatchBlocksFilteredResponseV1
	err = newStrictDecoder(data).Decode(&dst.WatchBlocksFilteredResponseV1)
	if err == nil {
		jsonWatchBlocksFilteredResponseV1, _ := json.Marshal(dst.WatchBlocksFilteredResponseV1)
		if string(jsonWatchBlocksFilteredResponseV1) == "{}" { // empty struct
			dst.WatchBlocksFilteredResponseV1 = nil
		} else {
			match++
		}
	} else {
		dst.WatchBlocksFilteredResponseV1 = nil
	}

	// try to unmarshal data into WatchBlocksFullResponseV1
	err = newStrictDecoder(data).Decode(&dst.WatchBlocksFullResponseV1)
	if err == nil {
		jsonWatchBlocksFullResponseV1, _ := json.Marshal(dst.WatchBlocksFullResponseV1)
		if string(jsonWatchBlocksFullResponseV1) == "{}" { // empty struct
			dst.WatchBlocksFullResponseV1 = nil
		} else {
			match++
		}
	} else {
		dst.WatchBlocksFullResponseV1 = nil
	}

	// try to unmarshal data into WatchBlocksPrivateResponseV1
	err = newStrictDecoder(data).Decode(&dst.WatchBlocksPrivateResponseV1)
	if err == nil {
		jsonWatchBlocksPrivateResponseV1, _ := json.Marshal(dst.WatchBlocksPrivateResponseV1)
		if string(jsonWatchBlocksPrivateResponseV1) == "{}" { // empty struct
			dst.WatchBlocksPrivateResponseV1 = nil
		} else {
			match++
		}
	} else {
		dst.WatchBlocksPrivateResponseV1 = nil
	}

	if match > 1 { // more than 1 match
		// reset to nil
		dst.CactiBlockFullResponseV1 = nil
		dst.CactiBlockTransactionsResponseV1 = nil
		dst.WatchBlocksCactusErrorResponseV1 = nil
		dst.WatchBlocksFilteredResponseV1 = nil
		dst.WatchBlocksFullResponseV1 = nil
		dst.WatchBlocksPrivateResponseV1 = nil

		return fmt.Errorf("data matches more than one schema in oneOf(WatchBlocksResponseV1)")
	} else if match == 1 {
		return nil // exactly one match
	} else { // no match
		return fmt.Errorf("data failed to match schemas in oneOf(WatchBlocksResponseV1)")
	}
}

// Marshal data from the first non-nil pointers in the struct to JSON
func (src WatchBlocksResponseV1) MarshalJSON() ([]byte, error) {
	if src.CactiBlockFullResponseV1 != nil {
		return json.Marshal(&src.CactiBlockFullResponseV1)
	}

	if src.CactiBlockTransactionsResponseV1 != nil {
		return json.Marshal(&src.CactiBlockTransactionsResponseV1)
	}

	if src.WatchBlocksCactusErrorResponseV1 != nil {
		return json.Marshal(&src.WatchBlocksCactusErrorResponseV1)
	}

	if src.WatchBlocksFilteredResponseV1 != nil {
		return json.Marshal(&src.WatchBlocksFilteredResponseV1)
	}

	if src.WatchBlocksFullResponseV1 != nil {
		return json.Marshal(&src.WatchBlocksFullResponseV1)
	}

	if src.WatchBlocksPrivateResponseV1 != nil {
		return json.Marshal(&src.WatchBlocksPrivateResponseV1)
	}

	return nil, nil // no data in oneOf schemas
}

// Get the actual instance
func (obj *WatchBlocksResponseV1) GetActualInstance() (interface{}) {
	if obj == nil {
		return nil
	}
	if obj.CactiBlockFullResponseV1 != nil {
		return obj.CactiBlockFullResponseV1
	}

	if obj.CactiBlockTransactionsResponseV1 != nil {
		return obj.CactiBlockTransactionsResponseV1
	}

	if obj.WatchBlocksCactusErrorResponseV1 != nil {
		return obj.WatchBlocksCactusErrorResponseV1
	}

	if obj.WatchBlocksFilteredResponseV1 != nil {
		return obj.WatchBlocksFilteredResponseV1
	}

	if obj.WatchBlocksFullResponseV1 != nil {
		return obj.WatchBlocksFullResponseV1
	}

	if obj.WatchBlocksPrivateResponseV1 != nil {
		return obj.WatchBlocksPrivateResponseV1
	}

	// all schemas are nil
	return nil
}

type NullableWatchBlocksResponseV1 struct {
	value *WatchBlocksResponseV1
	isSet bool
}

func (v NullableWatchBlocksResponseV1) Get() *WatchBlocksResponseV1 {
	return v.value
}

func (v *NullableWatchBlocksResponseV1) Set(val *WatchBlocksResponseV1) {
	v.value = val
	v.isSet = true
}

func (v NullableWatchBlocksResponseV1) IsSet() bool {
	return v.isSet
}

func (v *NullableWatchBlocksResponseV1) Unset() {
	v.value = nil
	v.isSet = false
}

func NewNullableWatchBlocksResponseV1(val *WatchBlocksResponseV1) *NullableWatchBlocksResponseV1 {
	return &NullableWatchBlocksResponseV1{value: val, isSet: true}
}

func (v NullableWatchBlocksResponseV1) MarshalJSON() ([]byte, error) {
	return json.Marshal(v.value)
}

func (v *NullableWatchBlocksResponseV1) UnmarshalJSON(src []byte) error {
	v.isSet = true
	return json.Unmarshal(src, &v.value)
}


