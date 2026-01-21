/**
 * Utilidades de cifrado para almacenamiento seguro de datos sensibles
 * Usa AES-GCM para cifrado simétrico en el navegador
 */

const ENCRYPTION_KEY_NAME = 'app_session_key';
const ALGORITHM = 'AES-GCM';
const KEY_LENGTH = 256;
const IV_LENGTH = 12; // 96 bits para AES-GCM

/**
 * Genera o recupera una clave de cifrado para la sesión actual
 * La clave se almacena en memoria y se regenera en cada carga de página
 * Para desarrollo: usa una clave fija derivada de un password conocido
 */
let cachedKey: CryptoKey | null = null;

const getEncryptionKey = async (): Promise<CryptoKey> => {
  if (cachedKey) return cachedKey;

  // En desarrollo: usar una clave fija derivada de un password
  if (import.meta.env.DEV) {
    const password = 'dev-session-key-2026'; // Clave fija para desarrollo
    const encoder = new TextEncoder();
    const keyMaterial = await crypto.subtle.importKey(
      'raw',
      encoder.encode(password),
      'PBKDF2',
      false,
      ['deriveBits', 'deriveKey']
    );
    
    cachedKey = await crypto.subtle.deriveKey(
      {
        name: 'PBKDF2',
        salt: encoder.encode('portal-salt'),
        iterations: 100000,
        hash: 'SHA-256',
      },
      keyMaterial,
      { name: ALGORITHM, length: KEY_LENGTH },
      true,
      ['encrypt', 'decrypt']
    );
    
    return cachedKey;
  }

  // En producción: generar una nueva clave única para esta sesión del navegador
  cachedKey = await crypto.subtle.generateKey(
    {
      name: ALGORITHM,
      length: KEY_LENGTH,
    },
    true, // extractable
    ['encrypt', 'decrypt']
  );

  return cachedKey;
};

/**
 * Genera un salt/pepper único basado en características del navegador
 * Esto añade una capa adicional de protección
 */
const getBrowserFingerprint = (): string => {
  const components = [
    navigator.userAgent,
    navigator.language,
    new Date().getTimezoneOffset().toString(),
    screen.colorDepth.toString(),
    screen.width.toString() + 'x' + screen.height.toString(),
  ];
  return components.join('|');
};

/**
 * Convierte un string a ArrayBuffer
 */
const stringToArrayBuffer = (str: string): ArrayBuffer => {
  const encoder = new TextEncoder();
  return encoder.encode(str);
};

/**
 * Convierte un ArrayBuffer a string
 */
const arrayBufferToString = (buffer: ArrayBuffer): string => {
  const decoder = new TextDecoder();
  return decoder.decode(buffer);
};

/**
 * Convierte ArrayBuffer a string Base64
 */
const arrayBufferToBase64 = (buffer: ArrayBuffer): string => {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.byteLength; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary);
};

/**
 * Convierte string Base64 a ArrayBuffer
 */
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binary = atob(base64);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
};

/**
 * Cifra datos usando AES-GCM
 */
export const encryptData = async (data: string): Promise<string> => {
  try {
    const key = await getEncryptionKey();
    
    // Añadir fingerprint del navegador para ofuscación adicional
    const fingerprint = getBrowserFingerprint();
    const dataWithFingerprint = JSON.stringify({
      data,
      fp: fingerprint,
      ts: Date.now(), // timestamp para validación adicional
    });

    // Generar IV aleatorio
    const iv = crypto.getRandomValues(new Uint8Array(IV_LENGTH));

    // Cifrar los datos
    const encryptedBuffer = await crypto.subtle.encrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      stringToArrayBuffer(dataWithFingerprint)
    );

    // Combinar IV + datos cifrados y convertir a Base64
    const combined = new Uint8Array(iv.length + encryptedBuffer.byteLength);
    combined.set(iv, 0);
    combined.set(new Uint8Array(encryptedBuffer), iv.length);

    return arrayBufferToBase64(combined.buffer);
  } catch (error) {
    console.error('Error al cifrar datos:', error);
    throw new Error('Error de cifrado');
  }
};

/**
 * Descifra datos usando AES-GCM
 */
export const decryptData = async (encryptedData: string): Promise<string | null> => {
  try {
    const key = await getEncryptionKey();
    
    // Convertir de Base64 a ArrayBuffer
    const combined = base64ToArrayBuffer(encryptedData);
    
    // Extraer IV y datos cifrados
    const iv = combined.slice(0, IV_LENGTH);
    const data = combined.slice(IV_LENGTH);

    // Descifrar
    const decryptedBuffer = await crypto.subtle.decrypt(
      {
        name: ALGORITHM,
        iv: iv,
      },
      key,
      data
    );

    const decryptedString = arrayBufferToString(decryptedBuffer);
    const parsed = JSON.parse(decryptedString);

    // Validar fingerprint del navegador
    const currentFingerprint = getBrowserFingerprint();
    if (parsed.fp !== currentFingerprint) {
      console.warn('Fingerprint del navegador no coincide');
      return null;
    }

    // Validar que no sea demasiado antiguo (opcional, 24 horas)
    const maxAge = 24 * 60 * 60 * 1000; // 24 horas
    if (Date.now() - parsed.ts > maxAge) {
      console.warn('Datos demasiado antiguos');
      return null;
    }

    return parsed.data;
  } catch (error) {
    console.error('Error al descifrar datos:', error);
    return null;
  }
};

/**
 * Limpia la clave de cifrado de la memoria
 */
export const clearEncryptionKey = (): void => {
  cachedKey = null;
};
