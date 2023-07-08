export function getActionFromFormData(formData: FormData) {
  const action = formData.get("action");

  if (!action || typeof action !== "string") {
    return null;
  }

  return action;
}
