//@ts-nocheck

/**
 * This script will discover all devices in the network and read out all
 * properties and deliver a JSON as device description
 *
 * If a deviceId is given as first parameter then only this device is discovered
 */

import process from "process";
import { enums } from "..";
import { AnyEnum, PropertyIdentifier } from "./enum";
import { BACValue, BacnetObjectIdentity, Sender } from "./types";
import { getEngineeringUnitHumanReadable } from "./EngineeringUnitHumanReadable";
import { BacnetError } from "./client";

// Map the Property types to their enums/bitstrings
const PropertyIdentifierToEnumMap = {};
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.OBJECT_TYPE] =
  enums.ObjectType;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.SEGMENTATION_SUPPORTED] =
  enums.Segmentation;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.EVENT_STATE] =
  enums.EventState;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.UNITS] =
  enums.EngineeringUnits;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.RELIABILITY] =
  enums.Reliability;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.NOTIFY_TYPE] =
  enums.NotifyType;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.POLARITY] = enums.Polarity;
PropertyIdentifierToEnumMap[
  enums.PropertyIdentifier.PROTOCOL_SERVICES_SUPPORTED
] = enums.ServicesSupported;
PropertyIdentifierToEnumMap[
  enums.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED
] = enums.ObjectTypesSupported;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.STATUS_FLAGS] =
  enums.StatusFlags;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.LIMIT_ENABLE] =
  enums.LimitEnable;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.EVENT_ENABLE] =
  enums.EventTransitionBits;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.ACKED_TRANSITIONS] =
  enums.EventTransitionBits;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.SYSTEM_STATUS] =
  enums.DeviceStatus;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.SYSTEM_STATUS] =
  enums.DeviceStatus;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.ACK_REQUIRED] =
  enums.EventTransitionBits;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.LOGGING_TYPE] =
  enums.LoggingType;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.FILE_ACCESS_METHOD] =
  enums.FileAccessMethod;
PropertyIdentifierToEnumMap[enums.PropertyIdentifier.NODE_TYPE] =
  enums.NodeType;

// Sometimes the Map needs to be more specific
const ObjectTypeSpecificPropertyIdentifierToEnumMap = {};

ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_INPUT] =
  {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_INPUT][
  enums.PropertyIdentifier.PRESENT_VALUE
] = enums.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_INPUT][
  enums.PropertyIdentifier.MODE
] = enums.BinaryPV;

ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.ANALOG_INPUT] =
  {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.ANALOG_INPUT][
  enums.PropertyIdentifier.PRESENT_VALUE
] = enums.BinaryPV; //????

ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.ANALOG_OUTPUT] =
  {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.ANALOG_OUTPUT][
  enums.PropertyIdentifier.PRESENT_VALUE
] = enums.BinaryPV; //????

ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_OUTPUT] =
  {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_OUTPUT][
  enums.PropertyIdentifier.PRESENT_VALUE
] = enums.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_OUTPUT][
  enums.PropertyIdentifier.RELINQUISH_DEFAULT
] = enums.BinaryPV;

ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_VALUE] =
  {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_VALUE][
  enums.PropertyIdentifier.PRESENT_VALUE
] = enums.BinaryPV;
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_VALUE][
  enums.PropertyIdentifier.RELINQUISH_DEFAULT
] = enums.BinaryPV;

ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.BINARY_LIGHTING_OUTPUT
] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.BINARY_LIGHTING_OUTPUT
][enums.PropertyIdentifier.PRESENT_VALUE] = enums.BinaryLightingPV;

ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.BITSTRING_VALUE
] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.BINARY_VALUE][
  enums.PropertyIdentifier.PRESENT_VALUE
] = enums.BinaryPV; // ???

ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_POINT
] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_POINT
][enums.PropertyIdentifier.PRESENT_VALUE] = enums.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_POINT
][enums.PropertyIdentifier.TRACKING_VALUE] = enums.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_POINT
][enums.PropertyIdentifier.MODE] = enums.LifeSafetyMode;
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_POINT
][enums.PropertyIdentifier.ACCEPTED_MODES] = enums.LifeSafetyMode;
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_POINT
][enums.PropertyIdentifier.SILENCED] = enums.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_POINT
][enums.PropertyIdentifier.OPERATION_EXPECTED] = enums.LifeSafetyOperation;

ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_ZONE
] = {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_ZONE
][enums.PropertyIdentifier.PRESENT_VALUE] = enums.LifeSafetyState;
ObjectTypeSpecificPropertyIdentifierToEnumMap[
  enums.ObjectType.LIFE_SAFETY_ZONE
][enums.PropertyIdentifier.MODE] = enums.LifeSafetyMode;

ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.LOAD_CONTROL] =
  {};
ObjectTypeSpecificPropertyIdentifierToEnumMap[enums.ObjectType.LOAD_CONTROL][
  enums.PropertyIdentifier.PRESENT_VALUE
] = enums.ShedState;

// For Objects we read out All properties if cli parameter --all is provided
const propSubSet = process.argv.includes("--all")
  ? Object.values(enums.PropertyIdentifier)
  : [
      /* normally supported from all devices */
      enums.PropertyIdentifier.OBJECT_IDENTIFIER,
      enums.PropertyIdentifier.OBJECT_NAME,
      enums.PropertyIdentifier.OBJECT_TYPE,
      enums.PropertyIdentifier.PRESENT_VALUE,
      enums.PropertyIdentifier.STATUS_FLAGS,
      enums.PropertyIdentifier.EVENT_STATE,
      enums.PropertyIdentifier.RELIABILITY,
      enums.PropertyIdentifier.OUT_OF_SERVICE,
      enums.PropertyIdentifier.UNITS,
      /* other properties */
      enums.PropertyIdentifier.DESCRIPTION,
      enums.PropertyIdentifier.SYSTEM_STATUS,
      enums.PropertyIdentifier.VENDOR_NAME,
      enums.PropertyIdentifier.VENDOR_IDENTIFIER,
      enums.PropertyIdentifier.MODEL_NAME,
      enums.PropertyIdentifier.FIRMWARE_REVISION,
      enums.PropertyIdentifier.APPLICATION_SOFTWARE_VERSION,
      enums.PropertyIdentifier.LOCATION,
      enums.PropertyIdentifier.LOCAL_DATE,
      enums.PropertyIdentifier.LOCAL_TIME,
      enums.PropertyIdentifier.UTC_OFFSET,
      enums.PropertyIdentifier.DAYLIGHT_SAVINGS_STATUS,
      enums.PropertyIdentifier.PROTOCOL_VERSION,
      enums.PropertyIdentifier.PROTOCOL_REVISION,
      enums.PropertyIdentifier.PROTOCOL_SERVICES_SUPPORTED,
      enums.PropertyIdentifier.PROTOCOL_OBJECT_TYPES_SUPPORTED,
      enums.PropertyIdentifier.OBJECT_LIST,
      enums.PropertyIdentifier.MAX_APDU_LENGTH_ACCEPTED,
      enums.PropertyIdentifier.SEGMENTATION_SUPPORTED,
      enums.PropertyIdentifier.APDU_TIMEOUT,
      enums.PropertyIdentifier.NUMBER_OF_APDU_RETRIES,
      enums.PropertyIdentifier.DEVICE_ADDRESS_BINDING,
      enums.PropertyIdentifier.DATABASE_REVISION,
      enums.PropertyIdentifier.MAX_INFO_FRAMES,
      enums.PropertyIdentifier.MAX_MASTER,
      enums.PropertyIdentifier.ACTIVE_COV_SUBSCRIPTIONS,
      enums.PropertyIdentifier.ACTIVE_COV_MULTIPLE_SUBSCRIPTIONS,
    ];
const debug = process.argv.includes("--debug");

/**
 * Retrieve all properties manually because ReadPropertyMultiple is not available
 * @param address
 * @param objectId
 * @param callback
 * @param propList
 * @param result
 * @returns {*}
 */
function getAllPropertiesManually(
  address,
  objectId,
  callback,
  propList,
  result
) {
  if (!propList) {
    propList = propSubSet.map((x) => x); // Clone the array
  }
  if (!result) {
    result = [];
  }
  if (!propList.length) {
    return callback({
      values: [
        {
          objectId: objectId,
          values: result,
        },
      ],
    });
  }

  const prop = propList.shift();

  // Read only object-list property
  bacnetClient.readProperty(address, objectId, prop, {}, (err, value) => {
    if (!err) {
      if (debug) {
        console.log("Handle value " + prop + ": ", JSON.stringify(value));
      }
      const objRes = value.property;
      objRes.value = value.values;
      result.push(objRes);
    } else {
      // console.log('Device do not contain object ' + enums.getEnumName(enums.PropertyIdentifier, prop));
    }
    getAllPropertiesManually(address, objectId, callback, propList, result);
  });
}

function readBit(buffer, i, bit) {
  return (buffer[i] >> bit) % 2;
}

/**
 * sets a bit in a buffer
 * @param buffer
 * @param i
 * @param bit
 * @param value
 */
function setBit(buffer, i, bit, value) {
  if (value === 0) {
    buffer[i] &= ~(1 << bit);
  } else {
    buffer[i] |= 1 << bit;
  }
}

function handleBitString(buffer: Buffer, bitsUsed: number, usedEnum: AnyEnum) {
  const res: number[] = [];
  for (let i = 0; i < bitsUsed; i++) {
    const bufferIndex = Math.floor(i / 8);
    if (readBit(buffer, bufferIndex, i % 8)) {
      res.push(enums.getEnumName(usedEnum, i));
    }
  }
  return res;
}

/**
 * Parses a property value
 * @param address
 * @param parentType
 * @param value
 * @param supportsMultiple
 * @param callback
 */
export function parseValue(
  address: Sender | Sender["address"],
  objId: PropertyIdentifier,
  parentType: BacnetObjectIdentity["type"] | enums.ObjectType,
  value: BACValue["value"][number],
  supportsMultiple: boolean = false,
  callback: (value: BACValue["value"][number]["value"] | null) => void
) {
  let resValue: BACValue["value"][number]["value"] | null = null;
  let error: BacnetError | null = null;
  if (
    value &&
    value.type &&
    value.value !== null &&
    value.value !== undefined
  ) {
    switch (value.type) {
      case enums.ApplicationTag.NULL:
        // should be null already, but set again
        resValue = null;
        break;
      case enums.ApplicationTag.BOOLEAN:
        // convert number to a real boolean
        resValue = !!value.value;
        break;
      case enums.ApplicationTag.UNSIGNED_INTEGER:
      case enums.ApplicationTag.SIGNED_INTEGER:
      case enums.ApplicationTag.REAL:
      case enums.ApplicationTag.DOUBLE:
      case enums.ApplicationTag.CHARACTER_STRING:
        // datatype should be correct already
        resValue = value.value;
        break;
      case enums.ApplicationTag.DATE:
      case enums.ApplicationTag.TIME:
      case enums.ApplicationTag.TIMESTAMP:
        // datatype should be Date too
        // Javascript do not have date/timestamp only
        resValue = value.value;
        break;
      case enums.ApplicationTag.BIT_STRING:
        // handle bitstrings specific and more generic
        if (
          ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType] &&
          ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId]
        ) {
          resValue = handleBitString(
            value.value.value,
            value.value.bitsUsed,
            ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId]
          );
        } else if (PropertyIdentifierToEnumMap[objId]) {
          resValue = handleBitString(
            value.value.value,
            value.value.bitsUsed,
            PropertyIdentifierToEnumMap[objId]
          );
        } else {
          if (parentType !== enums.ObjectType.BITSTRING_VALUE) {
            console.log(
              "Unknown value for BIT_STRING type for objId " +
                enums.getEnumName(enums.PropertyIdentifier, objId) +
                " and parent type " +
                enums.getEnumName(enums.ObjectType, parentType)
            );
          }
          resValue = value.value;
        }
        break;
      case enums.ApplicationTag.ENUMERATED:
        // handle enumerations specific and more generic
        if (
          ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType] &&
          ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId]
        ) {
          resValue = enums.getEnumName(
            ObjectTypeSpecificPropertyIdentifierToEnumMap[parentType][objId],
            value.value
          );
        } else if (PropertyIdentifierToEnumMap[objId]) {
          resValue = enums.getEnumName(
            PropertyIdentifierToEnumMap[objId],
            value.value
          );
        } else {
          console.log(
            "Unknown value for ENUMERATED type for objId " +
              enums.getEnumName(enums.PropertyIdentifier, objId) +
              " and parent type " +
              enums.getEnumName(enums.ObjectType, parentType)
          );
          resValue = value.value;
        }
        break;
      case enums.ApplicationTag.OBJECTIDENTIFIER:
        // Look up object identifiers
        // Some object identifiers should not be looked up because we end in loops else
        if (
          objId === enums.PropertyIdentifier.OBJECT_IDENTIFIER ||
          objId === enums.PropertyIdentifier.STRUCTURED_OBJECT_LIST ||
          objId === enums.PropertyIdentifier.SUBORDINATE_LIST
        ) {
          resValue = value.value;
        } else if (supportsMultiple) {
          const requestArray = [
            {
              objectId: value.value,
              // meaning read all properties
              properties: [{ id: 8 }],
            },
          ];
          bacnetClient.readPropertyMultiple(
            address,
            requestArray,
            (err, resValue) => {
              //console.log(JSON.stringify(value.value) + ': ' + JSON.stringify(resValue));
              parseDeviceObject(address, resValue, value.value, true, callback);
            }
          );
          return;
        } else {
          getAllPropertiesManually(address, value.value, (result) => {
            parseDeviceObject(address, result, value.value, false, callback);
          });
          return;
        }
        break;
      case enums.ApplicationTag.OCTET_STRING:
        // It is kind of binary data??
        resValue = value.value;
        break;
      case enums.ApplicationTag.ERROR:
        // lookup error class and code
        error = {
          errorClass: enums.getEnumName(
            enums.ErrorClass,
            value.value.errorClass
          ),
          errorCode: enums.getEnumName(enums.ErrorCode, value.value.errorCode),
        };
        resValue = null;
        break;
      case enums.ApplicationTag.OBJECT_PROPERTY_REFERENCE:
      case enums.ApplicationTag.DEVICE_OBJECT_PROPERTY_REFERENCE:
      case enums.ApplicationTag.DEVICE_OBJECT_REFERENCE:
      case enums.ApplicationTag.READ_ACCESS_SPECIFICATION: //???
        resValue = value.value;
        break;
      case enums.ApplicationTag.CONTEXT_SPECIFIC_DECODED:
        parseValue(
          address,
          parentType,
          value.value,
          supportsMultiple,
          callback
        );
        return;
      case enums.ApplicationTag.READ_ACCESS_RESULT: // ????
        resValue = value.value;
        break;
      default:
        console.log(
          "unknown type " + value.type + ": " + JSON.stringify(value)
        );
        resValue = value;
    }
  }

  // format unit to human readable string
  if (objId === enums.PropertyIdentifier.UNITS) {
    const unit =
      typeof resValue === "string"
        ? resValue
        : resValue && enums.getEnumName(enums.EngineeringUnits, resValue);
    const formattedName = unit && getEngineeringUnitHumanReadable(unit);
    if (formattedName) {
      resValue = formattedName;
    }
  }

  // if (objId === Bacnet.enum.PropertyIdentifier.UNITS) {
  //   const unit =
  //     typeof resValue === "string"
  //       ? resValue
  //       : resValue &&
  //         Bacnet.enum.getEnumName(Bacnet.enum.EngineeringUnits, resValue);

  //   const formattedName = unit && getEngineeringUnitHumanReadable(unit);

  //   if (formattedName) {
  //     resValue = formattedName;
  //   }
  // }

  if (resValue === null || resValue === undefined) {
    resValue = " ";
  }

  setImmediate(() => callback(resValue));
}

/**
 * Parse an object structure
 * @param address
 * @param obj
 * @param parent
 * @param supportsMultiple
 * @param callback
 */
function parseDeviceObject(address, obj, parent, supportsMultiple, callback) {
  if (debug) {
    console.log(
      "START parseDeviceObject: " +
        JSON.stringify(parent) +
        " : " +
        JSON.stringify(obj)
    );
  }

  if (!obj) {
    console.log("object not valid on parse device object");
    return;
  }

  if (!obj.values || !Array.isArray(obj.values)) {
    console.log("No device or invalid response");
    callback({ ERROR: "No device or invalid response" });
    return;
  }

  let cbCount = 0;
  let objDef = {};

  const finalize = () => {
    // Normalize and remove single item arrays
    Object.keys(objDef).forEach((devId) => {
      Object.keys(objDef[devId]).forEach((objId) => {
        if (objDef[devId][objId].length === 1) {
          objDef[devId][objId] = objDef[devId][objId][0];
        }
      });
    });
    // If (standard case) only one device was in do not create sub structures)
    if (obj.values.length === 1) {
      objDef = objDef[obj.values[0].objectId.instance];
    }
    if (debug) {
      console.log(
        "END parseDeviceObject: " +
          JSON.stringify(parent) +
          " : " +
          JSON.stringify(objDef)
      );
    }
    callback(objDef);
  };

  obj.values.forEach((devBaseObj) => {
    if (!devBaseObj.objectId) {
      console.log("No device Id found in object data");
      return;
    }
    if (
      devBaseObj.objectId.type === undefined ||
      devBaseObj.objectId.instance === undefined
    ) {
      console.log("No device type or instance found in object data");
      return;
    }
    if (!devBaseObj.values || !Array.isArray(devBaseObj.values)) {
      console.log("No device values response");
      return;
    }
    const deviceId = devBaseObj.objectId.instance;
    objDef[deviceId] = {};
    devBaseObj.values.forEach((devObj) => {
      let objId = enums.getEnumName(enums.PropertyIdentifier, devObj.id);
      if (devObj.index !== 4294967295) {
        objId += "-" + devObj.index;
      }
      if (debug) {
        console.log("Handle Object property:", deviceId, objId, devObj.value);
      }
      devObj.value.forEach((val) => {
        if (JSON.stringify(val.value) === JSON.stringify(parent)) {
          // ignore parent object
          objDef[deviceId][objId] = objDef[deviceId][objId] || [];
          objDef[deviceId][objId].push(val.value);
          return;
        }
        cbCount++;
        parseValue(
          address,
          parent.type,
          val,
          supportsMultiple,
          (parsedValue) => {
            if (debug) {
              console.log(
                "RETURN parsedValue",
                deviceId,
                objId,
                devObj.value,
                parsedValue
              );
            }
            objDef[deviceId][objId] = objDef[deviceId][objId] || [];
            objDef[deviceId][objId].push(parsedValue);
            if (!--cbCount) {
              finalize();
            }
          }
        );
      });
    });
  });
  if (cbCount === 0) {
    finalize();
  }
}

let objectsDone = 0;
/**
 * Print result info object
 * @param deviceId
 * @param obj
 */
function printResultObject(deviceId, obj) {
  objectsDone++;
  console.log(
    `Device ${deviceId} (${objectsDone}/${
      Object.keys(knownDevices).length
    }) read successfully ...`
  );
  console.log(JSON.stringify(obj));
  console.log();
  console.log();

  if (objectsDone === Object.keys(knownDevices).length) {
    setTimeout(() => {
      bacnetClient.close();
      console.log("closed transport " + Date.now());
    }, 1000);
  }
}

let limitToDevice = null;
if (process.argv.length === 3) {
  limitToDevice = parseInt(process.argv[2]);
  if (isNaN(limitToDevice)) {
    limitToDevice = null;
  }
}
/* // create instance of Bacnet
const bacnetClient = new Bacnet({ apduTimeout: 4000, interface: "0.0.0.0" });

// emitted for each new message
bacnetClient.on("message", (msg, rinfo) => {
  console.log(msg);
  if (rinfo) console.log(rinfo);
});

// emitted on errors
bacnetClient.on("error", (err) => {
  console.error(err);
  bacnetClient.close();
});

// emmitted when Bacnet server listens for incoming UDP packages
bacnetClient.on("listening", () => {
  console.log("sent whoIs " + Date.now());
  // discover devices once we are listening
  bacnetClient.whoIs();
});

const knownDevices = [];

// emitted when a new device is discovered in the network
bacnetClient.on("iAm", (device) => {
  // address object of discovered device,
  // just use in subsequent calls that are directed to this device
  const address = device.header.sender;

  //discovered device ID
  const deviceId = device.payload.deviceId;
  if (knownDevices.includes(deviceId)) return;
  if (limitToDevice !== null && limitToDevice !== deviceId) return;

  console.log("Found Device " + deviceId + " on " + JSON.stringify(address));
  knownDevices.push(deviceId);

  const propertyList = [];
  propSubSet.forEach((item) => {
    propertyList.push({ id: item });
  });

  const requestArray = [
    {
      objectId: { type: 8, instance: deviceId },
      properties: propertyList,
    },
  ];

  bacnetClient.readPropertyMultiple(address, requestArray, (err, value) => {
    if (err) {
      console.log(deviceId, "No ReadPropertyMultiple supported:", err.message);
      getAllPropertiesManually(
        address,
        { type: 8, instance: deviceId },
        (result) => {
          parseDeviceObject(
            address,
            result,
            { type: 8, instance: deviceId },
            false,
            (res) => printResultObject(deviceId, res)
          );
        }
      );
    } else {
      console.log(deviceId, "ReadPropertyMultiple supported ...");
      parseDeviceObject(
        address,
        value,
        { type: 8, instance: deviceId },
        true,
        (res) => printResultObject(deviceId, res)
      );
    }
  });
});
 */
