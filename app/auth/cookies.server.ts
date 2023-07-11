import cookieSignature from "cookie-signature";

export async function signCookieValue(value: string, secret: string) {
  return cookieSignature.sign(value, secret);
}

export async function unsignCookieValue(value: string, secret: string) {
  const unsignedValue = cookieSignature.unsign(value, secret);

  if (unsignedValue === false) {
    return null;
  }

  return unsignedValue;
}
