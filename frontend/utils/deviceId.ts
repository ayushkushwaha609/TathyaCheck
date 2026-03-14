import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Crypto from 'expo-crypto';

const DEVICE_ID_KEY = '@tathya/device_id';

let cachedDeviceId: string | null = null;

export async function getDeviceId(): Promise<string> {
  if (cachedDeviceId) return cachedDeviceId;

  let deviceId = await AsyncStorage.getItem(DEVICE_ID_KEY);
  if (!deviceId) {
    deviceId = Crypto.randomUUID();
    await AsyncStorage.setItem(DEVICE_ID_KEY, deviceId);
  }

  cachedDeviceId = deviceId;
  return deviceId;
}
